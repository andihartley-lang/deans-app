# Orbit — Handoff Note
Last updated: June 2026

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
- Password reset — forgot password link on landing page, /reset-password page, confirmation message
- User-owned items with RLS
- Profiles and display name
- View filtering — Today, Upcoming, Inbox, Dashboard all mutually exclusive
- Natural language capture — AI fires for inputs over 6 words, extracts title only
- Date picker — calendar only, optional
- Time-sensitive prompt — appears when task has no date and keywords match
- Help and Settings page — four sections, About You working, others placeholder
- Toast notifications
- Page metadata

## What Was Just Completed
Password reset flow — fully working on live URL. Forgot password link on landing page navigates to /auth?view=forgot. Reset email sends correctly. Link redirects to /reset-password. User sets new password. Confirmation message shown. Continue to Orbit button redirects to /app.

## Known Issues
- Auth page styling: two headings showing (Welcome to Orbit and Account), button colours inconsistent (purple and green), needs cleanup
- Settings section cards inconsistent width — minor visual fix
- MOT and compound keywords not always triggering time-sensitive date prompt
- View all buttons not wired up
- Keyboard shortcuts Ctrl+C and Ctrl+V stopped working in VS Code terminal — close and reopen VS Code to fix
- Password reset on live URL not fully tested — Supabase email rate limit hit during testing. Test this first next session before anything else.
- Help and Settings sections Security, How Orbit Works and Share Your Thoughts are all placeholders — need building

## Next Priorities In Order
1. Fix auth page styling — one clean heading, consistent purple buttons, tidy layout
2. Fix settings card widths — all cards same width and style
3. Logo integration — two PNG concepts exist, Image 1 (glowing ring) for app icon and sidebar, Image 2 (intertwining rings) for landing page
4. Recurring tasks — annual renewals auto-recreate on completion eg MOT, insurance, passport
5. Wire up feedback form in Help and Settings
6. How Orbit Works — design and content for help section
7. Domain registration — orbit.co.uk
8. Email address — hello@orbit.co.uk
9. T&Cs and privacy policy

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
