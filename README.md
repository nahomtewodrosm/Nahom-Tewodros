<div align="center">

# NAHOM TEWODROS

### A portfolio built around thoughtful interfaces, useful details, and a little orange.

An editorial, dark-mode portfolio for selected work, experience, skills, certifications, notes, testimonials, and contact — with a live map centered on Addis Ababa, Ethiopia.

[![Next.js](https://img.shields.io/badge/Next.js-15-141414?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-141414?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-141414?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-141414?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**[View the portfolio](https://nahom-tewodros-portfolio.vercel.app)** · **[Contact](mailto:nahomtewodros@gmail.com)**

</div>

---

<div align="center">

`#141414` &nbsp; `#F2EFE9` &nbsp; `#8D8A85` &nbsp; `#FF5A1F`

*Near-black canvas · warm white typography · muted details · vivid orange accent*

</div>

## The experience

The site pairs a quiet, charcoal palette with a bright orange accent, oversized editorial headings, compact navigation, and restrained motion. Each section is designed to feel connected: cards, timelines, progress indicators, orbital details, and the contact map share the same visual language.

| Section | What it does |
| --- | --- |
| **About** | Introduces Nahom and the approach behind the work. |
| **Experience** | Presents career history in a visual timeline. |
| **Selected work** | Showcases projects, technology stacks, and links. |
| **Notes** | Publishes long-form posts and ideas. |
| **Certifications** | Browses credentials in a horizontal, touch-friendly carousel. |
| **Skills** | Highlights technical and soft skills with percentage indicators. |
| **Testimonials** | Displays quotes and portraits managed from the admin area. |
| **Contact** | Sends a message and offers quick links alongside a Leaflet map of Addis Ababa. |

### Details that matter

- **Responsive by design:** layouts adapt from desktop to phone without letting horizontal interactions disrupt mobile scrolling.
- **Motion with restraint:** transitions and orbital details complement the interface and honor reduced-motion preferences.
- **Interactive map:** Leaflet and OpenStreetMap tiles show a city-level location; wheel zoom is disabled to keep page scrolling predictable.
- **Content management:** a protected admin area manages portfolio content and visitor messages.
- **Image support:** project, post, and testimonial images are stored and served through the app’s media endpoint.
- **Contact delivery:** messages are saved to the database; optional SMTP settings enable email notifications.

## Built with

| Layer | Tools |
| --- | --- |
| UI | Next.js 15 App Router, React 19, TypeScript |
| Styling | CSS, responsive layouts, reduced-motion support |
| Data | MongoDB, Prisma 6 |
| Map | Leaflet, OpenStreetMap |
| Email | Nodemailer with optional SMTP configuration |
| Tests | Jest, Testing Library |
| Hosting | Vercel |

## Run it locally

### Requirements

- Node.js compatible with Next.js 15
- npm
- A MongoDB database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>"
ADMIN_PASSWORD="replace-with-a-strong-password"
SESSION_SECRET="replace-with-a-long-random-secret"
```

`DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` are required for database access and protected admin sessions. Keep secrets in `.env` or your hosting provider’s environment settings; never commit them.

The hero’s **Currently working on** card uses the portfolio deployment by default. Optionally set `CURRENT_WORK_PROJECT`, `CURRENT_WORK_URL`, `CURRENT_WORK_COMMIT_HASH`, and `CURRENT_WORK_COMMIT_MESSAGE` in the deployment environment to show a different project and its real commit details. Leave the commit variables unset if no verified commit information is available.

Email notifications are optional. To enable them, also set:

```dotenv
SMTP_HOST="smtp.example.com"
SMTP_PORT="465"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
ADMIN_EMAIL="you@example.com"
SITE_NAME="Nahom Tewodros"
```

Without SMTP credentials, contact messages can still be saved; email notifications are skipped.

### 3. Sync the database schema

```bash
npx prisma db push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The content management area is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm test -- --ci --runInBand` | Run the Jest test suite once. |
| `npx tsc --noEmit` | Check TypeScript types without emitting files. |
| `npm run build` | Generate Prisma Client and create a production build. |
| `npm start` | Serve the production build locally. |
| `npx prisma db push` | Apply the Prisma schema to MongoDB. |

## Content and data

The Prisma schema defines these MongoDB collections:

| Model | Purpose |
| --- | --- |
| `Project` | Project descriptions, technology lists, links, and images. |
| `Post` | Notes and articles, including published status and optional media. |
| `Certification` | Certification names and reference links. |
| `Testimonial` | Quotes and author details, with optional portraits. |
| `Message` | Contact form submissions and read status. |
| `SiteSetting` | Small site-wide settings, including availability. |

Use `/admin` to manage portfolio content. Keep MongoDB credentials and the admin password private, and configure a strong `SESSION_SECRET` for signed sessions.

## Project layout

```text
app/
  admin/                 Protected content management
  api/media/             Stored image delivery
  blog/                  Published note pages
  actions.ts             Server actions for content and contact
  globals.css            Portfolio theme and responsive styles
  page.tsx               Home page and data-backed sections
components/
  CertificationCarousel.tsx
  ContactForm.tsx
  ExperienceTimeline.tsx
  LocationMap.tsx
  SkillsShowcase.tsx
  ...                    Navigation, project, notes, and hero UI
lib/
  auth.ts                Session helpers
  mail.ts                Optional email delivery
  prisma.ts              Prisma client
prisma/
  schema.prisma          MongoDB data models
```

## Deployment

The project is configured for Next.js hosting on Vercel. Before deploying:

1. Add `DATABASE_URL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` to the deployment environment.
2. Add SMTP variables if contact email notifications are desired.
3. Ensure the MongoDB deployment accepts connections from the hosting environment.
4. Deploy the application; the build script generates Prisma Client before building Next.js.

## Map attribution

The contact map uses [Leaflet](https://leafletjs.com/) and © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Map tiles are loaded from the standard OpenStreetMap tile service.

---

<div align="center">

**Made with care in Addis Ababa, Ethiopia.**

</div>
