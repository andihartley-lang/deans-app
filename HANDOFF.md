# Orbit — Handoff Note
Last updated: June 2026 (2026-06-10, session 10)

## How to Start a New Session
1. Read BRIEF.md for full product context
2. Read TRACKER.md for development history
3. Read CLAUDE.md for development rules
4. Read this file for current state
5. Ask the user what they want to work on today

## Project
Orbit is a calm life-admin application.
- Live URL: https://deans-app.vercel.app
- Local: localhost:3000
- GitHub: deans-app repo
- Supabase: live database, RLS enabled
- Vercel: auto-deploys on GitHub push

## Current State
The app is a working authenticated multi-user application deployed on Vercel.

All core features are complete:
- Authentication — signup, login, logout, session persistence; /app checks for a valid session on load, redirects to /auth if absent, and shows a calm loading state in the meantime (see Security Hardening below)
- Auth page — redesigned into two dark-themed views (Sign In, Create Account) matching the landing page, URL-driven via ?view=
- Password reset — forgot password link on landing page, /reset-password page, confirmation message; invalid/expired links show a calm message with a link back to sign-in (see Security Hardening below)
- User-owned items with RLS — reviewed and confirmed correct on items and profiles tables
- Profiles and display name — a profiles row is guaranteed for every authenticated session (created on app load if missing, regardless of entry path); save handler upserts on user_id, then confirms the write via re-fetch before showing success and updating the dashboard (see Profile Creation Guarantee below)
- View filtering — Today, Upcoming, Inbox, Dashboard all mutually exclusive
- Natural language capture — AI fires for inputs over 6 words, extracts title only; route requires a verified Supabase token, validates input length server-side, and rate-limits per user (see AI Processing and Security Hardening below)
- Date picker — calendar only, optional
- Time-sensitive task prompt — gentle amber card, Add a date or No date needed
- Help and Settings page — About You, How Orbit Works, Share Your Thoughts, and Your Account (self-service deletion) all working; Security section change-password is a placeholder
- Account deletion — self-service flow in Help & Settings, fully working (see below)
- Toast notifications — single shared purple toast system (components/Toast.tsx)
- Page metadata
- Recurring tasks — full feature complete (see below)
- Feedback form — working EmailJS integration in Share Your Thoughts, domain-restricted public key (see below)
- How Orbit Works — five accordion sections, smooth expand/collapse, one open at a time (see below)
- Legal pages — Terms of Service and Privacy Policy pages live; linked from landing page, signup flow, and Help & Settings (see below)

## Recurring Tasks Feature (complete)
Five keywords detected at capture (insurance, mot, road tax, boiler service, tv licence) — `saveItem` silently sets `is_recurring: true`. When completing a recurring item, an inline prompt expands on the card:
- Checkbox "Add a reminder for next year" (ticked by default)
- Date picker pre-set to one year from the task's own due date (falls back to one year from today if no due date)
- Date picker hides when checkbox is unticked, reappears when reticked
- Confirm button

Ticked + confirm: completes current item, creates new identical recurring item with chosen date, toast "Done — your [title] is saved for [dd/mm/yy]". Unticked + confirm: completes normally. Non-recurring items complete immediately with no prompt.

Both TaskCard (Upcoming) and InboxCard (Inbox) implement the prompt with their own per-card state. Logic lives in `completeItemWithRecurring` in page.tsx.

## How Orbit Works Accordion (complete)
Five accordion sections in the How Orbit Works card: Capture it, Your views, Check in daily, Forgotten your password?, Coming soon. One section open at a time — CSS grid row transition for smooth expand/collapse, arrow rotates on open. Body text at 16px / 1.8 line-height for accessibility. Verified on live URL.

## Legal Pages (complete)
- Terms of Service at `/terms` — 11 sections, dark landing-page styling, context-aware back button
- Privacy Policy at `/privacy` — 13 sections, same styling, context-aware back button
- Back button uses `router.back()` — returns to whichever page the user came from (auth, Help & Settings, or landing page)
- Linked from landing page footer
- Linked from signup flow — checkbox "I agree to the Terms of Service and Privacy Policy" required; Create Account button disabled until ticked
- Linked from bottom of Help & Settings page

## AI Processing (current implementation)
- Trigger: only fires when user input exceeds 6 words
- What is sent to Anthropic: the user's raw task description verbatim, wrapped in a system prompt — confirmed no email, user ID, or display name is ever included
- What Anthropic returns: a clean 3–5 word title as JSON
- What is stored in Supabase: the returned title only — the original input is never written to the database
- Original text may still appear in Vercel infrastructure logs and Anthropic API logs — both outside Orbit's direct control
- Route is authenticated, validated, and rate-limited (see Security Hardening below)
- Outstanding: user-facing disclosure and AI transparency review (see priorities below)

## EmailJS Feedback Form (complete)
Share Your Thoughts card in ProfileSection.tsx sends feedback via EmailJS:
- Service ID: `service_ecsh1ih` (in source)
- Template ID: `template_3etw4ta` (in source)
- Public Key: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — stored in `.env.local` (not committed), must also be set in Vercel environment variables; domain restriction enabled on this key
- On success: clears textarea, shows toast "Thank you — your thoughts help shape Orbit"
- On failure: shows toast "Something went wrong — please try again"
- Send button disabled when textarea is empty or while sending

