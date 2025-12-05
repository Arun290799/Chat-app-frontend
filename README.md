# Chat App

A modern, real-time chat application built with Next.js, TypeScript, and Socket.io. Features user authentication, real-time messaging, online status indicators, typing indicators, and a beautiful UI.

## Features

- 🔐 **User Authentication** - Secure login and registration system
- 💬 **Real-time Messaging** - Instant message delivery using Socket.io
- 👥 **User Management** - View all users with online/offline status
- 🔍 **Search Functionality** - Search users by name or email
- ⌨️ **Typing Indicators** - See when someone is typing
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🔒 **Protected Routes** - Secure access to chat features
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time Communication**: Socket.io Client
- **Authentication**: Cookie-based authentication
- **State Management**: React Context API

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- A backend API server running (see Backend Configuration)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your backend API URL.

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:
```bash
npm start
# or
yarn start
# or
pnpm start
```

## Backend Configuration

This application requires a backend API server. The frontend communicates with the backend through:

1. **API Proxy Route** (`/api/proxy`) - Proxies requests to the backend API
2. **Socket.io Connection** - Direct WebSocket connection for real-time features


## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend API server URL | `http://localhost:5000` |


## Troubleshooting

### Socket Connection Issues

If you're experiencing socket connection problems:

1. Verify `NEXT_PUBLIC_BACKEND_API_URL` is correctly set in `.env.local`
2. Ensure the backend server is running
3. Check browser console for connection errors
4. Verify CORS settings on the backend

### Authentication Issues

If authentication isn't working:

1. Check that cookies are enabled in your browser
2. Verify the backend API is responding correctly
3. Check the browser's Network tab for API errors
4. Ensure the proxy route is correctly forwarding requests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.
