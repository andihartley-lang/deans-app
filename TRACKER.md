# Orbit — Development Tracker
Running log of all development activity. Most recent entry first. Earlier entries are history — do not delete.

## SESSION 5 — June 2026 (2026-06-09)
Status: Recurring tasks feature complete.

### Completed
- Added `is_recurring?: boolean` to the `Item` type
- Keyword detection at capture: `saveItem` checks for insurance, mot, road tax, boiler service, tv licence (case-insensitive) and silently sets `is_recurring: true` on insert — no UI change at capture
- `completeItemWithRecurring` function in page.tsx: completes current item, inserts new identical item with `is_recurring: true` and chosen due date, refreshes list, shows toast "Done — your [title] is saved for [dd/mm/yy]"
- TaskCard now a "use client" component with inline recurring prompt: when Complete is clicked on a recurring item, card expands to show checkbox "Add a reminder for next year" (ticked by default), DatePicker pre-set to one year from today, and Confirm button. Ticked + confirm → recurring completion. Unticked + confirm → normal completion. Non-recurring items complete immediately as before
- InboxSection refactored to use an `InboxCard` sub-component with identical recurring prompt logic and own per-card state
- `nextYearISO()` and `formatDDMMYY()` helpers added to lib/itemUtils.ts
- UpcomingSection threads `completeItemWithRecurring` through to TaskCard

### Known Issues Outstanding
- Settings section cards inconsistent width — not reproducible; defensive w-full classes already added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing)
- View all buttons not wired up
- Date picker in recurring prompt shows "9 Jun 2027" format rather than dd/mm/yy in the card UI (dd/mm/yy appears correctly in the toast)

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
- Profile created automatically on login
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
