// Single source of truth for the CV / resume PDF URL served by the website.
// On every build (`scripts/sync-cv.mjs`), the newest `.pdf` uploaded to the
// repo root (or `public/assets/cv_hector_carrion.pdf`) is automatically synced
// to `public/assets/cv_hector_carrion.pdf` — no code edits required.
export const RESUME_URL = '/assets/cv_hector_carrion.pdf'
