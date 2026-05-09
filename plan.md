# Invyo V1 Product Plan

## Overview

Invyo is a wedding invitation platform where clients browse and pick from pre-built templates, customize their details, manage RSVPs, and publish their invitation on a custom subdomain (`{name}.invyo.uk`). No AI builder — human-crafted templates, with a "contact us for custom" escape hatch.

---

## Product Vision

- **Template gallery** on the marketing site — clients browse and pick a template.
- **Client dashboard** — after picking a template, clients get a private workspace to:
  - Fill in their invitation details (names, date, venue, etc.) with a live preview.
  - View and manage their RSVP list.
  - Publish (gated behind payment).
- **Custom subdomain publishing** — each published invitation lives at `{slug}.invyo.uk` (e.g. `zimandyanal.invyo.uk`). Client chooses their slug; we handle subdomain routing.
- **Admin panel** — internal view of all clients, invitations, RSVPs, payments, and subdomain status.
- **Custom builds** — a "Get a custom invitation" CTA routes to the contact form; no in-app custom builder.

---

## Confirmed Product Decisions

- Templates only for self-serve; custom requests go through contact form.
- Clients pay before their invitation goes live (publish is gated by payment).
- Subdomains are `{slug}.invyo.uk` — slug chosen by client at setup, must be unique.
- One shared Next.js app: marketing site + client dashboard + admin panel (route-separated).
- Auth required for dashboard (email/password or magic link, TBD).

---

## V1 Scope

### Marketing Site (already partially built)
- Landing page, features, FAQ, contact form ✓
- Add **template gallery page** — grid of available templates with preview and "Use this template" CTA.

### Auth
- Sign up / log in (email + password or magic link).
- Session management via middleware (already has `middleware.ts`).

### Client Onboarding + Dashboard
- After sign-up, client picks a template (or is redirected from gallery).
- **Setup wizard**: choose slug (`{name}.invyo.uk`), enter event details (couple names, date, venue, dress code, etc.).
- **Dashboard views**:
  1. **Preview & Edit** — left panel: form fields to fill in invitation content. Right panel: live preview of the template rendered with their data.
  2. **RSVP List** — table of guest responses (name, attending, +1, dietary, message). Filter/export.
  3. **Settings** — change slug (if not published), update event details, manage access code for RSVP dashboard sharing.
- **Publish flow**: "Publish" button triggers payment (Stripe or similar). On success, invitation goes live at `{slug}.invyo.uk`.

### RSVP
- Public RSVP form at `{slug}.invyo.uk/rsvp` (or embedded in invite page).
- Fields: name, attending (yes/no), number of guests, dietary requirements, message.
- Responses stored and visible in client dashboard.

### Payment / Publish Gate
- One-time payment to publish (pricing TBD).
- After payment confirmed, subdomain is provisioned and invitation is live.
- Unpublished invitations remain in draft — no public URL.

### Subdomain Routing
- Wildcard DNS: `*.invyo.uk` points to our server.
- Next.js middleware reads `host` header and routes to the correct invitation.
- Slug is unique and validated at setup (alphanumeric + hyphens, no reserved words).
- Reserved slugs: `www`, `app`, `admin`, `api`, `mail`, `support`, etc.

### Admin Panel (`/admin`)
- Protected by admin role.
- Views:
  - **Clients** — list of all users, their chosen template, slug, payment status, publish status.
  - **Invitations** — per-invitation detail: content, preview, RSVP count, subdomain.
  - **RSVPs** — all responses across all events, filterable by event.
  - **Payments** — payment records, refund actions.
  - **Slugs** — all registered subdomains, ability to revoke/reassign.

---

## Data Model (High-Level)

- `users` — id, email, password_hash, role (client | admin), created_at
- `events` — id, user_id, couple_names, date, venue, dress_code, extra_details (JSON)
- `invitations` — id, event_id, template_id, slug (unique), status (draft | published), published_at, content (JSON overrides)
- `templates` — id, name, preview_image_url, component_key, description, active
- `rsvp_responses` — id, invitation_id, guest_name, attending, guest_count, dietary, message, created_at
- `payments` — id, invitation_id, amount, currency, status, provider_ref, created_at
- `audit_logs` — id, actor_id, action, target_type, target_id, created_at

---

## Subdomain Strategy (Technical)

1. **DNS**: Wildcard `A` record `*.invyo.uk` → server IP (or Vercel wildcard domain).
2. **Middleware**: `middleware.ts` inspects `request.headers.get('host')`:
   - If host matches `{slug}.invyo.uk`, extract slug → look up invitation → render invite page.
   - If host is `www.invyo.uk` or `invyo.uk`, serve marketing site.
   - If host is `app.invyo.uk`, serve dashboard.
   - If host is `admin.invyo.uk`, serve admin panel.
3. **Slug validation**: unique, 3–40 chars, alphanumeric + hyphens, no reserved words.
4. **Vercel**: use Vercel's wildcard domain feature (`*.invyo.uk`) — no per-subdomain config needed per client.

---

## Delivery Phases

### Phase 1 — Foundation
- Auth (sign up, log in, session, middleware guard).
- DB schema: users, events, invitations, templates, payments, rsvp_responses.
- Template seed data (at least 2–3 templates to start).
- Template gallery page on marketing site.

### Phase 2 — Client Dashboard
- Onboarding wizard: pick template → set slug → fill event details.
- Preview & Edit view (live preview of template with client data).
- Slug uniqueness validation.

### Phase 3 — Publish + Subdomain Routing
- Payment integration (Stripe).
- Publish gate: payment → set status = published → subdomain live.
- Middleware subdomain routing for published invitations.
- RSVP public form on invitation page.

### Phase 4 — RSVP Dashboard + Admin
- RSVP list in client dashboard.
- Admin panel (clients, invitations, RSVPs, payments, slugs).

### Phase 5 — Polish + Launch
- Email notifications (RSVP received, payment confirmed, invitation published).
- Template gallery expanded.
- SEO, performance, security hardening.
- Custom "contact for custom build" flow polished.
