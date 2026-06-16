# Orbit — Handoff Note
Last updated: June 2026 (2026-06-15, session 12)

## How to Start a New Session
1. Read BRIEF.md for full product context
2. Read TRACKER.md for development history
3. Read CLAUDE.md for development rules
4. Read this file for current state
5. Ask the user what they want to work on today

## Project
Orbit is a calm life-admin application.
- Live URL: https://www.orbitlife.co.uk (deans-app.vercel.app and orbitlife.co.uk both redirect here)
- Local: localhost:3000
- GitHub: deans-app repo
- Supabase: live database, RLS enabled
- Vercel: auto-deploys on GitHub push

## Current State
The app is a working authenticated multi-user application deployed on Vercel.

All core features are complete:
- Authentication — signup, login, logout, session persistence; /app checks for a valid session on load, redirects to /auth if absent, and shows a calm loading state in the meantime (see Security Hardening below)
- Auth page — redesigned into two dark-themed views (Sign In, Create Account) matching the landing page, URL-driven via ?view=
- Password reset — forgot password link on landing page, /reset-password page, confirmation message; invalid/expired links show a calm message with a "Request a new link" button (see Security Hardening below)
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
- Feedback form — working EmailJS integration in Share Your Thoughts, domain restriction currently inactive (see below)
- How Orbit Works — five accordion sections, smooth expand/collapse, one open at a time (see below)
- Legal pages — Terms of Service and Privacy Policy pages live; linked from landing page, signup flow, and Help & Settings (see below)
- Mobile responsiveness — full mobile layout implemented with bottom navigation bar (Dashboard, Today, Upcoming, Inbox, Help, Logout), stacked input panel, responsive hero text and padding, 3-item cap per dashboard section on mobile with See all links, reduced task icon size on mobile, overflow containment. All changes scoped behind md: breakpoints — desktop layout unchanged. Orbit globe icon added to desktop sidebar (80px) and landing page nav (112px) using public/orbit-icon.png — transparent background, blue globe on dark navy. orbit-logo.png also in public folder, unused for now. Logo not visible on mobile — acceptable for now.
- Email infrastructure — Resend configured as custom SMTP provider in Supabase; removes the previous 2-emails-per-hour free-tier limit. Sender is hello@orbitlife.co.uk via verified Resend domain. Supabase Site URL and redirect URLs updated to https://www.orbitlife.co.uk (plus orbitlife.co.uk and reset-password paths). Password reset flow verified working end to end on the live domain in an incognito session.

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

"Capture it" now has a second paragraph implementing the sensitive information notice (see Sensitive Information Notice below). `body` in `HOW_IT_WORKS` (ProfileSection.tsx) can be a string or an array of strings, rendered as one `<p>` per paragraph with consistent styling.

## Sensitive Information Notice (complete)
Implemented as a second paragraph in the "Capture it" section of How Orbit Works, rather than a banner, popup, or capture-area helper text:
- "Orbit is for reminders and everyday life admin — things to do, not things to keep secret. There's no need to store passwords, bank details, or medical records here; Orbit only ever needs the reminder, like 'renew home insurance', never the policy number."
- Capture-area helper text, persistent banners, one-time popups, and automated sensitive-input detection were all considered and deliberately rejected — they either add visual noise/alarm to the calm capture experience or add complexity disproportionate to the risk; an always-available explanation in How Orbit Works was judged sufficient (see TRACKER SESSION 11 for full reasoning)

## Legal Pages (complete)
- Terms of Service at `/terms` — 11 sections, dark landing-page styling, context-aware back button
- Privacy Policy at `/privacy` — 13 sections, same styling, context-aware back button
- Back button uses `router.back()` — returns to whichever page the user came from (auth, Help & Settings, or landing page)
- Linked from landing page footer
- Linked from signup flow — checkbox "I agree to the Terms of Service and Privacy Policy" required; Create Account button disabled until ticked
- Linked from bottom of Help & Settings page

## Mobile Responsiveness (complete)
Full mobile layout pass, all changes scoped behind `md:` breakpoints with desktop unchanged:
- Desktop sidebar hidden below `md`; mobile bottom navigation bar added with Dashboard, Today, Upcoming, Inbox, Help, Logout (44px+ tap targets, matches sidebar colours/active states)
- Main layout, input panel, and date nudge banner all stack vertically on mobile (`flex-col md:flex-row`); input panel and Add button padding reduced on mobile
- Task cards and inbox cards: reduced padding, titles truncate correctly with more room, Complete button no longer overlaps content, task/inbox icons reduced (`w-10 h-10 md:w-16 md:h-16`)
- DatePicker dropdown and ProfileSection buttons wrap/stack correctly on mobile, no horizontal overflow
- Hero section padding/fonts scale down on mobile; subtext no longer hidden behind input panel
- Dashboard view (Soon, Later, Inbox sections) capped at 3 items on mobile only, with "View all"/"See all" links remaining visible; desktop shows all items unchanged
- `next.config.ts` devIndicators repositioned to top-right (dev-only, no production impact)
- Verified at 375px and 1280px via Playwright screenshots; desktop confirmed pixel-identical

## Orbit Logo (complete)
- `public/orbit-icon.png` (cropped globe-with-orbital-ring graphic) added to the repo
- Desktop sidebar: icon at 80×80px, fits within the 128px sidebar with padding either side
- Landing page nav: icon at 112×112px, displayed inline with the "Orbit" wordmark
- Not added to mobile bottom nav, hero section, or auth pages — see Known Issues for mobile dashboard logo visibility

