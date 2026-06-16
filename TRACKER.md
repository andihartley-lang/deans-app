# Orbit — Development Tracker
Running log of all development activity. Most recent entry first. Earlier entries are history — do not delete.

## SESSION 13 — June 2026 (2026-06-16)
Status: Infrastructure configuration, end-to-end cold-start test, and two bug fixes complete.

### Completed
- Resend configured as custom SMTP provider in Supabase — removes the previous 2-emails-per-hour free-tier limit; sender is hello@orbitlife.co.uk via verified Resend domain (100 emails/day, 3,000/month on free tier)
- Supabase Site URL and redirect URLs updated to https://www.orbitlife.co.uk (plus orbitlife.co.uk and reset-password paths) — password reset flow verified end to end on the live domain in an incognito session
- EmailJS domain restriction confirmed unavailable on the free tier (paid-only feature, not a configuration issue); decision: accept unrestricted public key as low-severity risk for beta — worst case is junk feedback or quota use, no data exposure; post-beta option noted: replace with Resend server-side route
- Full cold-start end-to-end test completed on the live URL
- Time-of-day greeting threshold bug found and fixed: hour < 24 condition was making "Good evening" unreachable; corrected to hour < 18 so afternoon runs 12:00–17:59 and evening from 18:00; timezone conversion via toLocaleString also removed in favour of new Date().getHours() so the browser's local time is used directly
- Password reset success state bug found and fixed: after a successful updateUser call, the page was falling through to the "Link expired" state because Supabase marks the token as used; fixed by replacing the done state with a toast ("Password updated — please sign in") and an immediate redirect to /auth?view=signin after 1.5s; dead done state and its JSX branch removed
- Resend email timestamp issue identified: emails appear approximately 4 hours behind actual send time; believed to be a Resend server timezone issue, cosmetic only; logged in Known Issues and Next Priorities for follow-up with Resend support
- BRIEF.md technical debt entries removed: "No mobile optimisation" and "No self-service account deletion" both deleted as both features are now complete
- Three-way launch readiness review completed (BRIEF.md, HANDOFF.md, TRACKER.md); gaps identified and added to documentation: PWA apple-touch-icon missing, App Store distribution decision outstanding, carer and contact feature not yet built, handover and migration path not yet built — all four added to BRIEF.md Pre-Launch Checklist and HANDOFF.md Next Priorities / Outstanding Deferred

### Next Priorities
1. Resend email timestamp — raise with Resend support
2. Beta launch outreach plan
3. Stripe integration
4. AI transparency — assess whether additional user-facing disclosure is needed
5. Data retention policy decision
6. Company information update — legal entity name once Orbit Limited is incorporated

---

## SESSION 12 — June 2026 (2026-06-15)
Status: Full mobile responsiveness pass complete; Orbit logo added; database cleanup performed.

### Completed
- Full mobile responsiveness implemented across the app, all changes scoped behind `md:` breakpoints with desktop unchanged:
  - Mobile bottom navigation bar (Dashboard, Today, Upcoming, Inbox, Help, Logout) replacing the sidebar below `md`
  - Main layout, input panel, and date nudge banner stack vertically on mobile; input panel padding reduced
  - Task/inbox card padding reduced, titles truncate correctly, Complete button no longer overlaps content, icons reduced on mobile
  - Hero section padding/fonts scale down on mobile; subtext no longer hidden behind input panel
  - Dashboard view (Soon, Later, Inbox) capped at 3 items on mobile only, "View all"/"See all" links remain visible; desktop unchanged
  - Verified at 375px and 1280px via Playwright; desktop confirmed pixel-identical
- Orbit globe logo added: desktop sidebar (80×80px) and landing page nav (112×112px); `public/orbit-icon.png` (cropped) tracked in git
- Database cleaned: 33 orphaned items (no matching user) deleted from the items table; index added on items.user_id

### Known Issues
- Orbit logo not visible anywhere on the mobile dashboard view — agreed acceptable for now

