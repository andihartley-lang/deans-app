# Orbit — Handoff Note
Last updated: June 2026 (2026-06-09)

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
- Authentication — signup, login, logout, session persistence, auth gates
- Auth page — redesigned into two dark-themed views (Sign In, Create Account) matching the landing page, URL-driven via ?view=
- Password reset — forgot password link on landing page, /reset-password page, confirmation message
- User-owned items with RLS
- Profiles and display name — save handler confirms the write via re-fetch before showing success and updating the dashboard
- View filtering — Today, Upcoming, Inbox, Dashboard all mutually exclusive
- Natural language capture — AI fires for inputs over 6 words, extracts title only
- Date picker — calendar only, optional
- Time-sensitive task prompt — gentle amber card, Add a date or No date needed
- Help and Settings page — About You and Share Your Thoughts working; Security and How Orbit Works placeholder
- Toast notifications — single shared purple toast system (components/Toast.tsx)
- Page metadata
- Recurring tasks — full feature complete (see below)
- Feedback form — working EmailJS integration in Share Your Thoughts (see below)

## Recurring Tasks Feature (complete)
Five keywords detected at capture (insurance, mot, road tax, boiler service, tv licence) — `saveItem` silently sets `is_recurring: true`. When completing a recurring item, an inline prompt expands on the card:
- Checkbox "Add a reminder for next year" (ticked by default)
- Date picker pre-set to one year from the task's own due date (falls back to one year from today if no due date)
- Date picker hides when checkbox is unticked, reappears when reticked
- Confirm button

Ticked + confirm: completes current item, creates new identical recurring item with chosen date, toast "Done — your [title] is saved for [dd/mm/yy]". Unticked + confirm: completes normally. Non-recurring items complete immediately with no prompt.

Both TaskCard (Upcoming) and InboxCard (Inbox) implement the prompt with their own per-card state. Logic lives in `completeItemWithRecurring` in page.tsx.

## EmailJS Feedback Form (complete — pending Vercel env var confirmation)
Share Your Thoughts card in ProfileSection.tsx sends feedback via EmailJS:
- Service ID: `service_ecsh1ih` (in source)
- Template ID: `template_3etw4ta` (in source)
- Public Key: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — stored in `.env.local` (not committed), must also be set in Vercel environment variables
- On success: clears textarea, shows toast "Thank you — your thoughts help shape Orbit"
- On failure: shows toast "Something went wrong — please try again"
- Send button disabled when textarea is empty or while sending

**Action required:** Confirm `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=yueNLUFED-Z-NSr5W` is set in Vercel → Project → Settings → Environment Variables. Without it the send will fail on the live URL. After adding it, redeploy (or push any change) to pick it up.

## Known Issues
- Vercel env var for EmailJS public key may not yet be confirmed set — actual email delivery needs user to test by signing in and sending a real message
- Settings section cards reported as inconsistent width — not reproducible in testing; defensive w-full classes added
- MOT and compound keywords not always triggering time-sensitive date nudge (pre-existing, separate from recurring feature)
- View all buttons not wired up
- Security and How Orbit Works sections are placeholders

## Next Priorities In Order
1. Confirm Vercel env var is set and verify real email delivery (user signs in, sends message, checks inbox)
2. How Orbit Works — design and content for help section
3. Domain registration — orbit.co.uk
4. Email address — hello@orbit.co.uk
5. T&Cs and privacy policy

## Supabase Notes
- items table: id, user_id, title, due_date (type: date), status, is_recurring (boolean, default false), created_at, completed_at
- profiles table: id, user_id, display_name, created_at
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
