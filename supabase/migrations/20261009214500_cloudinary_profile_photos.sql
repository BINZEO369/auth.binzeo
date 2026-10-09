alter table public.profiles
  add column if not exists profile_photo_public_id text;
