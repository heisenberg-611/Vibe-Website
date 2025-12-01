# ROBUSPHERE - Prompt Engineering Competition

Welcome to the official repository for the **ROBUSPHERE** website. This project serves as the platform for the "Prompt Engineering Competition 2025" organized by ROBU (Robotics Club of BRAC University).

## 🚀 Project Overview

ROBUSPHERE is a modern, responsive web application designed to showcase the competition details, rules, timeline, and allow participants to register and log in. It features a premium "Apple-style" aesthetic with parallax effects, glassmorphism, and smooth animations.

## ✨ Features

-   ** immersive UI/UX**:
    -   Parallax scrolling effects.
    -   Glassmorphism design elements.
    -   Responsive layout for mobile and desktop.
    -   Interactive timeline and award sections.
-   **User Authentication**:
    -   User registration and login using JWT (JSON Web Tokens).
    -   Protected profile routes.
-   **Admin Dashboard**:
    -   View all registered users.
    -   Add new users manually.
    -   Delete users.
-   **Dynamic Content**:
    -   Real-time viewer count (demo).
    -   Searchable and sortable event timeline.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (No frameworks used for the UI).
-   **Backend**: Node.js, Express.js.
-   **Security**: `helmet`, `cors`, `jsonwebtoken`.
-   **Utilities**: `body-parser`, `nodemon` (for dev).

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd robusphere-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Usage

1.  **Start the server:**
    ```bash
    npm start
    ```
    Or for development with auto-restart:
    ```bash
    npm run dev
    ```

2.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

## 📡 API Endpoints

The backend provides the following RESTful API endpoints:

### Public
-   `GET /api/viewers`: Get current viewer count.
-   `POST /api/viewers`: Increment viewer count.
-   `POST /api/register`: Register a new user.
-   `POST /api/login`: Authenticate user and get token.
-   `GET /api/timeline`: Get timeline events (supports `?search=` and `?sort=`).

### Protected (Requires Bearer Token)
-   `GET /api/profile`: Get current user profile.
-   `GET /api/users`: Get list of all users (Admin only).
-   `POST /api/users`: Add a new user (Admin only).
-   `DELETE /api/users/:username`: Delete a user (Admin only).

## 📂 Project Structure

```
├── index.html          # Main landing page
├── style.css           # Global styles and animations
├── script.js           # Frontend logic (UI, API calls)
├── server.js           # Backend server and API logic
├── admin.html          # Admin dashboard interface
├── profile.html        # User profile interface
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
