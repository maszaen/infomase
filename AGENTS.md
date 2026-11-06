<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Workflow & Git Commit Guidelines

1. **Rekomendasi Commit & Push per Task**:
   - Setiap kali menyelesaikan sebuah task atau perbaikan, agen **wajib** memberikan rekomendasi perintah Git yang spesifik kepada pengguna.
   - Gunakan parameter `git -C <directory>` untuk menargetkan repositori yang sesuai (misalnya `git -C .` untuk root frontend `undangan-online`, atau `git -C infomase-backend` untuk repositori backend).

2. **Rekomendasi Commit Message**:
   - Selalu sertakan format pesan commit yang jelas, terstruktur (disarankan Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, dsb.), dan deskriptif sesuai cakupan perubahan task yang baru diselesaikan.
   - Sediakan perintah siap salin (*copy-paste*) untuk:
     - `git -C <dir> status`
     - `git -C <dir> add <files>`
     - `git -C <dir> commit -m "<pesan rekomendasi>"`
     - `git -C <dir> push <remote> <branch>`
