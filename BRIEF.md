# Orbit — Master Product Brief
Version 4.0 | June 2026 | Single source of truth

## What Orbit Is
Orbit is a calm life-admin application designed to reduce cognitive overload.

"A calm place to manage life admin."

### Orbit is:
- Calm, lightweight, trustworthy, low-friction, emotionally relieving
- Independence-supporting, not dependency-creating
- Built for dignity, not productivity

### Orbit is NOT:
- A project manager or second brain
- A corporate productivity suite
- A chatbot-first AI assistant
- A Notion clone
- A surveillance tool

## Target Users

### Primary
- People with ADHD / neurodivergent users
- Busy parents and household organisers
- Older users wanting simplicity
- People overwhelmed by traditional productivity systems

### Secondary (Highest Commercial Opportunity)
- Home carers — adult children managing a parent living at home with memory challenges
- Care home managers — organisations supporting residents independence
- ADHD coaches — professionals who recommend tools to clients

### Origin Story
Orbit was built because the founders father began forgetting things due to illness. Every existing app was too complicated, too alarming, or made him feel like a patient. Orbit was built to fix that. This story is the entire marketing strategy — it is authentic, emotional, and exactly what carer communities respond to.

## The Independence-First Principle
People with memory challenges, cognitive load, or life overwhelm still want to be independent. Orbit exists to support that independence — not replace it, monitor it, or report on it.

Every feature must be tested against this question: Does this help the user feel more in control of their own life — or does it hand control to someone else?

## Household Visibility Principle
- One owner per task
- Ownership assigned automatically from logged-in account
- Optional visibility for trusted household members
- User-controlled sharing — always initiated by the user, never imposed
- Ownership remains unchanged

Shared tasks (home insurance, boiler service etc) — undecided. Likely one owner with optional visibility.

## Handover Principle
A future capability allowing a user to nominate a trusted person to assume responsibility for the account if the user loses capacity. Framing: "Pass control to someone I trust" — not "Someone takes control of my account." Sits on roadmap after household visibility.

## Document Handling Principle
Orbit is not a document management platform. No document uploads at launch. Future document processing only if strictly task-focused, source documents not retained, strong safeguards exist.

## Notification Philosophy
Orbit does not bombard users with notifications. This is a deliberate product decision.

### Tier 1 — The User
- One optional gentle daily nudge, user chooses the time
- No content in the notification — just an invitation to open Orbit
- Off by default
- Tone: "Open Orbit" — nothing more

### Tier 2 — Escalation (Only if User Explicitly Opts In)
- User decides per task whether to involve a support person
- User names the person and relationship
- User can remove them at any time

### Tier 3 — The Support Person
- One calm daily digest if anything needs attention
- Only triggered if: task overdue AND user hasnt completed it AND user opted them in
- Support person cannot see users full task list — only the specific linked task

### Explicitly Rejected
- Per-task push alerts
- Alarming red notifications
- Guilt messaging
- Carers having full visibility of user task list
- Notifications the user didnt ask for

## AI Features — Ambient and Invisible
AI should reduce thinking, not create more interaction. AI is never the interface.

### Priority 1 — Natural Language Capture (Complete)
User types a long or conversational sentence. AI extracts a clean short title only. Date always set by user via calendar picker. AI call only fires for inputs over 6 words.

Data processing: the raw task description (over 6 words) is sent to Anthropic as part of a system prompt. Anthropic returns a simplified 3–5 word title. Only the returned title is stored in Supabase — the original raw description is not intentionally stored in the Orbit application database. Raw descriptions may appear in Vercel infrastructure logs and Anthropic API logs, both outside Orbit's direct control. Anthropic data retention, training usage and processing terms must be reviewed before public launch to ensure alignment with the published Privacy Policy.

### Priority 2 — Intelligent Categorisation
Currently handled by keyword matching in getItemIcon(). Full AI categorisation is a future enhancement.

### Priority 3 — Soft Prioritisation
Future. AI quietly decides what deserves attention.

### Priority 4 — Cognitive Simplification
Future. AI as a filter, not a generator.

### Priority 5 — Intelligent Grouping
Future. Orbit recognises related tasks and groups automatically.

### AI Features Explicitly Rejected
- AI chatbot homepage
- Ask Orbit anything interface
- Constant AI conversations
- Productivity coaching
- AI telling users how to live
- AI-generated motivational messages
- AI becoming the main interface

### AI Cost Management
- API calls charged per use
- AI only fires for inputs over 6 words
- AI extracts title only — not date, not category
- Date always user-controlled via calendar picker
- Icon and category handled by keyword matching — no API call

## Sensitive Information Detection (Future Consideration)
Orbit does not currently analyse task content for passwords, bank details, government identifiers, medical record numbers, or other sensitive information.

Future detection may be considered if real-world user behaviour demonstrates a genuine need. Any implementation must remain calm, non-blocking, and user-controlled.

Orbit should guide users toward storing reminders rather than secrets, but must not create a feeling of surveillance or interrupt the core capture experience.

The following approaches have been considered and are currently rejected:

Permanent warnings beneath the capture box
Popups or modal warnings during capture
Alarmist or high-friction alerts
Automatic blocking of task creation
Continuous monitoring that creates a feeling of being watched