### Next Priorities
1. Supabase redirect URLs — add orbitlife.co.uk to allowed redirect URLs
2. EmailJS domain restriction — retry adding https://www.orbitlife.co.uk
3. Beta launch outreach plan
4. Stripe integration
5. AI transparency — assess whether additional user-facing disclosure is needed
6. Data retention policy decision
7. Company information update — legal entity name once Orbit Limited is incorporated

---

## SESSION 11 — June 2026 (2026-06-10)
Status: Sensitive information notice implemented via How Orbit Works content.

### Completed
- How Orbit Works "Capture it" section extended with a second paragraph: "Orbit is for reminders and everyday life admin — things to do, not things to keep secret. There's no need to store passwords, bank details, or medical records here; Orbit only ever needs the reminder, like 'renew home insurance', never the policy number."
- First paragraph of "Capture it" left unchanged; second paragraph matches existing accordion text styling (16px / 1.8 line-height, text-gray-600)
- This satisfies the "Sensitive information warning" item from Next Priorities — implemented as in-app content rather than a separate banner/popup

### Considered and Rejected
- Capture-area helper text (e.g. placeholder hint or microcopy near the input) — rejected: adds visual noise to the calm capture experience and competes with the primary "just type what's on your mind" interaction
- Persistent banner across the app — rejected: alarmist tone, conflicts with "no alarms, no guilt" product principle, and would be seen repeatedly after the message has registered
- One-time popup/modal on first use — rejected: interrupts onboarding, easy to dismiss without reading, not revisitable later
- Automated detection of sensitive input (e.g. flagging numbers that look like card/account numbers) — rejected: adds complexity and false positives/negatives, and runs counter to "no mocked or simulated data / no AI features beyond what's instructed"; a calm, always-available explanation in How Orbit Works was judged sufficient

### Next Priorities
1. Domain registration — orbit.co.uk
2. Email address — hello@orbit.co.uk
3. AI transparency — assess whether additional user-facing disclosure is needed beyond the Privacy Policy
4. Data retention policy decision
5. Company information update — legal entity name once Orbit Limited is incorporated

---

## SESSION 10 — June 2026 (2026-06-10)
Status: Security review complete; fixes applied and verified on live URL.

### Completed
- Read-only security audit performed across five areas: parse-item route authentication, secrets handling, silent database write failures, data sent to Anthropic, and auth gates on /app and /reset-password
- parse-item route secured: requires a verified Supabase access token (returns 401 if missing or invalid), enforces the 6-word minimum and a 500-character maximum server-side, and applies a per-user in-memory rate limit (30 calls/hour); client now sends the access token in the Authorization header
- Auth gate added to /app: checks for a valid session before rendering, redirects to /auth if absent, and shows a calm "Loading your day..." state while checking — authenticated content cannot flash for unauthenticated visitors
- Reset-password page: an invalid or expired link now shows a calm plain-English message ("This reset link has expired or already been used. Please request a new one from the sign-in page.") with a "Request a new link" button (to /auth?view=forgot), instead of a raw Supabase error
- Background profile-creation inserts (ensureProfile in app/app/page.tsx, signIn in AuthSection.tsx) now log to console on failure for visibility in development and Vercel logs; no user-facing error added — saveProfile's upsert remains the user-facing safety net
- RLS policies reviewed and confirmed correct on items and profiles tables
- EmailJS domain restriction enabled on the public key
- Secrets handling, git history, and Anthropic payload contents all verified clean — no leaked secrets, .env.local never committed, parse-item sends task text only with no personal data

### Next Priorities
1. Domain registration — orbit.co.uk
2. Email address — hello@orbit.co.uk
3. Sensitive information warning — brief in-app notice that Orbit is for task management only
4. AI transparency — assess whether additional user-facing disclosure is needed beyond the Privacy Policy
5. Data retention policy decision
6. Company information update — legal entity name once Orbit Limited is incorporated

---

## SESSION 9 — June 2026 (2026-06-10)
Status: Profile creation gap verified and fixed; tested on dev and live.

