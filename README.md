# 📝 NoteSpace — Modern Flask Notes Application

**NoteSpace** (Note-apk) is a modern, lightweight, full-stack web application for creating, managing, and searching personal notes securely. Built with **Python Flask**, **SQLite**, and **Flask-SQLAlchemy**, it features a sleek **Glassmorphic SaaS Frontend** with dark-mode radial gradients, micro-animations, real-time live search, interactive toast notifications, and Docker container support.

---

## ✨ Features

- 🔐 **Authentication & Session Handling**: Secure signup, login, and session-based logout flow.
- 🎨 **Glassmorphism SaaS Design System**: Modern dark theme backdrop (`#090d16`), indigo/cyan accents, frosted glass panels (`backdrop-filter: blur`), and clean typography.
- 📝 **Notes Workspace**:
  - Create notes with a real-time character limit gauge (`0 / 200`).
  - Copy note text to clipboard with instant toast notifications.
  - Delete notes with a glassmorphic confirmation modal dialog to prevent accidental deletion.
- 🔍 **Live Search & Filtering**: Instant client-side text filtering across all saved notes.
- 🔔 **Interactive Toast Engine**: Renders Flask flash alerts as floating, auto-dismissing toast notifications (`success`, `error`, `info`, `warning`).
- 📱 **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop screens.
- 🚨 **Custom Error Pages**: Modern glassmorphic 404 Not Found and 500 Internal Server Error pages.
- 🐳 **Docker Ready**: Pre-configured with `Dockerfile` and `docker-compose.yml` for effortless containerized deployment.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Python 3.12, Flask 3.x, Werkzeug, Jinja2 |
| **Database** | SQLite 3 via Flask-SQLAlchemy |
| **Frontend Styling** | Vanilla CSS3 (Glassmorphism System), Google Fonts (*Plus Jakarta Sans*) |
| **Frontend Interactivity** | ES6 JavaScript, Lucide Icon Library |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Folder & File Structure

```text
Note-apk/
├── app/
│   ├── routes/
│   │   ├── auth.py          # Authentication blueprint (/signup, /login, /logout, /)
│   │   └── notes.py         # Notes management blueprint (/notes, /delete/<id>)
│   ├── static/
│   │   ├── main.js          # Client-side JS engine (toasts, live search, modals, clipboard)
│   │   └── style.css        # Glassmorphic SaaS design system stylesheet
│   ├── templates/
│   │   ├── 404.html         # Custom 404 Page Not Found view
│   │   ├── 500.html         # Custom 500 Internal Server Error view
│   │   ├── base.html        # Layout template with navbar, flash toasts, delete modal, footer
│   │   ├── login.html       # Sign-in page
│   │   ├── notes.html       # Dashboard workspace page
│   │   └── signup.html      # Account registration page
│   ├── __init__.py          # App factory, database init, blueprint & error handler setup
│   └── models.py            # SQLAlchemy database models (User, Note)
├── instance/                # SQLite database directory (notes.db)
├── docker-compose.yml       # Docker Compose service configuration
├── Dockerfile               # Docker container specification
├── form.py                  # Legacy / standalone form module
├── requirements.txt         # Python package dependencies
├── run.py                   # Application entry point script
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Option 1: Running Locally with Python Virtual Environment

#### Prerequisites
- Python 3.10+ installed
- `pip` package manager

#### Setup Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Note-apk
   ```

2. **Create and Activate Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   python run.py
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:5000`.

---

### Option 2: Running with Docker Compose 🐳

#### Prerequisites
- Docker & Docker Compose installed

#### Launch Application

```bash
docker compose up --build
```

Access the application in your browser at `http://localhost:5000`.

#### Stop Application

```bash
docker compose down
```

---

## 🔌 API Routes Summary

| Endpoint | HTTP Method | Blueprint | Description |
| :--- | :--- | :--- | :--- |
| `/` or `/home` | `GET` | `auth` | Redirects to `/notes` if authenticated, else `/login`. |
| `/signup` | `GET`, `POST` | `auth` | Account creation page and processing. |
| `/login` | `GET`, `POST` | `auth` | User login authentication. |
| `/logout` | `GET` | `auth` | Destroys active user session. |
| `/notes` | `GET`, `POST` | `notes` | Workspace dashboard & note creation. |
| `/delete/<note_id>` | `POST` | `notes` | Deletes a note belonging to the logged-in user. |

---

## 🛡️ Database Schema

### `User` Model
- `id` (Integer, Primary Key)
- `username` (String 150, Unique, Required)
- `password` (String 150, Required)
- `notes` (Relationship to `Note`)

### `Note` Model
- `id` (Integer, Primary Key)
- `content` (String 200, Required)
- `user_id` (Integer, Foreign Key `user.id`)