Any future safeguard should only be introduced if supported by evidence from real users and must remain consistent with Orbit's principles of dignity, independence, and low cognitive load.

## Tech Stack
- Frontend: Next.js App Router, React, TypeScript, TailwindCSS
- Backend: Supabase
- Deployment: Vercel
- Version Control: GitHub
- AI: Anthropic Claude API
- Payments: Stripe (to be integrated)

## Database

### items
- id (uuid)
- user_id
- title
- due_date (type: date — plain date, no timezone)
- status (critical / active / scheduled / captured / completed)
- is_recurring (boolean, default false — set automatically at capture for insurance, MOT, road tax, boiler service, TV licence)
- created_at
- completed_at

### profiles
- id (uuid)
- user_id
- display_name (optional, 30 char max, whitespace trimmed)
- created_at

RLS enabled on both tables. All future tables must have RLS enabled by default.

## Architecture

### Routes
- / Landing page
- /auth Authentication
- /app Orbit application
- /reset-password Password reset
- /terms Terms of Service
- /privacy Privacy Policy

### Components
- Sidebar.tsx
- HeroSection.tsx
- UpcomingSection.tsx
- InboxSection.tsx
- TaskCard.tsx
- LandingPage.tsx
- AuthSection.tsx
- ProfileSection.tsx
- DatePicker.tsx

### Infrastructure
- types/item.ts
- lib/itemUtils.ts
- lib/supabase.ts
- lib/auth.ts
- app/api/parse-item/route.ts

## View Logic
- Today: overdue tasks under "Still to do", tasks due today under "On your plate today". No future tasks. No inbox items.
- Upcoming: future dated tasks only, grouped Soon and Later. No overdue. No inbox items.
- Inbox: undated tasks only. No dated tasks.
- Dashboard: overview showing today, upcoming, and inbox.

## Item Creation Flow
- Free text input
- Optional calendar date picker
- 6 words or fewer — saves directly, no API call
- More than 6 words — AI extracts clean short title
- No date and time-sensitive keywords — gentle prompt: "This one might need a date — want to add one?"
- User chooses "Add a date" or "No date needed" before task saves

## Help & Settings
- About You — display name management (working)
- Security — Change password (placeholder)
- How Orbit Works — complete five-section accordion guide (working): Capture it, Your views, Check in daily, Forgotten your password?, Coming soon
- Share Your Thoughts — EmailJS feedback form (working)
- Terms of Service link — links to /terms
- Privacy Policy link — links to /privacy

## Security Principles
- Minimal password requirements — 8 characters minimum, no complexity rules
- Designed for dignity not friction
- RLS enabled on all tables
- No document uploads at launch
- Minimal personal data collection
- ANTHROPIC_API_KEY in .env.local and Vercel environment variables
- Never commit .env.local to GitHub
- Orbit is not intended for storage of highly sensitive personal information including medical records, financial account details, government identification documents or passwords

## Known Technical Debt
- Significant rendering logic remains in app/app/page.tsx
- Settings card widths inconsistent
- No error boundaries
- No mobile optimisation
- No automated testing
- View all buttons not wired up
- No self-service account deletion — required before public launch; must delete tasks, profile and Supabase auth account with confirmation step
- No GDPR data export functionality — assess effort post launch; do not build yet

## Go-To-Market Strategy

Orbit launches as a consumer product — designed for individual users managing their own life admin. The caregiver and care-home opportunity is a commercial expansion path built on top of the core consumer product, not a replacement for it. The founder story connects both: it is authentic to carers and equally resonant with anyone who has felt overwhelmed by life admin.

### Phase 1 — Consumer Launch via Carer Communities
- Orbit is positioned as a tool for the individual — including adults caring for a parent
- Join UK carer Facebook groups and Reddit communities; share the founder story
- Target: 50 beta users who use Orbit for themselves, not to manage someone else

### Phase 2 — AppSumo Lifetime Deal
- Price: £49-69 one-off
- Target: 100 sales = £6,000

### Phase 3 — B2B Outreach
- Care homes: residents use Orbit for their own independence; managers may support adoption
- ADHD coaches: recommend Orbit to clients as a personal organisation tool
- Care homes: £150-300/month per home
- ADHD coaches: £50-100/month per coach
- Target: 3 B2B clients = £5k/month

### Phase 4 — White Label
- Setup fee: £1,000-3,000 plus £200/month retainer

## Charging Mechanism
- B2C subscription: Stripe Checkout plus webhooks
- B2B care homes: Stripe Payment Links
- Lifetime deal: Redemption code system in Supabase
- White label: Stripe invoice plus separate Vercel/Supabase per client

B2C individual pricing not yet set. Likely £3-5/month or £25-35/year.

Example mix to hit £5,000/month:
- 10 care homes at £200 = £2,000
- 20 ADHD coaches at £75 = £1,500
- 375 individual subscribers at £4 = £1,500

## The Emotional Contract
When someone opens Orbit they should feel:
- Relief: I dont have to hold all this in my head
- Control: I chose whats here and who can see it
- Dignity: This doesnt make me feel like a child
- Trust: This app is on my side

If a feature creates anxiety, confusion, or the feeling of being watched — it does not ship.

## Domain and Identity
- Register orbit.co.uk before public launch
- Set up hello@orbit.co.uk
- Required before sharing with carer communities
