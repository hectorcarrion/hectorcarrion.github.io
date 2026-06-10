// Single source of truth for the resume PDF link.
// To roll a new revision: drop the new "Hector Carrion Resume <Month> <Year>.pdf"
// in the repo root, delete the old one, and update RESUME_FILENAME below.
export const RESUME_FILENAME = 'Hector Carrion Resume June 2026.pdf'

export const RESUME_URL =
  `https://github.com/hectorcarrion/hectorcarrion.github.io/blob/main/` +
  `${encodeURIComponent(RESUME_FILENAME)}?raw=true`
