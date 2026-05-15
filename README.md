# Talkiffy

Talkiffy is a full-stack real-time chat application built with the MERN stack. It includes private conversations, group chats, real-time messaging, image sharing, user authentication, avatar uploads, message reactions, and modern UI interactions.

This project was built as a portfolio application to demonstrate practical full-stack development skills, including REST API design, real-time communication with Socket.IO, MongoDB data modeling, image upload handling, optimistic UI updates, and modern React architecture.

---

## Features

### Authentication

- User signup and login
- JWT-based authentication
- Protected backend routes
- Cookie-based authentication support

### Real-Time Chat

- Private one-to-one conversations
- Group conversations
- Real-time message updates with Socket.IO
- Online user tracking
- Message delivery status
- Seen/read state tracking
- Optimistic message sending

### Group Chat Management

- Create group conversations
- Add and remove group members
- Add and remove group admins
- Leave group conversations
- Update group name
- Update group avatar

### Messages

- Send text messages
- Send image messages
- Reply to messages
- React to messages with emojis
- Search messages
- View shared images
- Scroll to replied or searched messages

### Media Uploads

- User avatar upload
- Group avatar upload
- Message image upload
- Image optimization with Sharp
- Cloudinary integration for media storage

### User Interface

- Clean chat layout
- Sidebar conversation list
- Conversation info panel
- Account/profile sheet
- Loading states and empty states
- Theme settings
- Notification settings
- Toast notifications

---

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
PASSWORD=your_database_password
PORT=5001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_COOKIE_EXPIRES_IN=7
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development

# folder structure

TALKIFFY/
├── backend/
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── userController.js
│ │ ├── conversationController.js
│ │ └── messageController.js
│ │
│ ├── routes/
│ │ ├── userRoutes.js
│ │ ├── conversationRoutes.js
│ │ └── messageRoutes.js
│ │
│ ├── models/
│ │ ├── userModel.js
│ │ ├── conversationModel.js
│ │ └── messageModel.js
│ │
│ ├── lib/
│ │ ├── middleware/
│ │ │ ├── upload.js
│ │ │ ├── OptimizeImage.js
│ │ │ └── error.middleware.js
│ │ │
│ │ ├── utils/
│ │ │ └── socketNotifications.js
│ │ │
│ │ ├── socket.js
│ │ ├── cloudinary.js
│ │ ├── cloudinaryUpload.js
│ │ ├── catchAsync.js
│ │ ├── AppError.js
│ │ └── utils.js
│ │
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── frontend/
│ ├── public/
│ │ └── logo.png
│ │
│ ├── src/
│ │ ├── components/
│ │ │ ├── account/
│ │ │ ├── buttons/
│ │ │ ├── chat/
│ │ │ ├── contacts/
│ │ │ ├── conversation/
│ │ │ ├── group/
│ │ │ ├── message/
│ │ │ ├── profile/
│ │ │ ├── settings/
│ │ │ ├── sidebar/
│ │ │ └── ui/
│ │ │
│ │ ├── contexts/
│ │ │ ├── ContactContext.jsx
│ │ │ ├── ConversationContext.jsx
│ │ │ ├── MessagesContext.jsx
│ │ │ ├── MessageScrollContext.jsx
│ │ │ ├── SettingContext.jsx
│ │ │ ├── SheetModalProvider.jsx
│ │ │ └── SocketContext.jsx
│ │ │
│ │ ├── hooks/
│ │ │ ├── auth/
│ │ │ ├── contacts/
│ │ │ ├── conversation/
│ │ │ ├── group/
│ │ │ ├── messages/
│ │ │ ├── socket/
│ │ │ └── user/
│ │ │
│ │ ├── lib/
│ │ │ ├── utils/
│ │ │ │ ├── contact.js
│ │ │ │ ├── conversation.js
│ │ │ │ └── messages.js
│ │ │ ├── axios.js
│ │ │ ├── errorHandler.js
│ │ │ ├── reactQuery.jsx
│ │ │ └── utils.js
│ │ │
│ │ ├── constants/
│ │ │ └── themes.js
│ │ │
│ │ ├── pages/
│ │ │ ├── HomePage.jsx
│ │ │ ├── LoginPage.jsx
│ │ │ └── SignupPage.jsx
│ │ │
│ │ ├── sounds/
│ │ │
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ │
│ ├── package.json
│ ├── vite.config.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── eslint.config.js
│ └── .env.example
│
├── README.md
└── .gitignore

### NOTES

Make sure MongoDB is running locally or use a cloud database like MongoDB Atlas.
Vite's hot module replacement (HMR) works well for a smooth development experience on the frontend.
You can extend the app by adding more features like group chats, voice and video calls, adding more settings and optimizing UI/UX
