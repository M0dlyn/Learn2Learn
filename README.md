# Learn to Learn (L2L)


Learn to Learn (L2L) is a smart study assistant that helps users optimize their learning process through structured note-taking, proven study techniques, and AI-driven quizzes. The app allows users to save, organize, and tag notes for easy retrieval, while built-in tools like a Pomodoro timer and guided technique explanations (e.g., Active Recall, Spaced Repetition) help apply research-backed methods effectively. After each session, an AI-powered quiz generator analyzes the user’s notes and produces customized tests to reinforce retention.

Built with a React + TypeScript frontend (styled with Tailwind CSS) and a Laravel (PHP) backend, L2L uses PostgreSQL for reliable data storage and is fully Dockerized for seamless deployment. Continuous integration (CI/CD) ensures smooth updates, making the app both scalable and maintainable.

<p align="center">
  <img src="https://img.shields.io/badge/-TECH%20STACK-%23007ACC?style=for-the-badge&logo=appveyor&logoColor=white" alt="L2L Tech Stack">
  <br>
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker">
</p>

## ✅ How to run
`composer install`
`npm install`
`npm run build`
`php artisan serve`

## 🚀 Features

### 📝 **Note Management**
- Securely save, organize, and retrieve study notes.
- Tag and categorize notes for quick access.

### ⏱️ **Study Technique Tools**
- **Technique Guides**: Concise explanations for popular methods (e.g., Spaced Repetition, Active Recall).
- **Method Practice Tools**: Interactive exercises to help users **apply** each technique effectively.

### 🤖 **AI-Powered Assessments**
- End-of-session quizzes generated from your notes using AI.
- Adaptive testing to reinforce key concepts.
- Note quality assessment.

## 🛠️ Technologies

### 💻 Frontend
- **React** (TypeScript) + **Tailwind CSS**
- Responsive UI components

### ⚙️ Backend
- **Laravel** (PHP) REST API
- User authentication
- AI integration (test generation)

### 📁 Database
- **PostgreSQL**: Relational data storage for:
  - User profiles
  - Study notes
  - Session history

### 🐳 DevOps
- **Docker** containerization
- CI/CD pipeline (automated testing/deployment)
