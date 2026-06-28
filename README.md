# TaskFlow ⚡

TaskFlow is a premium, minimalist MERN-stack Task Tracker Web Application designed for efficient task tracking and CRUD operations. It features a clean dashboard design with real-time state synchronization, robust validations, and micro-animations.

---

## 🚀 Key Features

* **Full CRUD Operations**: Create, view, update, and delete tasks instantly.
* **MVC Backend Architecture**: Modularized Node.js & Express APIs with clean controllers, models, and routes.
* **TanStack Query (React Query)**: Seamless client-state management and real-time interface sync after actions.
* **Double-Layer Validation**: Strict form checks on the React frontend and Node.js backend using **Zod**.
* **Premium UX/UI**: Styled with Tailwind CSS, utilizing curated slate/brand colors, custom scrollbars, and high-performance glassmorphism panels.
* **Toasts**: Interactive status notifications via `react-hot-toast` for successes/errors.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React.js (via Vite)
* **Styling**: Tailwind CSS, PostCSS, Autoprefixer
* **State & Querying**: TanStack Query (React Query) & Axios
* **Validation**: Zod
* **Notifications**: react-hot-toast
* **Icons**: Lucide React

### Backend & Database
* **Server Framework**: Node.js & Express.js
* **Database**: MongoDB & Mongoose ODM
* **Validation**: Zod
* **Security & Utility**: CORS, dotenv

---

## 📂 Project Directory Structure

```text
TaskFlow/
│
├── backend/                   # Node.js MVC Server Component
│   ├── config/
│   │   └── db.js              # Database Connection configuration
│   ├── controllers/
│   │   └── task.controller.js # Business Logic & Zod Validations
│   ├── models/
│   │   └── task.model.js      # Mongoose Schema definition
│   ├── routes/
│   │   └── task.routes.js     # API Route configurations
│   ├── .env                   # Local settings / connection strings
│   ├── package.json           # Backend node requirements
│   └── server.js              # Application bootstrapper
│
└── frontend/                  # React Client Component
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.jsx   # Individual task preview component
    │   │   └── TaskForm.jsx   # Dynamic create/edit task modal
    │   ├── api.js             # API connection handlers
    │   ├── App.jsx            # Core dashboard layout
    │   ├── index.css          # Styling layers & Custom styles
    │   └── main.jsx           # App entry & Providers initialization
    ├── index.html             # HTML Shell & Head imports
    ├── postcss.config.js      # PostCSS specifications
    ├── tailwind.config.js     # Custom design system configurations
    └── package.json           # Frontend node requirements
```

---

## ⚙️ Setup & Installation Instructions

Ensure you have **Node.js** (v16+) and **MongoDB** installed on your system.

### 1. Database Setup
Make sure MongoDB is running locally on your system:
```bash
# Default standard local string
mongodb://127.0.0.1:27017/taskflow
```
Or you can use a MongoDB Atlas Connection string in step 2.

### 2. Configure Backend Server
Open the `backend/` directory and configure the environment variables:
1. Create a `.env` file inside `backend/` (already pre-created for you).
2. Enter the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   ```

Install packages and boot up the backend:
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000` in development mode.

### 3. Configure Frontend Client
Install packages and boot up the React application:
```bash
cd ../frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 📡 Backend API Reference

All requests and responses use JSON.

| Method | Endpoint | Description | Request Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Get all tasks | *None* |
| **POST** | `/api/tasks` | Create a task | `{ title: string, description: string, status?: string }` |
| **PUT** | `/api/tasks/:id` | Update a task | `{ title?: string, description?: string, status?: string }` |
| **DELETE** | `/api/tasks/:id` | Delete a task | *None* |

---

## 🔒 Form Validations

Validations are enforced on both the client (prior to submit) and server side using the following **Zod Schema**:

* **Title**:
  * Required string (trimmed).
  * Minimum: 1 character.
  * Maximum: 100 characters.
* **Description**:
  * Required string (trimmed).
  * Minimum: 1 character.
  * Maximum: 1000 characters.
* **Status**:
  * Must match one of: `['Pending', 'In Progress', 'Completed']`.
  * Default: `Pending`.
