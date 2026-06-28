# TaskFlow ⚡

### 🌐 Live Deployments
* **Frontend (Vercel)**: [https://task-flow-vert-phi-57.vercel.app/](https://task-flow-vert-phi-57.vercel.app/)
* **Backend API (Render)**: [https://taskflow-3692.onrender.com/](https://taskflow-3692.onrender.com/)

---

TaskFlow is a premium, minimalist MERN-stack Task Tracker Web Application designed for efficient workflow management. The system is built with a decoupled React frontend and a modular Node/Express backend following the MVC architectural pattern. It features real-time state synchronization, robust double-layer validation guards, profile settings customization, and theme-adaptive glassmorphic designs.

---

## 🚀 Key Features

* **Full CRUD Operations**: Create, view, update, and delete tasks with instant client-side feedback.
* **MVC Backend Architecture**: Decoupled Express APIs with clean controllers, models, and routes mapping business logic.
* **Double-Layer Zod Validation**: Strict schema verification on both the React frontend form layer and the Express backend controller layer.
* **TanStack Query (React Query)**: Modern client-state caching, automatic background refetching, and real-time state synchronization after mutations.
* **Responsive Light & Dark Mode Toggle**: Aesthetic design system supporting deep navy midnight canvas (`#060813`) in dark mode and smooth transition curves. Toggles are persistent via `localStorage` caches.
* **Mock User Database Gates**: Profile access control featuring a custom landing sign-in/sign-up module. Ensures password mismatch checking and duplicate registration prevention.
* **Account Settings customizer**: Open-drawer dashboard controls supporting Adventure-themed avatar selection grids, name/email caching, and dashboard safety clear-downs.
* **Interactive Toast Alerts**: Notifications powered by `react-hot-toast` indicating api mutation successes or failure reasons.

---

## 🛠️ Tech Stack & Key Libraries

### Frontend
* **Core Framework**: React.js (Bootstrapped via Vite)
* **Client Caching & Fetching**: `@tanstack/react-query` & `axios`
* **Styling**: Tailwind CSS & PostCSS
* **Validation**: Zod (Client Form Parsing)
* **Visual Icons**: Lucide React
* **Alert Notifications**: react-hot-toast

### Backend & Database
* **Server Framework**: Node.js & Express.js
* **Database ODM**: MongoDB & Mongoose
* **API Validation**: Zod (Payload Schema Parsing)
* **Security & Utility**: CORS, Dotenv

---

## 📂 Project Directory Structure

```text
TaskFlow/
│
├── backend/                         # Node.js MVC Server
│   ├── config/
│   │   └── db.js                    # Mongoose Database Connector
│   ├── controllers/
│   │   └── task.controller.js       # CRUD logic & Backend Zod Schema
│   ├── models/
│   │   └── task.model.js            # Mongoose Schema Definitions
│   ├── routes/
│   │   └── task.routes.js           # API Endpoint Mapping
│   ├── .env                         # Server Environment Settings
│   ├── package.json                 # Backend Node Requirements
│   └── server.js                    # Server Bootstrapper
│
└── frontend/                        # React Client Application
    ├── src/
    │   ├── components/
    │   │   ├── Auth.jsx             # Sign In / Sign Up Landing Page
    │   │   ├── SettingsModal.jsx    # Avatar Selection & Reset Actions
    │   │   ├── TaskCard.jsx         # Status-adaptive task card
    │   │   └── TaskForm.jsx         # CRUD Create & Edit modal form
    │   ├── api.js                   # Axios HTTP requests client
    │   ├── App.jsx                  # Main Dashboard & Theme Controllers
    │   ├── index.css                # Base directives & custom webkit styles
    │   └── main.jsx                 # App Bootstrapper & Providers
    ├── index.html                   # HTML template & Font declarations
    ├── tailwind.config.js           # Tailwind Theme Configurations
    └── package.json                 # Frontend Node Requirements
```

---

## ⚙️ Setup & Installation Instructions

Ensure you have [Node.js](https://nodejs.org/) (v16.0.0 or higher) and [MongoDB](https://www.mongodb.com/) active on your host system.

### 1. Database Setup
Ensure that MongoDB is running locally on your computer. The default connection string is:
```bash
mongodb://127.0.0.1:27017/taskflow
```

### 2. Configure Backend Server
1. Navigate to the [backend](file:///c:/Users/Navni%20Mahendroo/Desktop/PROJECTS/TaskFlow/backend) folder:
   ```bash
   cd backend
   ```
2. Verify or update variables in the [.env](file:///c:/Users/Navni%20Mahendroo/Desktop/PROJECTS/TaskFlow/backend/.env) file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   ```
3. Install dependencies and start the local development server:
   ```bash
   npm install
   npm run dev
   ```
   The backend server starts running at `http://localhost:5000`.

### 3. Configure Frontend Client
1. Navigate to the [frontend](file:///c:/Users/Navni%20Mahendroo/Desktop/PROJECTS/TaskFlow/frontend) folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies and launch the Vite development server:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 📡 API Reference & Payload Specifications

The backend server exposes clean JSON endpoints for task CRUD operations.

| Method | Endpoint | Description | Request Body Parameters | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch all tasks | *None* | `200 OK` |
| **POST** | `/api/tasks` | Add a new task | `{ title, description, status? }` | `201 Created` |
| **PUT** | `/api/tasks/:id` | Update an existing task | `{ title?, description?, status? }` | `200 OK` |
| **DELETE** | `/api/tasks/:id` | Remove a task | *None* | `200 OK` |

### Error Payload Models

If validation checks fail, the Express server responds with a `400 Bad Request` code and a list of Zod-generated validation errors:
```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

## 🔒 Form Validation Schemas

Zod constraints are mirrored on the React frontend form schemas and the Express controllers:

* **Task Title**:
  * Required string (trimmed).
  * Minimum: 1 character.
  * Maximum: 100 characters.
* **Task Description**:
  * Required string (trimmed).
  * Minimum: 1 character.
  * Maximum: 1000 characters.
* **Task Status**:
  * Must match one of: `['Pending', 'In Progress', 'Completed']`.
  * Default: `Pending`.

---

## 🔑 Authentication & Settings Customization

To simulate authentication on the client side without database migrations:
1. **Mock Database (`registered_users`)**: Caches custom user records inside `localStorage`.
2. **Access Gates**: The dashboard is gated behind the [Auth.jsx](file:///c:/Users/Navni%20Mahendroo/Desktop/PROJECTS/TaskFlow/frontend/src/components/Auth.jsx) landing page.
3. **Pre-Seeded Account**: An assessment-ready credentials seed is automatically registered on component mount:
   * **Email**: `abc@gmail.com`
   * **Password**: `123`
4. **Settings Drawer ([SettingsModal.jsx](file:///c:/Users/Navni%20Mahendroo/Desktop/PROJECTS/TaskFlow/frontend/src/components/SettingsModal.jsx))**:
   * **Avatar Customizer**: Select from a range of adventure character avatar styles.
   * **Dashboard Wipe (Danger Zone)**: Triggers bulk deletions on the database backend via a multi-query cascade.
   * **Session Logout**: Clears session states and returns back to the empty landing page.
