# 📓 OneDesk — The Unified Life & Work Notebook

<div align="center">

![OneDesk Version](https://img.shields.io/badge/version-v3.10.26-6366f1?style=for-the-badge)
![Build](https://img.shields.io/badge/build-%23OD3.10--1-amber?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Sync-ffca28?style=for-the-badge&logo=firebase)

**One quiet, personal workspace for everything you think, plan & create.**

[Features](#-key-features) • [Design System](#-notebook-design-system) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Keyboard Shortcuts](#-keyboard-shortcuts)

---

</div>

## 📖 Overview

**OneDesk (v3.0)** is an all-in-one personal operating system designed to eliminate context switching between fragmented productivity apps. Built with an editorial stationery and notebook design language, OneDesk unifies daily task execution, fluid markdown notes, hourly timeline scheduling, ambient sensory dynamics, and cloud data portability into a single cohesive workspace.

---

## ✨ Key Features

### 🌟 Editorial Landing Page & Stationery Canvas
- **Stationery Hero**: Interactive dual-page notebook canvas previewing real-time tasks, legal pad notes, and daily agenda timelines.
- **Interactive Demos**: Live interactive checklist with ink strike-throughs and auto-saving legal pad notes.
- **Smooth Navigation**: Instant transitions into authentication and workspace views.

### ⚡ Focus Dashboard & Workspace Intelligence
- **Time-Aware Typewriter Greeting**: Dynamic hero greeting adapting automatically throughout the day (`Good morning`, `Good afternoon`, `Good evening`).
- **Glanceable Intelligence**: Instant telemetry on your immediate Focus Task, Next Calendar Event, and Today's Completion Progress.
- **Real-Time Scratchpad**: Fast, frictionless scratchpad with automatic localStorage persistence and one-click *"Save as Note"* export.
- **Quick-Add Actions**: Add tasks and schedule events with inline priority selectors and frosted glass dialogs.

### 📅 Schedule & Planner (Calendar)
- **Hourly Timeline Planner**: 16-hour daily view (07:00–22:00) featuring a real-time glowing **`NOW`** time indicator line.
- **Chronological Agenda Stream**: Time-sorted feed grouping events into *Today*, *Tomorrow*, *Later This Week*, and *Upcoming Horizon*.
- **7-Day Week Horizon**: Clean weekly overview with single-click day event creation.
- **Panoramic 42-Day Month Matrix**: Full monthly calendar matrix with compact mobile indicators and detailed desktop event chips.
- **Unified Timeline**: Task deadlines automatically synchronize alongside calendar meetings and milestones.

### ✅ Tasks & Kanban Execution Board
- **Dual View Modes**: Switch seamlessly between compact List View and interactive Drag-and-Drop Kanban Board (`Todo`, `In Progress`, `Completed`).
- **Tactile Checkboxes**: Circular checkbox toggles with smooth animated ink strikethrough effects.
- **Smart Filtering & Sorting**: Filter by status, priority (`High`, `Medium`, `Low`), category, or search query; sort by due date, priority weight, or title.
- **Inline Quick Task Bar**: Capture tasks on the fly with responsive priority chips.

### 📝 Notes & Ideas Vault
- **Quick Note Expander**: Instant brainstorming box with category suggestion pills (`Personal`, `Work`, `Ideas`, `Study`, `Projects`, `Journal`).
- **Rich Markdown Formatting**: In-editor formatting toolbar for **Bold**, *Italic*, Bullet Lists, and Checklists.
- **Washi Tape Pinboard**: Pin high-priority notes with realistic colored washi tape strips.
- **Direct Export**: One-click `.txt` file export and clipboard copy.

### 🎮 Fun Zone Hub & Arcade
- **Teaser Portal**: Dedicated relaxation hub designed for quick mental breaks between deep work sessions.
- **Planned Features**: Daily quests, brain workout mini-games, streak rewards, and challenge leaderboards.

### 🎨 Themes & Ambient Sensory Engine
- **Handcrafted Themes**:
  - 📜 **Notebook Light**: Warm parchment paper, 28px ruled horizontal lines, vertical graph grid, red left margin, wire-O rings, brass corners, and handwriting typography.
  - 🌌 **Midnight**: Deep indigo fluid glassmorphism (default dark).
  - ☀️ **Daylight**: Clean stone light mode.
  - 🌲 **Aurora**: Emerald green forest aesthetic.
  - 🌊 **Ocean**: Deep sea cyan.
  - 🌹 **Rosé**: Warm blush & cream.
  - 🔥 **Ember**: Warm amber & gold.
  - 🔒 *Coming Soon*: Peacock, Lavender, Baby Pink, and Notebook Dark.
- **GhostFibers Ambient Canvas**: Real-time WebGL ambient wave background with customizable speed, glow, and theme-reactive fiber lighting.
- **Tactile Audio Chimes**: Gentle audio feedback for actions, successes, and warnings.

### 🔒 Security, Profile & Data Portability
- **Self-Service Credentials**: Change password directly in settings and recover accounts via secure email password reset.
- **Curated Avatar Gallery**: Select from curated Unsplash nature & automotive photography or upload custom photos with automatic in-browser canvas resizing.
- **Desktop Push Notifications**: Native browser deadline alerts notifying you of tasks due today.
- **JSON Backup Vault**: Full export and import of your notes, tasks, and calendar events.

---

## 🎨 Notebook Design System

OneDesk includes an authentic notebook stationery design system loaded via CSS custom properties and utility classes:

| Element | Class / Utility | Description |
| :--- | :--- | :--- |
| **Ruled Paper** | `.nb-page-bg`, `.nb-ruled` | Continuous 28px horizontal lines with vertical graph grid and dot matrix |
| **Red Margin** | `.nb-margin` | Vertical left margin rule adapting from 56px (desktop) to 24px (mobile) |
| **Wire Binder** | `.nb-wire-binder`, `.nb-wire-ring` | Spiral ring coils with metallic shine and drop shadows |
| **Bookmark Ribbon** | `.nb-ribbon-bookmark` | Silk bookmark ribbon with angled tail drape |
| **Brass Corners** | `.nb-brass-corner` | Metallic corner protectors on cards and modal dialogs |
| **Washi Tape** | `.nb-washi`, `.nb-washi-rose`, `.nb-washi-green` | Textured tape strips pinning notes and task cards |
| **Ink Stamps** | `.nb-stamp`, `.nb-stamp-done`, `.nb-stamp-high` | Monospace angled rubber ink stamps for status tags |
| **Dog-Ear Fold** | `.nb-dog-ear` | Subtle page corner fold with interactive hover expansion |
| **Handwriting Font** | `.nb-hand`, `font-handwriting` | Natural cursive typography powered by Google Fonts `Caveat` |

---

## 🛠️ Technology Stack

- **Core & Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling & Design**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) + Custom Glassmorphism & Notebook Design System
- **Routing**: [React Router v7](https://reactrouter.com/) (`react-router-dom`)
- **Backend & Realtime Sync**: [Firebase 12](https://firebase.google.com/) (Authentication & Firestore Cloud Sync) + LocalStorage Fallback
- **Ambient Graphics**: [OGL](https://github.com/oframe/ogl) (High-performance WebGL Canvas for GhostFibers)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans, Newsreader, JetBrains Mono, Caveat

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **pnpm** / **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RajRishabh15/OneDesk.git
   cd OneDesk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## ⌨️ Keyboard Shortcuts

OneDesk includes quick two-key navigation chords for fast workspace navigation:

| Key Chord | Destination / Action |
| :--- | :--- |
| `g` then `d` | Jump to **Dashboard** (`/`) |
| `g` then `t` | Jump to **Tasks Board** (`/tasks`) |
| `g` then `n` | Jump to **Notes & Ideas** (`/notes`) |
| `g` then `c` | Jump to **Schedule / Calendar** (`/calendar`) |
| `g` then `s` | Jump to **Settings** (`/settings`) |
| `Ctrl` + `K` or `⌘` + `K` | Open **Global Search** |
| `Escape` | Close modals and dropdown drawers |

---

## 📁 Project Structure

```
r:/lifeos/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components & modals
│   │   ├── AppLayout.jsx           # Main shell, background layers & shortcuts
│   │   ├── TopNavPill.jsx          # Top navigation pill & mobile dock
│   │   ├── Modal.jsx               # Notebook & glassmorphism dialog modal
│   │   ├── TaskCard.jsx            # Task card with washi tape & checkboxes
│   │   ├── NoteCard.jsx            # Pinned note card with markdown support
│   │   ├── GhostFibers.jsx         # WebGL fluid ambient background canvas
│   │   ├── NotebookAnnouncement.jsx# Notebook Light theme notification toast
│   │   ├── FunZoneAnnouncement.jsx # FunZone teaser announcement toast
│   │   └── CustomDatePicker.jsx    # Custom date/time picker primitives
│   ├── pages/              # Application views
│   │   ├── Landing.jsx             # Editorial stationery landing page
│   │   ├── Dashboard.jsx           # Focus dashboard & typewriter greeting
│   │   ├── Tasks.jsx               # Task checklist & drag-and-drop Kanban
│   │   ├── Calendar.jsx            # Planner, Agenda, Week, and Month views
│   │   ├── Notes.jsx               # Notes vault & markdown editor
│   │   ├── FunZone.jsx             # Relaxation gaming hub preview
│   │   ├── Appearance.jsx          # Theme gallery & sensory FX settings
│   │   ├── Settings.jsx            # Account, security & backup management
│   │   ├── Login.jsx               # Login & forgot password modal
│   │   └── Signup.jsx              # Account registration
│   ├── context/            # React state providers
│   │   ├── AuthContext.jsx         # Firebase auth & session handling
│   │   ├── ThemeContext.jsx        # Theme switching & custom CSS tokens
│   │   ├── DataContext.jsx         # Realtime data sync (tasks, notes, events)
│   │   └── SettingsContext.jsx     # Sensory FX, chimes & notifications
│   ├── utils/              # Storage helpers & mock data seeds
│   ├── index.css           # Core styling, animations & notebook tokens
│   ├── App.jsx             # Route definitions
│   └── main.jsx            # App root mounting
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

---

## 📄 License

This project is licensed under the MIT License — see the repository for full details.

<div align="center">
  <sub>Crafted with passion for calm, focused productivity · OneDesk v3.10.26</sub>
</div>
