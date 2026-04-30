---
name: Invyo Product Plan
overview: Design a Lovable-style wedding invitation product with concierge-heavy creation, token-based monetization, separate user/admin apps, and a shared backend. The plan covers product scope, system architecture, data model, build phases, and launch metrics.
todos:
  - id: define-schema
    content: Design invitation schema (sections, theme tokens, versioning, optional agenda/countdown settings).
    status: pending
  - id: architecture-bootstrap
    content: Set up monorepo with apps/web, apps/admin, apps/api and shared packages for types/components.
    status: pending
  - id: generation-pipeline
    content: Implement concierge-style generation pipeline from style brief to structured invitation config.
    status: pending
  - id: builder-preview
    content: Build live preview + section editors + publish/version flow in user app.
    status: pending
  - id: rsvp-protected-dashboard
    content: Implement RSVP public form and owner-only code-protected RSVP dashboard.
    status: pending
  - id: token-ledger-billing
    content: Ship token wallet/ledger with purchase flow ($25 for 50 tokens) and usage metering.
    status: pending
  - id: admin-ops-panel
    content: Build admin app for moderation, generation oversight, support actions, and token adjustments.
    status: pending
  - id: analytics-hardening
    content: Add funnel analytics, security controls, rate limits, audit logging, and launch QA gates.
    status: pending
isProject: false
---

# Invyo V1 Product + Architecture Plan

## Goal
Build a production-ready wedding invitation platform where users describe their desired style and Invyo generates editable invitation experiences, with secure RSVP management and token-based usage billing.

## Confirmed Product Decisions
- Concierge-heavy builder for V1 (AI/designer-assisted creation, not fully DIY prompting).
- Separate apps for user-facing builder and internal admin operations, with one shared backend/API.
- Token-only billing at launch (`$25 = 50 tokens`).
- Lovable-style delivery model: live preview + publish/versioned invitation URLs.

## V1 Product Scope
- **Landing + acquisition**: existing marketing site evolves into conversion funnel.
- **User app**:
  - Onboarding + event setup.
  - Theme description input (guided form + free-text brief).
  - Generated invitation sections (editable):
    1) Interactive opening
    2) Hero
    3) Countdown (with optional animation/gif)
    4) Agenda (optional)
    5) Location
    6) Dress code
    7) RSVP
    8) Footer
  - Live preview and publish workflow.
  - Private RSVP dashboard protected by user-defined access code.
- **Admin app**:
  - User/event moderation and support tools.
  - Generation job review/override.
  - Token/billing adjustments and refunds.
  - Content/template controls.

## System Architecture
- **Frontend apps**:
  - `apps/web` (marketing + builder + owner dashboards)
  - `apps/admin` (internal operations)
- **Shared backend**:
  - `apps/api` (REST/GraphQL, auth, invitation generation orchestration, publish, RSVP, token ledger)
- **Core services inside shared backend (modular)**:
  - Auth + RBAC
  - Invitation schema/sections engine
  - Generation pipeline (prompt/template + component selection)
  - Publish/version service
  - RSVP service
  - Token wallet + usage ledger
  - Billing webhook handler
- **Storage**:
  - Relational DB (users/events/invitations/rsvp/tokens)
  - Object storage for media assets and generated artifacts
  - Cache/queue for generation jobs and live preview performance

## Lovable-Style Build Model (Practical)
- User enters style brief + preferences.
- Backend translates brief into a structured invitation config (theme tokens + section variants + content blocks).
- UI renders from config using a controlled component library (not arbitrary code execution).
- User can edit section-level controls (copy, colors, fonts, media, order, toggles).
- Publish creates immutable version (`/invite/{slug}/v/{version}`) and latest alias (`/invite/{slug}`).

## Data Model (High-Level)
- `users`, `events`, `invitations`, `invitation_versions`, `section_configs`, `theme_tokens`
- `rsvp_forms`, `rsvp_responses`, `guest_groups`, `access_codes`
- `token_wallets`, `token_transactions`, `generation_jobs`, `billing_events`
- `audit_logs` for admin-sensitive actions

## Security + Access
- Owner and admin role separation.
- RSVP dashboard protected by event code + owner auth.
- Rate limiting on RSVP submission and code entry.
- Signed media URLs for private assets.
- Audit trails for token and admin actions.

## Token Economy (V1)
- Pack: `$25 => 50 tokens`.
- Token spend events:
  - New generated invitation concept
  - Regeneration of section/style variants
  - Premium animation/gif enhancements
  - Bulk RSVP reminder actions (if enabled)
- Add token estimator in UI before running generation.

## Delivery Phases
- **Phase 1: Foundations (2-3 weeks)**
  - Monorepo structure, auth, event model, invitation schema, basic builder shell.
- **Phase 2: Generation + Sections (3-4 weeks)**
  - Style brief parser, component mapping, section editors, live preview.
- **Phase 3: RSVP + Publish (2-3 weeks)**
  - RSVP forms/responses, code-protected owner dashboard, publish/version pipeline.
- **Phase 4: Tokens + Admin (2-3 weeks)**
  - Wallet/ledger, token purchase flow, admin operations panel.
- **Phase 5: Hardening + GTM (1-2 weeks)**
  - QA, analytics funnel, abuse controls, support tooling, pilot onboarding.

## Key Metrics for 6-Figure Trajectory
- Visitor -> signup conversion
- Signup -> first generated invitation rate
- Publish rate per created event
- RSVP response completion rate
- Token purchase conversion + repeat purchase rate
- Cost per generation vs token revenue margin

## Immediate Next Step
Define the invitation JSON schema and section component contract first; this unlocks generation, preview, publish, and admin moderation with one shared source of truth.