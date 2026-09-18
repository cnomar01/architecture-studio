MASON & ARC — FINAL BATCH OVERLAY

Includes the remaining Office OS modules in one batch:
5 Approvals
11 CRM / Clients
12 Database + Permissions migration support
13 Notifications
14 PWA manifest foundation
15 Documents
16 Procurement
17 Dashboard / Reports
18 Final integration foundation

IMPORTANT: This is an OVERLAY package, not a replacement for the existing project. It is designed to be copied on top of the current Mason & Arc project so existing finished work is preserved.

Install:
1) Extract this folder.
2) Open PowerShell.
3) Run: powershell -ExecutionPolicy Bypass -File .\BATCH-INSTALL.ps1
4) Run: node --env-file=.env.local scripts/batch-final-migration.mjs
5) Run: npm run build

Existing Tasks / Files / Timeline / Finance / Site / QC / HSE are not replaced.
