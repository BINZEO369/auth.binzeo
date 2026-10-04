-- BINZEO security activity-log verification
-- READ-ONLY: this script only runs SELECT statements.
-- Run in Supabase SQL Editor. Change the interval below if needed.

-- 1) Coverage summary by security activity type.
with params as (select now() - interval '30 days' as since)
select
  activity_type,
  count(*)::integer as activity_count,
  min(created_at) as first_seen,
  max(created_at) as last_seen
from public.user_activity_logs, params
where created_at >= params.since
  and activity_type in (
    'password_reset_requested',
    'password_reset_completed',
    'password_change_requested',
    'password_changed',
    'two_factor_enabled',
    'two_factor_disabled',
    'password_login_success',
    'password_login_2fa_success',
    'password_login_blocked',
    'passkey_login_success',
    'temporary_token_login_success',
    'logout_success'
  )
group by activity_type
order by last_seen desc
limit 50;

-- 2) Recent security activity timeline (no email addresses or codes).
with params as (select now() - interval '30 days' as since)
select
  id,
  user_id,
  activity_type,
  activity_description,
  ip_address,
  device_id,
  metadata,
  created_at
from public.user_activity_logs, params
where created_at >= params.since
  and activity_type in (
    'password_reset_requested',
    'password_reset_completed',
    'password_change_requested',
    'password_changed',
    'two_factor_enabled',
    'two_factor_disabled',
    'password_login_success',
    'password_login_2fa_success',
    'password_login_blocked',
    'passkey_login_success',
    'temporary_token_login_success',
    'logout_success'
  )
order by created_at desc
limit 100;

-- 3) Login-history coverage: every successful login should have a matching
-- activity-log event for the same user within +/- 5 minutes.
with login_rows as (
  select id, user_id, login_method, login_status, ip_address, login_at
  from public.user_login_history
  where login_at >= now() - interval '30 days'
    and login_status = 'success'
  order by login_at desc
  limit 500
), expected as (
  select
    login_rows.*,
    case login_method
      when 'password' then 'password_login_success'
      when 'password_2fa' then 'password_login_2fa_success'
      when 'passkey' then 'passkey_login_success'
      when 'temporary_token' then 'temporary_token_login_success'
      else null
    end as expected_activity_type
  from login_rows
)
select
  expected.id as login_history_id,
  expected.user_id,
  expected.login_method,
  expected.login_at,
  expected.ip_address,
  expected.expected_activity_type,
  activity.id as activity_log_id,
  activity.activity_type as recorded_activity_type,
  activity.created_at as activity_created_at,
  case when activity.id is null then 'MISSING_ACTIVITY_LOG' else 'OK' end as audit_result
from expected
left join lateral (
  select a.id, a.activity_type, a.created_at
  from public.user_activity_logs a
  where a.user_id = expected.user_id
    and (expected.expected_activity_type is null or a.activity_type = expected.expected_activity_type)
    and a.created_at between expected.login_at - interval '5 minutes' and expected.login_at + interval '5 minutes'
  order by abs(extract(epoch from (a.created_at - expected.login_at)))
  limit 1
) activity on true
order by expected.login_at desc
limit 500;

-- 4) Password-reset/password-change coverage.
-- A completed reset/change should have the corresponding completion activity.
with completed_password_events as (
  select
    id,
    user_id,
    source,
    challenge_id,
    changed_at
  from public.password_change_events
  where changed_at >= now() - interval '30 days'
  order by changed_at desc
  limit 500
)
select
  e.id as password_event_id,
  e.user_id,
  e.source,
  e.changed_at,
  a.id as activity_log_id,
  a.activity_type,
  a.created_at as activity_created_at,
  case
    when a.id is null then 'MISSING_ACTIVITY_LOG'
    else 'OK'
  end as audit_result
from completed_password_events e
left join lateral (
  select id, activity_type, created_at
  from public.user_activity_logs
  where user_id = e.user_id
    and activity_type = case when e.source = 'reset' then 'password_reset_completed' else 'password_changed' end
    and created_at between e.changed_at - interval '5 minutes' and e.changed_at + interval '5 minutes'
  order by abs(extract(epoch from (created_at - e.changed_at)))
  limit 1
) a on true
order by e.changed_at desc
limit 500;

