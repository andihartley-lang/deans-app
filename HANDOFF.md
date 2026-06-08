# Orbit — Handoff Note
Last updated: June 2026 (2026-06-08)

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
- Time-sensitive prompt — appears when task has no date and keywords match
- Help and Settings page — four sections, About You working, others placeholder
- Toast notifications — single shared purple toast system (components/Toast.tsx) used everywhere; no native browser alert() dialogs remain anywhere in the app
- Page metadata

## What Was Just Completed
Replaced every browser alert() in the codebase with the existing styled toast notification system. Created a shared components/Toast.tsx presentational component (exact same styling and 2-second fade animation as the original "Item saved" toast) and wired it into app/app/page.tsx, ProfileSection.tsx, AuthSection.tsx, and reset-password/page.tsx. ProfileSection reuses the parent page's toast instance via an onToast callback; AuthSection and reset-password (separate route trees) manage their own local toast state using the same pattern. No save logic, error handling, or control flow was changed — purely a swap of the notification mechanism. Verified on localhost with a headless browser: triggered the "Passwords don't match." and "Invalid login credentials" toasts, confirmed they render as the styled purple toast with zero native dialogs, and confirmed tsc --noEmit passes with no remaining alert( calls anywhere in the codebase.

Also completed earlier in this session: ProfileSection save handler now confirms writes via re-fetch before showing success, the /auth page was redesigned into Sign In / Create Account views matching the landing page, two small text edits were made, and the Help & Settings card width report was investigated (could not reproduce — defensive w-full classes added).

## Known Issues
- Settings section cards reported as inconsistent width by the user — not reproducible in code or in pixel-measurement testing across 8 viewport widths; defensive w-full classes added to all four cards, their inputs/textarea, and a shared max-width wrapper, but the root cause is unconfirmed. Possibly browser cache, zoom, or display scaling on the user's side — ask for a screenshot if it resurfaces
- MOT and compound keywords not always triggering time-sensitive date prompt
- View all buttons not wired up
- Keyboard shortcuts Ctrl+C and Ctrl+V stopped working in VS Code terminal — close and reopen VS Code to fix
- Help and Settings sections Security, How Orbit Works and Share Your Thoughts are all placeholders — need building
- "Item saved" and "Profile saved" toasts (which require a logged-in session to trigger) were not directly exercised in the latest browser test — they use the identical Toast component already verified working for the error-toast paths, so should behave identically. Worth a quick authenticated check on the live URL

## Next Priorities In Order
1. Logo integration — two PNG concepts exist, Image 1 (glowing ring) for app icon and sidebar, Image 2 (intertwining rings) for landing page
2. Recurring tasks — annual renewals auto-recreate on completion eg MOT, insurance, passport
3. Wire up feedback form in Help and Settings
4. How Orbit Works — design and content for help section
5. Domain registration — orbit.co.uk
6. Email address — hello@orbit.co.uk
7. T&Cs and privacy policy

## Supabase Notes
- items table: id, user_id, title, due_date (type: date), status, created_at, completed_at
- profiles table: id, user_id, display_name, created_at
- RLS enabled on both tables
- Redirect URLs include: http://localhost:3000 and https://deans-app.vercel.app and https://deans-app.vercel.app/reset-password
- Email rate limit on free tier: 2 per hour — affects signup and password reset testing

## Environment Variables
- .env.local contains NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY
- All three are also set in Vercel environment variables
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
