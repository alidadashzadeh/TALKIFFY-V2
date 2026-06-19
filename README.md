# Talkiffy

Talkiffy is a full-stack real-time chat application built with the MERN stack. It includes private conversations, group chats, real-time messaging, image sharing, user authentication, avatar uploads, message reactions, and modern UI interactions.

This project was built as a portfolio application to demonstrate practical full-stack development skills, including REST API design, real-time communication with Socket.IO, MongoDB data modeling, image upload handling, optimistic UI updates, and modern React architecture.

---

## Technical Highlights

- Real-time messaging architecture using Socket.IO
- Optimistic UI updates with automatic cache reconciliation
- Modular Express backend with centralized error handling
- Image optimization pipeline using Sharp and Cloudinary
- TanStack Query caching and async state synchronization
- Scalable React architecture using Context API and custom hooks
- Multi-device real-time session synchronization

## Features

### Authentication & Security

- JWT-based authentication with HTTP-only cookies
- Protected API routes using custom authentication middleware
- Persistent login sessions across refreshes
- Secure password hashing and credential validation
- Centralized backend error handling architecture

### Real-Time Communication

- Real-time bidirectional communication using Socket.IO
- Optimistic UI message rendering before server confirmation
- Instant message synchronization across multiple connected devices
- Real-time online/offline presence tracking
- Live message delivery and seen/read state updates
- Event-driven socket notification architecture
- Automatic client-side state reconciliation after socket events

### Messaging Features

- Text and image-based messaging
- Message reply system with scroll-to-message behavior
- Emoji reaction system for messages
- Message search functionality within conversations
- Shared media viewing support
- Efficient message rendering and scroll management

### Conversation System

- Private one-to-one conversations
- Dynamic group conversation creation and management
- Group admin permission handling
- Add/remove group participants in real time
- Leave group functionality with live participant updates
- Real-time group metadata updates (name and avatar)

### Media Upload Pipeline

- Avatar uploads for users and groups
- Image message upload support
- Server-side image optimization using Sharp
- Cloudinary integration for cloud media storage
- Optimized image compression before upload

### Frontend Architecture

- Component-based React architecture
- Custom reusable React hooks for business logic separation
- TanStack Query for async server-state management and caching
- Context API architecture for global state management
- Modular folder structure for scalability and maintainability
- Axios-based API abstraction layer
- Optimized UI state synchronization with server updates

### User Experience & Interface

- Responsive modern chat interface
- Browser push notification support for real-time events
- Sidebar-based conversation navigation
- Conversation information panels and sheets
- Toast-based feedback and notification system
- Loading, skeleton, and empty state handling
- Theme and appearance customization
- Smooth animations with Framer Motion
- Optimistic interactions for reduced perceived latency

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Socket.IO Client
- Axios
- Sonner
- Framer-motion

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Multer
- Sharp
- Cloudinary

## Deployment

- Frontend deployed on Vercel: https://talkiffy.vercel.app/
- Backend deployed on Render
- Media storage handled with Cloudinary
- Database hosted on MongoDB Atlas

## Prerequisites

Before running this app, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (either running locally or using a cloud service like MongoDB Atlas)

## Project Setup

### 1. Clone the repository

Clone the repository to your local machine:

### 2. Set up the Backend (Express)

Navigate to the backend folder and install the necessary dependencies:

cd backend
npm install
npm run dev

need to install nodemon for development purposes

### 3. Set up the Frontend (React with Vite)

Navigate to the frontend folder and install the necessary dependencies:

cd frontend
npm install
npm run dev

### 4. Environment Variables

Create a .env file in the backend folder and set these variables:

MONGODB_URI=your_mongodb_connection_string
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_COOKIE_EXPIRES_IN=7
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development

### NOTES

Make sure MongoDB is running locally or use a cloud database like MongoDB Atlas.
Vite's hot module replacement (HMR) works well for a smooth development experience on the frontend.
You can further extend the app with features such as voice/video calls, message pagination, and advanced UI/UX improvements.

```

```