-- 5) Password OTP request coverage. This checks request activity against
-- delivered/created reset challenges without exposing the OTP hash or code.
select
  c.id as challenge_id,
  c.user_id,
  c.purpose,
  c.email_delivery_status,
  c.created_at as challenge_created_at,
  c.email_sent_at,
  a.id as activity_log_id,
  a.activity_type,
  case when a.id is null then 'MISSING_ACTIVITY_LOG' else 'OK' end as audit_result
from public.password_reset_challenges c
left join lateral (
  select id, activity_type, created_at
  from public.user_activity_logs
  where user_id = c.user_id
    and activity_type = case when c.purpose = 'reset' then 'password_reset_requested' else 'password_change_requested' end
    and created_at between c.created_at - interval '5 minutes' and c.created_at + interval '5 minutes'
  order by abs(extract(epoch from (created_at - c.created_at)))
  limit 1
) a on true
where c.created_at >= now() - interval '30 days'
order by c.created_at desc
limit 500;

-- 6) 2FA setting audit coverage. Every enabled_at/disabled_at transition
-- should have a corresponding user_activity_logs row.
with transitions as (
  select user_id, 'two_factor_enabled'::text as expected_activity_type, enabled_at as transition_at
  from public.user_two_factor_settings
  where enabled_at >= now() - interval '30 days'
  union all
  select user_id, 'two_factor_disabled'::text, disabled_at
  from public.user_two_factor_settings
  where disabled_at >= now() - interval '30 days'
)
select
  t.user_id,
  t.expected_activity_type,
  t.transition_at,
  a.id as activity_log_id,
  a.activity_type as recorded_activity_type,
  a.created_at as activity_created_at,
  case when a.id is null then 'MISSING_ACTIVITY_LOG' else 'OK' end as audit_result
from transitions t
left join lateral (
  select id, activity_type, created_at
  from public.user_activity_logs
  where user_id = t.user_id
    and activity_type = t.expected_activity_type
    and created_at between t.transition_at - interval '5 minutes' and t.transition_at + interval '5 minutes'
  order by abs(extract(epoch from (created_at - t.transition_at)))
  limit 1
) a on true
order by t.transition_at desc
limit 500;

-- 7) 2FA email/authentication delivery audit. This is separate from the
-- user_activity_logs table and confirms OTP/notification delivery records.
select
  id,
  user_id,
  event_type,
  login_method,
  status,
  ip_address,
  sent_at,
  verified_at,
  provider_message_id,
  created_at
from public.two_factor_authentication_events
where created_at >= now() - interval '30 days'
order by created_at desc
limit 200;

-- 8) One compact PASS/FAIL summary for the main checks.
with
login_check as (
  select count(*) filter (where a.id is null)::integer as missing_count
  from public.user_login_history l
  left join lateral (
    select id
    from public.user_activity_logs a
    where a.user_id = l.user_id
      and a.created_at between l.login_at - interval '5 minutes' and l.login_at + interval '5 minutes'
      and a.activity_type in ('password_login_success','password_login_2fa_success','passkey_login_success','temporary_token_login_success')
    limit 1
  ) a on true
  where l.login_at >= now() - interval '30 days' and l.login_status = 'success'
),
password_check as (
  select count(*) filter (where a.id is null)::integer as missing_count
  from public.password_change_events p
  left join lateral (
    select id
    from public.user_activity_logs a
    where a.user_id = p.user_id
      and a.activity_type in ('password_reset_completed','password_changed')
      and a.created_at between p.changed_at - interval '5 minutes' and p.changed_at + interval '5 minutes'
    limit 1
  ) a on true
  where p.changed_at >= now() - interval '30 days'
),
two_factor_check as (
  select count(*) filter (where a.id is null)::integer as missing_count
  from public.user_two_factor_settings s
  left join lateral (
    select id
    from public.user_activity_logs a
    where a.user_id = s.user_id
      and a.activity_type in ('two_factor_enabled','two_factor_disabled')
      and a.created_at >= now() - interval '30 days'
    limit 1
  ) a on true
  where s.updated_at >= now() - interval '30 days'
)
select 'login_history_activity' as check_name, missing_count, case when missing_count = 0 then 'PASS' else 'FAIL' end as result from login_check
union all
select 'password_change_activity', missing_count, case when missing_count = 0 then 'PASS' else 'FAIL' end from password_check
union all
select 'two_factor_setting_activity', missing_count, case when missing_count = 0 then 'PASS' else 'FAIL' end from two_factor_check
limit 10;