## Account Deletion (complete)
Self-service account deletion via the "Your Account" card in Help & Settings (ProfileSection.tsx), last card on the page:
- Inline two-step confirmation, no modal — "Delete my account" → confirm step → final "Yes, delete everything" step; "Keep my account" / "Cancel" return to default state at any point
- Both buttons disabled during the request to prevent double submission
- Server route app/api/delete-account/route.ts verifies the caller's Supabase access token, then deletes items, the profile row, and the auth user (via service-role key) in that order, checking for errors at each step
- On success: signs out locally, shows purple toast "Your account has been deleted.", redirects to landing page
- On failure: shows toast "Something went wrong — please try again", returns to default state, does not sign out
- No email/password re-entry, no countdown, no red/alarmist styling
- Verified end-to-end on local dev and live URL

## Security Hardening (complete)
Read-only audit performed across five areas (parse-item auth, secrets handling, silent write failures, Anthropic payload contents, auth gates), followed by fixes:
- parse-item route (app/api/parse-item/route.ts) requires a verified Supabase access token (401 if missing/invalid), enforces the 6-word minimum and a 500-character maximum server-side (400 with clear error otherwise), and applies a per-user in-memory rate limit of 30 calls/hour (resets on deploy, per-instance — acceptable at current scale); client sends the token in the Authorization header
- /app checks for a valid session before rendering; redirects to /auth if absent; shows a calm "Loading your day..." state while checking — no authenticated content can flash for unauthenticated visitors
- /reset-password shows a calm plain-English message ("This reset link has expired or already been used. Please request a new one from the sign-in page.") with a link back to sign-in for any invalid/expired link, instead of a raw Supabase error
- Background profile-creation inserts (ensureProfile, signIn) now log to console on failure for visibility in dev/Vercel logs; no user-facing error added
- RLS policies reviewed and confirmed correct on items and profiles tables
- EmailJS public key domain-restricted
- Secrets handling, git history, and Anthropic payload all verified clean — no leaked secrets, .env.local never committed

## Profile Creation Guarantee (complete)
A profiles row is now guaranteed to exist for every authenticated user, regardless of how they arrived in the app:
- On every authenticated session load in app/app/page.tsx, `ensureProfile()` checks for a profiles row by user_id and inserts one with an empty display name if missing — covers explicit sign-in, email confirmation auto-session, password reset completion, and session restore
- AuthSection's signIn() retains its own select-then-insert-if-missing check as a harmless duplicate guarantee
- ProfileSection's saveProfile() upserts on profiles with onConflict on user_id (confirmed unique constraint), so saving a display name can never fail due to a missing row — write is then confirmed via re-fetch before the success toast and dashboard update
- Verified on local dev and live URL, including direct recreation of the missing-row state

## Known Issues
- Settings section cards reported as inconsistent width — not reproducible in testing; defensive w-full classes added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing, separate from recurring feature)
- View all buttons not wired up
- Security section is a placeholder

## Next Priorities In Order

### Critical — before public launch
1. Domain registration — orbit.co.uk
2. Email address — hello@orbit.co.uk

### High — do soon after launch
3. Sensitive information warning — brief in-app notice that Orbit is for task management only, not storage of sensitive information; location TBD, likely Help & Settings or task capture area
4. AI transparency — current implementation documented above; assess whether additional user-facing disclosure is required beyond what is in the Privacy Policy
5. Data retention — confirm whether completed tasks are retained indefinitely and whether this aligns with the Privacy Policy; decide if any automated deletion policy is needed
6. Company information — update all references to "Orbit, a business" in Terms and Privacy with the actual legal entity name once Orbit Limited is incorporated

### Feature backlog
- Security section — change password
- View all buttons not wired up

## Outstanding — Deferred
- ICO registration — user action (Andy), required before public beta
- Leaked password protection — Supabase feature requires a paid tier; deferred until upgrade
- Terms acceptance timestamp — record when a user agreed to Terms/Privacy; deferred
- Foreign keys with cascade rules — items/profiles to auth.users; technical debt, not blocking
- GDPR data export — "export my data" / "download my account data"; post-launch, do not build yet

## Supabase Notes
- items table: id, user_id, title, due_date (type: date), status, is_recurring (boolean, default false), created_at, completed_at
- profiles table: id, user_id (unique constraint, used for upsert onConflict), display_name, created_at
- RLS enabled on both tables
- Redirect URLs include: http://localhost:3000 and https://deans-app.vercel.app and https://deans-app.vercel.app/reset-password
- Email rate limit on free tier: 2 per hour — affects signup and password reset testing

## Environment Variables
- .env.local contains NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
- All must also be set in Vercel environment variables
- Never commit .env.local to GitHub

## Development Workflow
1. Discuss what to build in Claude chat
2. Write the prompt in Claude chat
3. Paste prompt into Claude Code terminal
4. Approve changes one at a time
5. Test on localhost:3000
6. Push to GitHub
7. Test on live URL
8. Report back to Claude chat

## Rules Reminder
- One change at a time
- Test localhost before pushing
- Test live URL after pushing
- No mocked data
- No pushing broken code
