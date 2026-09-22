# Mason & Arc Operations Checklist

This file covers the remaining production checks that require the studio computer or an external account.

## 1. Google Drive production verification

Project folders are created automatically under `Mason & Arc Projects`.

Verify both paths after deployment:

1. Admin: `/app/admin/files`
   - Upload a normal project file.
   - Choose a category such as Render, Model, Report, Contract, Deliverable, or Drawing.
   - Confirm the record appears in the shared Files page and opens with **Open Drive**.

2. Engineer: `/app/engineer/files/new`
   - Upload a file to a project assigned to the engineer.
   - Confirm it appears in `/app/engineer/files`.

3. Site: `/app/engineer/site/new`
   - Create a site report and attach one or more images.
   - Confirm the report is saved and the images appear in the project's `06_Site` Google Drive folder.

## 2. Database backup and restore drill

The backup command verifies the PostgreSQL custom archive immediately after creation:

```powershell
npm.cmd run db:backup
```

For a restore drill, create a disposable PostgreSQL database and put its connection string in `.env.local` as:

```text
RESTORE_DATABASE_URL=postgresql://...
```

The restore script refuses to run when `RESTORE_DATABASE_URL` is identical to `DATABASE_URL`.

Run:

```powershell
npm.cmd run db:restore -- ".\backups\mason-arc-YYYY-MM-DDTHH-MM-SS.dump" --confirm
```

The script restores into the disposable database and prints row counts for users, projects, and files.

## 3. Office AI Cloudflare Tunnel

The office computer already uses a loopback-only bridge on port 8787.

External account step:

1. Create a named Cloudflare Tunnel.
2. Point a hostname such as `office-ai.masonandarc.com` to the tunnel.
3. Configure the tunnel service to forward to `http://127.0.0.1:8787`.
4. Put the generated tunnel token in the office computer environment as `OFFICE_AI_TUNNEL_TOKEN`.
5. Keep `OFFICE_AI_BRIDGE_TOKEN` server-side and identical on the office bridge and hosted Mason & Arc environment.
6. Set the hosted environment variable:
   `OFFICE_AI_BRIDGE_URL=https://office-ai.masonandarc.com`

Start/check the local stack:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-ai-stack.ps1
```

Or start only the bridge/tunnel:

```powershell
npm.cmd run ai:tunnel
```

Never expose Ollama (11434) or ComfyUI (8188) directly to the internet.

## 4. WhatsApp

Free/manual messaging is available at:

`/app/admin/whatsapp`

It uses WhatsApp Click to Chat. The message is prefilled, but a person still presses Send.

Official automatic sending remains disabled unless the studio later configures the WhatsApp Business API and explicitly enables it.
