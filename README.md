# Tododish

A simple task management application built to help users manage and organize their daily tasks.

## Built With

- React.js
- Ionic & Capacitor
- Python (FastAPI)
- PostgreSQL
- SQLAlchemy

## Features

- User authentication (Register & Login)
- Create, edit, and delete tasks
- Update task status
- Search and filter tasks
- View task schedules and progress

## Getting Started

### Requirements

- Python
- Node.js & npm
- PostgreSQL

### Backend

1. Clone the repository.

```bash
git clone https://github.com/AnnisaAulia12/TaskTracker.git
cd TaskTracker
```

2. Go to the backend folder.

```bash
cd backend
```

3. Create and activate a virtual environment.

```bash
python -m venv .venv
.venv\Scripts\activate
```

4. Install dependencies.

```bash
pip install -r requirements.txt
```

5. Create a PostgreSQL database named `task_tracker`.

6. Copy `.env.example` to `.env` and update the database credentials.

7. Run the backend.

```bash
python -m uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

API documentation: `http://127.0.0.1:8000/docs`.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

### Android

To run the Android application:

```bash
npm run build
npx cap sync android
npx cap open android
```

Open the project in Android Studio and run it using an emulator.

For Android Emulator, the backend URL is `http://10.0.2.2:8000`.