### Completed
- Investigated suspected bug: a profiles row was only ever created inside the explicit sign-in function, so a new user who confirms via the email confirmation link (auto-session) reached the app with no profiles row
- Confirmed root cause: signup does not create a profiles row; only AuthSection's signIn() did, via select-then-insert-if-missing; email confirmation auto-session and password reset completion both bypass signIn() and land directly in /app
- Confirmed impact: saveProfile previously used update-then-confirm, which silently no-ops on a missing row and then fails the confirm re-fetch with a raw Postgres error, so the display name could never be saved for affected accounts
- Fix 1 — saveProfile in ProfileSection.tsx now uses upsert on profiles with onConflict on user_id, so a missing row is created rather than the save failing; existing behaviour preserved (await, error checks, re-fetch confirmation, success toast only after confirmation, error toast on failure, confirmed name propagated to dashboard greeting)
- Fix 2 — app/app/page.tsx now guarantees a profiles row exists on every authenticated session load (ensureProfile, same select-then-insert-if-missing pattern as signIn), covering all entry paths: explicit sign-in, email confirmation auto-session, password reset completion, and session restore
- signIn()'s existing profile creation left in place as a harmless duplicate guarantee
- Tested on local dev and on live URL, including direct recreation of the missing-row state — display name save now succeeds and a profiles row is created where previously none existed

### Next Priorities
1. Security review (critical — before launch)
2. Domain registration — orbit.co.uk
3. Email address — hello@orbit.co.uk

---

## SESSION 8 — June 2026 (2026-06-09)
Status: Legal pages, compliance actions recorded, HANDOFF updated.

### Completed
- Terms of Service page (/terms) — dark landing-page styling matching the rest of the app, 11 sections, context-aware back button using router.back()
- Privacy Policy page (/privacy) — same styling, 13 sections, context-aware back button
- Landing page footer — Terms of Service and Privacy Policy links
- Signup flow — "I agree to the Terms of Service and Privacy Policy" checkbox above Create Account button; button disabled until ticked; links navigate in-tab so back button returns to auth page
- Help & Settings — Terms of Service and Privacy Policy links at the bottom of the page
- Context-aware back navigation — back button returns to whichever page the user came from (auth page, Help & Settings, or landing page)
- Compliance and legal actions identified, documented in HANDOFF and TRACKER

### Compliance Actions Outstanding (not yet built)

**Critical — before public launch:**
- Account deletion — self-service flow in Help & Settings; must delete: all tasks, profile record, and Supabase auth account; must include confirmation step and permanent deletion warning; aligns with Privacy Policy 30-day commitment
- Security review — audit RLS on all tables; confirm users can only access own records; confirm no client-side secret exposure

**High — do soon after launch:**
- Sensitive information warning — brief in-app notice that Orbit is for task management only, not storage of sensitive information; location TBD, likely Help & Settings or task capture area
- AI transparency — implement user-facing AI transparency wording consistent with the Privacy Policy; current implementation sends raw task descriptions over 6 words to Anthropic, stores only the returned title in Supabase, and may involve temporary infrastructure/provider logging
- Data retention — decide whether completed tasks should be retained indefinitely or archived; current Privacy Policy supports indefinite retention while the account remains active
- Anthropic API policy review — review Anthropic API retention, training and data-processing policies to ensure alignment with Orbit Privacy Policy
- Company information — update "Orbit, a business" in Terms and Privacy with the actual legal entity name once Orbit Limited is incorporated

**Lower priority — post launch:**
- GDPR export features — assess effort for "export my data" and "download my account data" functionality; do not build yet

### Known Issues Outstanding
- Settings section cards inconsistent width — not reproducible; defensive w-full classes already added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing)
- View all buttons not wired up
- Security section — change password (placeholder)

### Next Priorities
1. Account deletion flow (critical — before launch)
2. Security review (critical — before launch)
3. Domain registration — orbit.co.uk
4. Email address — hello@orbit.co.uk

---

## SESSION 7 — June 2026 (2026-06-09)
Status: How Orbit Works accordion complete and verified on live URL.

