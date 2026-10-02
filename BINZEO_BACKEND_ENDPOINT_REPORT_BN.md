# BINZEO Backend Endpoint পূর্ণ রিপোর্ট

**Repository:** `BINZEO369/auth.binzeo`  
**Branch:** `main`  
**সর্বশেষ endpoint commit:** `748637b Add user security database endpoints`  
**মোট backend route:** ২৮টি  
**আগের endpoint:** ২১টি  
**নতুন endpoint:** ৭টি

---

## ১. সংক্ষিপ্ত সারাংশ

এই রিপোর্টে BINZEO website-এর সব backend API endpoint-এর পূর্ণ তালিকা দেওয়া হলো।

- আগের ২১টি endpoint অপরিবর্তিত রাখা হয়েছে
- নতুন ৭টি endpoint শুধু database-connected user security table-এর জন্য তৈরি করা হয়েছে
- কোনো frontend page বা UI তৈরি করা হয়নি
- কোনো admin endpoint তৈরি বা পরিবর্তন করা হয়নি
- কোনো existing endpoint মুছে ফেলা হয়নি
- নতুন endpoint-গুলো authenticated user এবং Supabase database function/table-এর সঙ্গে সংযুক্ত

---

# ২. পুরাতন / আগে থেকে থাকা endpoint

## Authentication endpoints

### 2.1 Login

```http
POST /api/auth/login
```

**Database usage:** `profiles` এবং Supabase Auth  
**কাজ:** Email/password দিয়ে login, profile load এবং session তৈরি করে।

---

### 2.2 Signup

```http
POST /api/auth/signup
```

**Database usage:** Supabase Auth এবং `profiles`  
**কাজ:** নতুন user তৈরি করে এবং profile information সংরক্ষণ করে।

---

### 2.3 Session

```http
GET /api/auth/session
```

**Database usage:** Supabase Auth এবং `profiles`  
**কাজ:** বর্তমানে login করা user-এর session ও profile তথ্য return করে।

---

### 2.4 Logout

```http
POST /api/auth/logout
```

**Database usage:** Supabase Auth  
**কাজ:** বর্তমান user-এর Supabase session sign out করে।

---

### 2.5 Auth callback

```http
GET /api/auth/callback
```

**Database usage:** Supabase Auth  
**কাজ:** Email confirmation অথবা OAuth callback code exchange করে session তৈরি করে।

---

## Reference data endpoints

### 2.6 Countries

```http
GET /api/countries
```

**Database table:** `countries`  
**কাজ:** Address form-এর জন্য country list return করে।

---

### 2.7 Sectors

```http
GET /api/sectors
```

**Database table:** `sectors`  
**কাজ:** Available sector list return করে।

---

## Public profile endpoint

### 2.8 Public profile

```http
GET /api/profile/:binzeoId
```

উদাহরণ:

```http
GET /api/profile/BZ-U-XXXXXX
```

**Database tables:**

- `profiles`
- `user_contacts`
- `user_sector_access`

**কাজ:** BINZEO user ID ব্যবহার করে public profile information return করে।

---

## User profile endpoints

### 2.9 Get profile

```http
GET /api/user/profile
```

**Database table:** `profiles`  
**কাজ:** Current user-এর profile information return করে।

---

### 2.10 Update profile

```http
PATCH /api/user/profile
```

**Database table:** `profiles`  
**কাজ:** Current user-এর profile information update করে।

---

## Contact endpoints

### 2.11 List contacts

```http
GET /api/user/contacts
```

**Database table:** `user_contacts`  
**কাজ:** Current user-এর contact list return করে।

### 2.12 Create contact

```http
POST /api/user/contacts
```

**Database table:** `user_contacts`  
**কাজ:** Website, social, messenger বা অন্য contact তৈরি করে।

### 2.13 Update contact

```http
PATCH /api/user/contacts/:id
```

**Database table:** `user_contacts`  
**কাজ:** নির্দিষ্ট contact update করে।

### 2.14 Delete contact

```http
DELETE /api/user/contacts/:id
```

**Database table:** `user_contacts`  
**কাজ:** নির্দিষ্ট contact delete করে।

---

## Address endpoints

### 2.15 List addresses

```http
GET /api/user/addresses
```

**Database table:** `user_addresses`  
**কাজ:** Current user-এর address list return করে।

### 2.16 Create address

```http
POST /api/user/addresses
```

**Database table:** `user_addresses`  
**কাজ:** Home, work, billing, shipping অথবা অন্য address তৈরি করে।

### 2.17 Update address

```http
PATCH /api/user/addresses/:id
```

**Database table:** `user_addresses`  
**কাজ:** নির্দিষ্ট address update করে।

