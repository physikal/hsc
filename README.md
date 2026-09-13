# Horseshoe Curve Outdoors

Booking and contact site for Horseshoe Curve Outdoors.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AgentMail notifications

Contact Us and booking submissions send mail via AgentMail so a monitoring agent can watch the inbox.

| Variable | Purpose |
| --- | --- |
| `AGENTMAIL_API_KEY` | AgentMail API key (required to send) |
| `AGENTMAIL_NOTIFY_INBOX` | **From** address — must differ from the agent inbox |
| `AGENTMAIL_AGENT_INBOX` | **To** address — agent-watched inbox |

**Critical:** `AGENTMAIL_NOTIFY_INBOX` must **not** equal `AGENTMAIL_AGENT_INBOX`.

Send-to-self (`From` = `To` = `jjammer@…`) lands with AgentMail labels `sent` only — **not** `received` / `unread` — so inbox watchers that filter on those labels miss the message. Forms still return `{"ok":true}`; the gap is watchability, not form success.

Recommended production values:

```bash
AGENTMAIL_API_KEY=am_…
AGENTMAIL_NOTIFY_INBOX=hsc-notify@physhlab.com
AGENTMAIL_AGENT_INBOX=jjammer@physhlab.com
```

Fallback From (also verified received/unread): `hscapp2@agentmail.to`.

| Field | Value |
| --- | --- |
| From | notify inbox |
| To | agent inbox |
| Reply-To | customer email |
| Subjects | `[HSC Contact] …` / `[HSC Booking] …` |

If notify equals agent at runtime, the app coerces From to `hsc-notify@physhlab.com` and logs a warning.

Without `AGENTMAIL_API_KEY`, APIs still return success and skip send (logged).

### Smoke test (agent watchability)

1. Submit Contact Us or create a booking on production.
2. In AgentMail, open `jjammer@physhlab.com`.
3. Confirm a new message with From `hsc-notify@physhlab.com` (not `jjammer@`), labels **`received`** and **`unread`**, subject `[HSC Contact]…` or `[HSC Booking]…`.

### Vercel env checklist

Set on Production (and Preview if needed), then redeploy:

1. `AGENTMAIL_API_KEY` — key that can send as the notify inbox
2. `AGENTMAIL_NOTIFY_INBOX=hsc-notify@physhlab.com`
3. `AGENTMAIL_AGENT_INBOX=jjammer@physhlab.com`
4. Confirm NOTIFY ≠ AGENT in the dashboard

Helper (after `vercel login`): `/tmp/configure-hsc-agentmail-env.sh` on the agent machine, or Project → Settings → Environment Variables.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
