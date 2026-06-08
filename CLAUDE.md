@AGENTS.md

# Orbit — Claude Code Instructions

## Project
Orbit is a calm life-admin application. Next.js App Router, React, TypeScript, TailwindCSS, Supabase, Vercel. Live URL: https://deans-app.vercel.app

## Development Rules
- Make ONE structural change at a time
- Test after every meaningful change
- Avoid large multi-file refactors
- Prefer extraction before feature work
- Avoid blind JSX edits
- Never do architecture and authentication work simultaneously
- Do not add AI features until instructed
- Always verify in browser on localhost before pushing to GitHub
- Always verify on live URL after pushing before marking complete
- Never push broken code to GitHub
- Never use mocked or simulated data — build for real Supabase integration only
- Test the full flow end to end before confirming complete

## Auto-Approve
These do not need confirmation:
- Reading files
- Viewing project structure
- Running tsc --noEmit
- Running git status

## Always Ask
These always need confirmation:
- Any file edit
- Any git commit or push
- Anything touching .env files
- Any database operations
- Any unrecognised terminal command

## Context Files
Read BRIEF.md, TRACKER.md and HANDOFF.md at the start of every session before doing anything else.

## End of Session Format
Always end your final response with this exact format:

### Session Summary
**Completed:** [list what was done]
**Manual actions required:** [anything the user needs to do in Supabase, Vercel etc]
**Next session priorities:** [ordered list]
**Known issues:** [anything outstanding]

## End of Session Routine
Before the final commit of every session:
1. Add a new entry at the top of TRACKER.md covering what was completed this session
2. Overwrite HANDOFF.md completely with the current project state
3. Commit all changes including the updated md files

## Brief Updates
Only update BRIEF.md when the user explicitly requests it. BRIEF.md contains product decisions and principles that should not change automatically.