### 2.18 Delete address

```http
DELETE /api/user/addresses/:id
```

**Database table:** `user_addresses`  
**কাজ:** নির্দিষ্ট address delete করে।

---

## Device endpoints

### 2.19 List devices

```http
GET /api/user/devices
```

**Database table:** `user_devices`  
**কাজ:** Current user-এর registered device list return করে।

### 2.20 Update device

```http
PATCH /api/user/devices/:id
```

**Database table:** `user_devices`  
**কাজ:** Device name অথবা trusted status update করে।

### 2.21 Delete device

```http
DELETE /api/user/devices/:id
```

**Database table:** `user_devices`  
**কাজ:** নির্দিষ্ট device remove করে।

---

## Security ও activity endpoints

### 2.22 Login history

```http
GET /api/user/login-history
```

**Database table:** `user_login_history`  
**কাজ:** Login, failed login, logout এবং device-related login history return করে।

### 2.23 Activity logs

```http
GET /api/user/activity-logs
```

**Database table:** `user_activity_logs`  
**কাজ:** User-এর activity এবং account change history return করে।

### 2.24 Auth methods

```http
GET /api/user/auth-methods
```

**Database table:** `user_auth_methods`  
**কাজ:** User-এর linked authentication method summary return করে।

### 2.25 Verification records

```http
GET /api/user/verification-records
```

**Database table:** `user_verification_records`  
**কাজ:** Email, phone বা identity verification status return করে।

---

## Sector access endpoints

### 2.26 List sector access

```http
GET /api/user/sector-access
```

**Database tables:**

- `user_sector_access`
- `sectors`

**কাজ:** User কোন কোন sector-এ যুক্ত আছে তা return করে।

### 2.27 Join sector

```http
POST /api/user/sector-access
```

**Database table:** `user_sector_access`  
**কাজ:** User-কে কোনো sector-এ যুক্ত করে।

### 2.28 Update sector access

```http
PATCH /api/user/sector-access/:sectorId
```

**Database table:** `user_sector_access`  
**কাজ:** Sector access status update করে।

### 2.29 Remove sector access

```http
DELETE /api/user/sector-access/:sectorId
```

**Database table:** `user_sector_access`  
**কাজ:** User-কে কোনো sector থেকে সরিয়ে দেয়।

> নোট: উপরের পুরাতন endpoint file count ২১টি route file হলেও একই route file-এর মধ্যে একাধিক HTTP method আছে। তাই method count route-file count-এর চেয়ে বেশি।

---

# ৩. নতুন তৈরি করা endpoint

নতুন ৭টি endpoint তৈরি করা হয়েছে শুধুমাত্র database-connected user security feature-এর জন্য।

## 3.1 Profile ID history

```http
GET /api/user/profile-id-history
```

**Database table:** `profile_id_history`  
**কাজ:** Current user-এর BINZEO ID পরিবর্তনের history return করে।

**Security:**

- শুধু authenticated user access করতে পারবে
- শুধু নিজের `user_id` অনুযায়ী history দেখবে
- অন্য user-এর history দেখা যাবে না

---

## 3.2 List user passkeys

```http
GET /api/user/passkeys
```

**Database table:** `user_passkeys`  
**কাজ:** User-এর registered passkey metadata return করে।

**Response-এ পাঠানো হয় না:**

- Credential ID-এর raw sensitive material
- Public key data
- কোনো private key বা biometric data

**Safe metadata:**

- Device name
- Authenticator type
- Transports
- Last used time
- Expiry
- Revoked status
- Created time

---

## 3.3 Revoke passkey

```http
DELETE /api/user/passkeys/:id
```

**Database function:** `revoke_my_passkey(passkey_id)`  
**কাজ:** Current user-এর নিজের passkey revoke করে।

**Security:**

- UUID validation আছে
- Database-এর existing secure function ব্যবহার করে
- অন্য user-এর passkey revoke করা যাবে না

---

## 3.4 Issue email verification challenge

```http
POST /api/user/email-verification
```

**Database function:** `issue_email_verification_code(target_user_id, request_ip)`  
**কাজ:** Current user-এর জন্য email verification challenge তৈরি করে।

**Return করে:**

- `challenge_id`
- `expires_at`

**Return করে না:**

- Verification code

Verification code response-এ না পাঠিয়ে ভবিষ্যতে email provider-এর মাধ্যমে পাঠানোর জন্য backend design রাখা হয়েছে।

---

## 3.5 Verify email verification code

```http
POST /api/user/email-verification/verify
```

Request body:

```json
{
  "challenge_id": "uuid",
  "code": "123456"
}
```

