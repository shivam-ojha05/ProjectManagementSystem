# 🚀 Project Management System

A full-stack **Project Management System** built using the MERN stack. This application helps users organize projects, manage tasks, collaborate with team members, and track project progress through a modern dashboard.

🔗 **GitHub Repository:** [ProjectManagementSystem](https://github.com/shivam-ojha05/ProjectManagementSystem)


## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* Email verification
* JWT-based authentication
* Access and refresh token handling
* Password hashing using bcrypt
* Password change and reset functionality
* Protected routes and role-based access control

### 📁 Project Management

* Create and manage projects
* Update project details
* Add and manage project members
* View project information
* Organize team activities

### ✅ Task Management

* Create and manage tasks
* Assign tasks to team members
* Track task progress and status
* Organize tasks by project

### 🎨 User Interface

* Modern project dashboard
* Sidebar navigation
* Project and task overview
* Login and registration pages
* Purple-themed user interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt
* Nodemailer
* Mailgen

### Development Tools

* Git and GitHub
* Visual Studio Code
* Postman
* Nodemon

---

## 📂 Project Structure

```text
ProjectManagementSystem/
│
├── Backend_PM/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
├── Frontend_PM/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── screenshots/
│   ├── dashboard.png
│   ├── login.png
│   └── register.png
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm (included with Node.js)
* [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
* [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/shivam-ojha05/ProjectManagementSystem.git
```

Navigate to the project directory:

```bash
cd ProjectManagementSystem
```

### 2. Backend Setup

Open a terminal and run:

```bash
cd Backend_PM
npm install
```

Create a `.env` file inside the `Backend_PM` directory and configure the environment variables required by the backend.

Example configuration:

```env
PORT=8000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

# Email Configuration
MAILTRAP_SMTP_HOST=your_mailtrap_host
MAILTRAP_SMTP_PORT=your_mailtrap_port
MAILTRAP_SMTP_USER=your_mailtrap_username
MAILTRAP_SMTP_PASS=your_mailtrap_password
```

**Important:** These are example variable names. Check your backend configuration and use the exact variable names expected by your code. Never use the example values as real credentials.

Start the backend server:

```bash
npm run dev
```

The backend is configured to run at:

```text
http://localhost:8000
```

### 3. Frontend Setup

Open a second terminal from the project root:

```bash
cd Frontend_PM
npm install
```

Configure the frontend API URL using the environment variable expected by your frontend code, if required.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables and Security

For security reasons:

* Never commit `.env` files to GitHub.
* Never expose MongoDB credentials or JWT secrets.
* Keep email service credentials private.
* Configure environment variables separately for development and production.
* If a secret has already been committed, rotate it and remove it from the repository history as appropriate.

---

## 🧪 API Testing

Use [Postman](https://www.postman.com/) to test the backend REST APIs.

A typical application workflow is:

```text
Register
   ↓
Verify Email
   ↓
Login
   ↓
Access Protected Routes
   ↓
Create a Project
   ↓
Manage Team Members
   ↓
Create and Assign Tasks
   ↓
Track Progress
```

The available endpoints and required request data depend on the backend implementation.

---

## 🔮 Future Improvements

* Real-time notifications
* Team chat and task comments
* File attachments
* Advanced project analytics
* Activity history
* Drag-and-drop task management
* Improved mobile responsiveness
* Production deployment

---

## 🎯 Learning Objectives

This project demonstrates practical experience with:

* Full-stack web development using the MERN stack
* REST API development
* Authentication and authorization
* MongoDB database design and Mongoose
* React frontend development
* Frontend and backend integration
* API testing with Postman
* Version control using Git and GitHub

---

## 👨‍💻 Author

**Shivam Ojha**

B.Tech Computer Science and Engineering Student

**Technologies:** JavaScript · React.js · Node.js · Express.js · MongoDB · Mongoose · Java · Python

* GitHub: [shivam-ojha05](https://github.com/shivam-ojha05)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Thank you for checking out my project!