## AI Processing (current implementation)
- Trigger: only fires when user input exceeds 6 words
- What is sent to Anthropic: the user's raw task description verbatim, wrapped in a system prompt — confirmed no email, user ID, or display name is ever included
- What Anthropic returns: a clean 3–5 word title as JSON
- What is stored in Supabase: the returned title only — the original input is never written to the database
- Original text may still appear in Vercel infrastructure logs and Anthropic API logs — both outside Orbit's direct control
- Route is authenticated, validated, and rate-limited (see Security Hardening below)
- Outstanding: user-facing disclosure and AI transparency review (see priorities below)

## Domain & Email (complete)
- orbitlife.co.uk registered via Cloudflare; root and www resolving
- hello@orbitlife.co.uk receiving via Cloudflare Email Routing, forwarding to the owner's Gmail
- Terms of Service and Privacy Policy contact addresses updated to hello@orbitlife.co.uk

## EmailJS Feedback Form (complete, domain restriction inactive)
Share Your Thoughts card in ProfileSection.tsx sends feedback via EmailJS:
- Service ID: `service_ecsh1ih` (in source)
- Template ID: `template_3etw4ta` (in source)
- Public Key: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — stored in `.env.local` (not committed), must also be set in Vercel environment variables
- On success: clears textarea, shows toast "Thank you — your thoughts help shape Orbit"
- On failure: shows toast "Something went wrong — please try again"
- Send button disabled when textarea is empty or while sending
- Domain restriction currently NOT active — the previously configured restriction was found blank in EmailJS Account → Security (possibly never saved, possibly related to an EmailJS service incident on 10 June 2026, possibly a free-tier limitation requiring a paid plan for domain whitelisting)
- With no restriction active, the public key works from any domain, including localhost
- Action carried forward: retry adding https://www.orbitlife.co.uk as the allowed domain in EmailJS Account → Security once the service incident is resolved; if a paid plan is required, decide whether to pay or accept the unrestricted public key as a known low-severity risk
- Domain restriction retry pending — attempt to add https://www.orbitlife.co.uk in EmailJS Account → Security at start of next session.

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
- /reset-password shows a calm plain-English message ("This reset link has expired or already been used. Please request a new one from the sign-in page.") with a "Request a new link" button (to /auth?view=forgot) for any invalid/expired link, instead of a raw Supabase error
- Background profile-creation inserts (ensureProfile, signIn) now log to console on failure for visibility in dev/Vercel logs; no user-facing error added
- RLS policies reviewed and confirmed correct on items and profiles tables
- EmailJS public key domain restriction currently inactive — see EmailJS Feedback Form section
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
- Orbit logo not visible anywhere on the mobile dashboard view (desktop sidebar and landing nav only) — agreed acceptable for now

## Next Priorities In Order

### High — do soon after launch
1. EmailJS domain restriction — retry adding https://www.orbitlife.co.uk as the allowed domain in EmailJS Account → Security
2. Beta launch outreach plan — plan and execute outreach for beta testers
3. Stripe integration — plan and begin payment/subscription integration
4. AI transparency — current implementation documented above; assess whether additional user-facing disclosure is required beyond what is in the Privacy Policy
5. Data retention — confirm whether completed tasks are retained indefinitely and whether this aligns with the Privacy Policy; decide if any automated deletion policy is needed
6. Company information — update all references to "Orbit, a business" in Terms and Privacy with the actual legal entity name once Orbit Limited is incorporated
7. Database maintenance completed — 33 orphaned items (null user_id) deleted, user_id index added to items table for query performance.

### Feature backlog
- Security section — change password
- View all buttons not wired up

## Outstanding — Deferred
- Dedicated mailbox or send-as capability for hello@orbitlife.co.uk — needed before public launch (currently forwarding-only via Cloudflare Email Routing)
- ICO registration — user action (Andy), required before public beta
- Leaked password protection — Supabase feature requires a paid tier; deferred until upgrade
- Terms acceptance timestamp — record when a user agreed to Terms/Privacy; deferred
- Foreign keys with cascade rules — items/profiles to auth.users; technical debt, not blocking
- GDPR data export — "export my data" / "download my account data"; post-launch, do not build yet

## Supabase Notes
- items table: id, user_id, title, due_date (type: date), status, is_recurring (boolean, default false), created_at, completed_at
- profiles table: id, user_id (unique constraint, used for upsert onConflict), display_name, created_at
- RLS enabled on both tables
- Site URL set to https://www.orbitlife.co.uk; redirect URLs include http://localhost:3000, https://orbitlife.co.uk, https://www.orbitlife.co.uk, https://deans-app.vercel.app, and https://deans-app.vercel.app/reset-password — complete.
- Email sending via Resend custom SMTP (hello@orbitlife.co.uk); previous 2-per-hour free-tier limit removed. Resend free tier: 100 emails/day, 3,000/month.
- Database cleaned (2026-06-15): 33 orphaned items (no matching user) deleted; index added on items.user_id for query performance

## Environment Variables
- .env.local contains NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
- All must also be set in Vercel environment variables
- Never commit .env.local to GitHub

## Development Workflow
1. Discuss what to build in Claude chat
2. Write the prompt in Claude chat
3. Paste prompt into Claude Code terminal
4. Approve changes one at a time
5. Test on localhost:3000 or localhost:3001 depending on which port the dev server starts on
6. Push to GitHub
7. Test on live URL
8. Report back to Claude chat

## Rules Reminder
- One change at a time
- Test localhost before pushing
- Test live URL after pushing
- No mocked data
- No pushing broken code