**Database function:** `verify_email_verification_code(challenge_id, submitted_code)`  
**কাজ:** Email verification code verify করে।

**Security:**

- Challenge UUID validation আছে
- Code length validation আছে
- Challenge current user-এর কিনা যাচাই করে
- Invalid বা expired code reject করে

---

## 3.6 Issue passkey challenge

```http
POST /api/user/passkey-challenges
```

Request body optional:

```json
{
  "purpose": "authentication",
  "duration_minutes": 5
}
```

**Allowed purpose:**

```text
registration
authentication
recovery
```

**Allowed duration:**

```text
1, 2, 3, 4 অথবা 5 মিনিট
```

**Database function:** `issue_passkey_challenge(...)`  
**কাজ:** WebAuthn/passkey registration, authentication বা recovery-এর জন্য challenge তৈরি করে।

**Return করে:**

- `challenge_id`
- `challenge`
- `expires_at`
- `duration_minutes`

---

## 3.7 Consume passkey challenge

```http
POST /api/user/passkey-challenges/consume
```

Request body:

```json
{
  "challenge_id": "uuid",
  "submitted_challenge": "challenge-value"
}
```

**Database function:** `consume_passkey_challenge(challenge_id, submitted_challenge)`  
**কাজ:** Passkey challenge valid, expired অথবা consumed কিনা যাচাই করে।

**Security:**

- Challenge current user-এর কিনা যাচাই করে
- Invalid challenge reject করে
- Expired challenge reject করে
- Valid হলে purpose এবং expiry return করে

---

# ৪. নতুন endpoint-এর file list

```text
src/app/api/user/profile-id-history/route.ts
src/app/api/user/passkeys/route.ts
src/app/api/user/passkeys/[id]/route.ts
src/app/api/user/email-verification/route.ts
src/app/api/user/email-verification/verify/route.ts
src/app/api/user/passkey-challenges/route.ts
src/app/api/user/passkey-challenges/consume/route.ts
```

---

# ৫. Database table/function connection map

| নতুন endpoint | Connected database object |
|---|---|
| `/api/user/profile-id-history` | `profile_id_history` table |
| `/api/user/passkeys` | `user_passkeys` table |
| `/api/user/passkeys/:id` | `revoke_my_passkey()` function |
| `/api/user/email-verification` | `issue_email_verification_code()` function |
| `/api/user/email-verification/verify` | `verify_email_verification_code()` function |
| `/api/user/passkey-challenges` | `issue_passkey_challenge()` function |
| `/api/user/passkey-challenges/consume` | `consume_passkey_challenge()` function |

---

# ৬. যা করা হয়নি

আপনার নির্দেশ অনুযায়ী নিচের কাজগুলো করা হয়নি:

- কোনো frontend page তৈরি করা হয়নি
- কোনো dashboard UI তৈরি করা হয়নি
- কোনো passkey UI তৈরি করা হয়নি
- কোনো email verification UI তৈরি করা হয়নি
- কোনো existing endpoint পরিবর্তন করা হয়নি
- কোনো admin table বা admin endpoint পরিবর্তন করা হয়নি
- কোনো database migration চালানো হয়নি
- কোনো database table বা row পরিবর্তন করা হয়নি
- কোনো existing data delete করা হয়নি

---

# ৭. Validation status

## Production build

```bash
npm run build
```

**ফলাফল:** সফল

Build output-এ নতুন route-গুলো পাওয়া গেছে:

```text
/api/user/email-verification
/api/user/email-verification/verify
/api/user/passkey-challenges
/api/user/passkey-challenges/consume
/api/user/passkeys
/api/user/passkeys/:id
/api/user/profile-id-history
```

## New endpoint lint

নতুন ৭টি route file-এর আলাদা lint check করা হয়েছে।

**ফলাফল:** সফল, কোনো নতুন lint error নেই।

---

# ৮. GitHub status

সর্বশেষ commit:

```text
748637b Add user security database endpoints
```

Repository status:

```text
main...origin/main
```

GitHub repository clean এবং synced।

---

## Final summary

বর্তমানে BINZEO backend-এ মোট **২৮টি route file** আছে:

- **২১টি পুরাতন route file** — আগে থেকেই ছিল এবং অপরিবর্তিত রাখা হয়েছে
- **৭টি নতুন route file** — disconnected user database table/function-এর সঙ্গে backend connection তৈরি করেছে

Frontend এখনো শুধু আগের endpoint-গুলো ব্যবহার করছে। নতুন endpoint-গুলো backend-ready অবস্থায় আছে এবং ভবিষ্যতে frontend বা mobile client থেকে ব্যবহার করা যাবে।