### Completed
- Replaced "Guide coming soon." placeholder in How Orbit Works card with five accordion sections: Capture it, Your views, Check in daily, Forgotten your password?, Coming soon
- One section open at a time — opening a new one closes the previous; tapping an open section closes it
- Smooth expand/collapse via CSS grid row transition (grid-rows-[0fr] → grid-rows-[1fr])
- Arrow rotates 180° when section is open
- Body text set at 16px minimum with 1.8 line-height for accessibility
- Card styling matches the rest of Help & Settings exactly
- Verified on live URL: all five headings visible when collapsed, correct open/close behaviour, correct aria-expanded state, 16px confirmed

### Known Issues Outstanding
- Settings section cards inconsistent width — not reproducible; defensive w-full classes already added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing)
- View all buttons not wired up
- Security section is a placeholder

### Next Priorities
1. Domain registration — orbit.co.uk
2. Email address — hello@orbit.co.uk
3. T&Cs and privacy policy
4. Security section — change password

---

## SESSION 6 — June 2026 (2026-06-09)
Status: EmailJS feedback form wired up and verified on live URL.

### Completed
- Replaced disabled Share Your Thoughts placeholder in ProfileSection.tsx with a working EmailJS feedback form
- Service ID `service_ecsh1ih` and Template ID `template_3etw4ta` hardcoded in source; Public Key stored in `.env.local` as `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (not committed)
- Live URL verification: textarea enabled, Send disabled when empty, Send enabled after typing, both EmailJS credentials confirmed in deployed JS bundle
- Vercel env var `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` confirmed set; end-to-end email delivery verified on live URL by user

### Known Issues Outstanding
- Settings section cards inconsistent width — not reproducible; defensive w-full classes already added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing)
- View all buttons not wired up

### Next Priorities
1. How Orbit Works section — design and content
2. Domain registration — orbit.co.uk
4. Email address — hello@orbit.co.uk
5. T&Cs and privacy policy

---

## SESSION 5 — June 2026 (2026-06-09)
Status: Recurring tasks feature complete and refined.

### Completed
- Added `is_recurring?: boolean` to the `Item` type
- Keyword detection at capture: `saveItem` checks for insurance, mot, road tax, boiler service, tv licence (case-insensitive) and silently sets `is_recurring: true` on insert — no UI change at capture
- `completeItemWithRecurring` function in page.tsx: completes current item, inserts new identical item with `is_recurring: true` and chosen due date, refreshes list, shows toast "Done — your [title] is saved for [dd/mm/yy]"
- TaskCard now a "use client" component with inline recurring prompt: when Complete is clicked on a recurring item, card expands to show checkbox "Add a reminder for next year" (ticked by default), DatePicker, and Confirm button. Ticked + confirm → recurring completion. Unticked + confirm → normal completion. Non-recurring items complete immediately as before
- InboxSection refactored to use an `InboxCard` sub-component with identical recurring prompt logic and own per-card state
- `nextYearISO()`, `nextYearFromDate()` and `formatDDMMYY()` helpers added to lib/itemUtils.ts
- UpcomingSection threads `completeItemWithRecurring` through to TaskCard
- Date picker in recurring prompt hides when checkbox is unticked; reappears when ticked
- Suggested reminder date is one year from the task's own due date (falls back to one year from today if task has no due date)

### Known Issues Outstanding
- Settings section cards inconsistent width — not reproducible; defensive w-full classes already added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing)
- View all buttons not wired up

### Next Priorities
1. Wire up feedback form
2. How Orbit Works section
3. Domain registration — orbit.co.uk
4. Email address — hello@orbit.co.uk
5. T&Cs and privacy policy

---

## SESSION 4 — June 2026 (2026-06-08)
Status: Auth redesign, profile save fix, and toast consistency complete.

### Completed
- ProfileSection save handler now confirms the Supabase write by re-fetching the profile before showing a success toast, and updates the dashboard display name via an onDisplayNameSaved callback
- Auth page (/auth) redesigned into two distinct dark-themed views — Sign In and Create Account — matching the landing page gradient styling, replacing the old single-card layout with two headings and inconsistent button colours
- Auth views are URL-driven (?view=signin / ?view=signup / ?view=forgot) and linked correctly from the landing page
- Create Account subtext trimmed; CTA button renamed to Create New Account
- Investigated reported Help & Settings card width inconsistency — could not reproduce across 8 viewport widths with pixel measurements and screenshots; added explicit w-full to all four cards, their inner input/textarea, and a shared max-w-6xl wrapper as a defensive measure
- Replaced every browser alert() across the app with the existing styled purple toast system — created a shared components/Toast.tsx component and wired it into app/app/page.tsx, ProfileSection.tsx, AuthSection.tsx, and reset-password/page.tsx, so all save and error confirmations now look and behave consistently with no native dialog boxes

### Known Issues Outstanding
- Settings section cards reported as inconsistent width on the user's screen — not reproducible in code or in testing; defensive w-full classes added but root cause unconfirmed (possible browser cache, zoom, or display scaling on the user's side)
- MOT and compound keywords not always triggering time-sensitive prompt
- View all buttons not wired up
- Keyboard shortcuts in VS Code terminal behaving oddly — close and reopen VS Code to fix

### Next Priorities
1. Logo integration
2. Recurring tasks
3. Wire up feedback form
4. Domain registration — orbit.co.uk
5. Email address — hello@orbit.co.uk
6. T&Cs and privacy policy

---

## SESSION 3 — June 2026 (2026-06-08)
Status: Password reset complete. MD project files being set up.

### Completed
- Password reset flow — forgot password link on landing page, /reset-password page, confirmation message, Continue to Orbit button
- Supabase redirect URL added: https://deans-app.vercel.app/reset-password
- Natural language capture — AI extracts clean title from long sentences, fires only for inputs over 6 words
- Date picker restored — calendar only, optional, no manual entry
- Time-sensitive task prompt — gentle amber card, Add a date or No date needed
- Supabase due_date column changed from timestamptz to date — fixes timezone bug
- Dashboard today view fixed — now shows todays items correctly
- ANTHROPIC_API_KEY added to Vercel environment variables
- Help & Settings page — renamed, four sections with placeholders
- Browser tab title confirmed as Orbit
- CLAUDE.md created with development rules
- BRIEF.md created with full product brief

### Known Issues Outstanding
- Settings section cards inconsistent width — minor visual fix pending
- MOT and compound keywords not always triggering time-sensitive prompt
- View all buttons not wired up
- Auth page styling — two headings, inconsistent button colours
- Keyboard shortcuts in VS Code terminal behaving oddly — close and reopen VS Code to fix

### Product Decisions Confirmed
- AI never touches dates — user always in control
- Calendar picker only — no manual date entry
- Minimal password requirements — 8 characters, no complexity rules
- Security section in Help and Settings — placeholder only for now

### Next Priorities
1. HANDOFF.md setup
2. Fix auth page styling
3. Fix settings card widths
4. Logo integration
5. Recurring tasks
6. Wire up feedback form
7. Domain registration — orbit.co.uk
8. Email address — hello@orbit.co.uk
9. T&Cs and privacy policy

---

## SESSION 2 — June 2026 (2026-06-06)
Status: UI refinements complete. Natural language capture next.

### Completed
- Claude Code installed and configured in VS Code
- Connected to Claude Pro account
- Workflow established: discuss in Claude chat, prompt in Claude Code, verify in browser, push to GitHub
- profiles.display_name integrated into hero section greeting
- Display name present: Good afternoon, Andy
- Display name empty: Good afternoon
- No placeholder values under any circumstances
- Today view hero: Focus on what matters today
- Upcoming subtext: Whats on the horizon
- Inbox subtext: The everyday stuff, all in one place
- Dashboard duplicate Here's what's in your orbit removed
- Large banner headings removed from Upcoming and Inbox
- Today view: overdue under Still to do, todays tasks under On your plate today
- Upcoming: future dated tasks only, grouped Soon and Later
- Inbox: undated tasks only
- Each view mutually exclusive — no task appears in more than one view
- Toast notification replaced browser alert — bottom centre, fades after 2 seconds
- Browser tab title updated to Orbit
- Page description updated to A calm place to manage life admin
- All changes pushed to GitHub and deployed via Vercel
- Live URL: https://deans-app.vercel.app

### Product Decisions Confirmed
- Landing page founder story confirmed for carer community marketing
- Three feature cards kept as is
- Logo integration deferred to dedicated session
- Two logo concepts exist: glowing ring for app icon, intertwining rings for landing page

### Items Noted for Future Sessions
- Recurring tasks — annual renewals auto-recreate on completion
- Help and Settings — rename Settings, add T&Cs, help guides, feedback
- Domain registration — orbit.co.uk
- Email address — hello@orbit.co.uk
- Logo integration
- View all buttons not wired up
- Overdue tasks — future trigger for carer notifications

### Status at End of Session
- Authentication: COMPLETE
- User Ownership: COMPLETE
- Auth Gates: COMPLETE
- Profiles: COMPLETE
- Profile Management: COMPLETE
- RLS: COMPLETE
- Display Name Integration: COMPLETE
- View Filtering Logic: COMPLETE
- Toast Notifications: COMPLETE
- Landing Page: COMPLETE
- Page Metadata: COMPLETE

---

## SESSION 1 — June 2026 (2026-06-02)
Status: Multi-user architecture complete.

### Completed
- Route separation: / landing, /auth authentication, /app application
- Orbit application moved from app/page.tsx to app/app/page.tsx
- Dedicated public landing page with Orbit branding and founder story
- Primary CTA: Create Free Account. Secondary CTA: Sign In
- Authentication flow: unauthenticated to landing, authenticated to /app
- Login success popup removed — redirects immediately to /app
- Logout redirects to /
- Authentication UI cleanup — removed test language
- profiles table created: id, user_id, display_name, created_at
- A profiles row is now guaranteed for every authenticated session — created on app load if missing, regardless of entry path (explicit sign-in, email confirmation auto-session, password reset completion, or session restore); the display name save uses an upsert as a safety net so it can never fail due to a missing row (see SESSION 9)
- ProfileSection.tsx created with display name field
- Display name: optional, 30 char max, whitespace trimmed
- RLS enabled on items and profiles
- Ownership policies: select, insert, update, delete own records only
- Legacy Allow all for now policy removed
- Settings cleanup — removed hardcoded Andy, removed duplicate controls

### Product Decision Confirmed
- Document uploads not included at launch — adds complexity, privacy concerns, security surface area

### Status at End of Session
- Authentication: COMPLETE
- User Ownership: COMPLETE
- Auth Gates: COMPLETE
- Profiles: COMPLETE
- Profile Management: COMPLETE
- RLS: COMPLETE

---

## REFACTOR PHASE — June 2026 (2026-06-01)
Status: Architecture cleanup complete.

### Completed
- Sidebar.tsx extracted
- HeroSection.tsx extracted
- UpcomingSection.tsx extracted
- InboxSection.tsx extracted
- TaskCard.tsx extracted
- types/item.ts created — shared Item interface, no more any[]
- lib/itemUtils.ts created — getStatus() and getItemIcon()
- Validation verified: all views, item creation, item completion, icon rendering, local and deployed

### Functions Retained in page.tsx
- fetchItems()
- addItem()
- completeItem()
These remain because they are tightly coupled to React state and Supabase operations.

---

## INITIAL STATE — May 2026
Note: Historical record only. All issues listed here have since been resolved.

- Current phase: Architecture cleanup
- Files: app/page.tsx, Sidebar.tsx, UpcomingSection.tsx
- Last completed: UpcomingSection.tsx extracted
- Next step at time: Extract InboxSection.tsx
- Known issues: No authentication, RLS disabled, Today mirrored Upcoming, no TypeScript model
- Do not touch: Authentication, AI features, Notifications, Colour scheme, PWA
