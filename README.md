# Ariel Tabak — Portfolio

Personal engineering portfolio at https://arieltabak.ca, served with GitHub Pages.

Plain HTML + CSS, no build step.

| Page | Contents |
|---|---|
| `index.html` | Home: intro, featured work, about, contact |
| `projects.html` | All projects: Personal projects, Academic research, Student teams & coursework |
| `notes.html` | Freeform posts: thoughts, reviews, experiments |
| `work.html`, `research.html`, `clubs-coursework.html` | Redirects to `projects.html` (kept so old links work) |

- `projects/*.html` — one page per project
- `notes/_template.html` — copy this to start a new post
- `assets/style.css` — all styling; `assets/lightbox.js` — tap-to-enlarge viewer
- `images/projects/` — project photos, figures and clips
- `Ariel_Tabak_Resume.pdf` — public résumé (no phone number)

After changing CSS/JS, bump the `?v=` number in the HTML links so browsers fetch the new copy.
