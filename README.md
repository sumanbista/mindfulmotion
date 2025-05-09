# Mindful Motion

## Overview
Mindful Motion is a web application designed to promote mental health and wellness through features like meditation sessions, community engagement, personalized assessments, and AI-driven chat. The project is divided into a **frontend** (React-based) and a **backend** (Node.js with Express and MongoDB).

---

## Project Structure

### 1. **Frontend**
The frontend is built with React and Vite for a fast and modern development experience.

#### Key Directories:
- **`src/components/`**: Contains reusable UI components like `SessionCard`, `PostCard`, and `ChatInput`.
- **`src/pages/`**: Defines the main pages of the application, such as `Community`, `Meditation`, and `AIChatPage`.
- **`src/contexts/`**: Includes context providers like `ToastContext` for global state management.

#### Pages:
- **`Home.jsx`**: The landing page with links to key features like meditation, community, and progress tracking.
- **`Community.jsx`**: A page for users to interact with community posts, including creating, commenting, and liking posts.
- **`Meditation.jsx`**: Displays a list of meditation sessions with filtering and rating options.
- **`AIChatPage.jsx`**: Provides an AI-driven chat interface for users to interact with.
- **`Setting.jsx`**: Allows users to update their profile and account settings.
- **`Login.jsx` and `Signup.jsx`**: Authentication pages for user login and registration.

---

### 2. **Backend**
The backend is built with Node.js and Express, using MongoDB for data storage.

#### Key Directories:
- **`models/`**: Defines Mongoose schemas for database entities like `User`, `Post`, and `Session`.
- **`routes/`**: Contains API routes for handling requests related to assessments, community posts, and sessions.
- **`middleware/`**: Includes middleware like `authMiddleware.js` for authentication and authorization.

---

## API Endpoints

### User Management
- **`POST /api/users/login`**: Logs in a user and returns a JWT token.
- **`GET /api/users/profile`**: Retrieves the profile of the authenticated user.

### Community
- **`GET /api/community`**: Fetches all community posts.
- **`POST /api/community`**: Creates a new community post.
- **`POST /api/community/:postId/comments`**: Adds a comment to a specific post.
- **`PUT /api/community/:postId/love`**: Toggles a "love" reaction on a post.

### Meditation Sessions
- **`GET /api/sessions`**: Retrieves all meditation sessions.
- **`POST /api/sessions`**: Creates a new meditation session (admin-only).
- **`GET /api/sessions/:sessionId/ratings`**: Fetches the average rating for a session.

### Assessments
- **`POST /api/assessment/analyze`**: Analyzes user assessment data using AI.
- **`GET /api/assessment/:userId`**: Retrieves past assessments for a specific user.

### AI Chat
- **`GET /api/aichat/sessions`**: Lists all chat sessions for the authenticated user.
- **`POST /api/aichat/sessions`**: Creates a new chat session.
- **`GET /api/aichat/history/:sessionId`**: Retrieves the chat history for a specific session.
- **`POST /api/aichat/send`**: Sends a message to the AI and retrieves a response.

### Quotes
- **`GET /api/quote`**: Fetches a random motivational quote.

---

## Features

### 1. **Meditation Sessions**
- Users can browse and play guided meditation sessions.
- Sessions are categorized by focus areas like relaxation, mindfulness, and sleep.
- Users can rate sessions and view average ratings.

### 2. **Community Engagement**
- Users can create posts, comment, and like posts in the community section.
- A leaderboard highlights top contributors based on posts, comments, and likes.

### 3. **Personalized Assessments**
- Users can complete assessments to evaluate their mental health and wellness.
- The backend provides AI-driven analysis and recommendations based on user responses.

### 4. **AI Chat**
- Users can interact with an AI chatbot for mental health support and guidance.
- Chat sessions are saved, and users can revisit past conversations.

### 5. **User Management**
- Users can sign up, log in, and update their profiles.
- Authentication is handled using JWT tokens.

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MindfulMo/mindful-motion.git
   cd mindful-motion
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory with the following:
     ```
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     GROQCLOUD_API_KEY=<your-groqcloud-api-key>
     ```

4. Start the development servers:
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

---

## Contribution Guidelines
1. Fork the repository and create a new branch for your feature or bug fix.
2. Follow the existing code style and structure.
3. Submit a pull request with a clear description of your changes.