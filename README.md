# BuddyTask

## Win More. Together.

BuddyTask empowers you to achieve your goals with the support of a friend.

## About

BuddyTask is a client-side React application built with Vite, TanStack Query, React Router, and PocketBase. The app helps users accomplish more by pairing them with accountability partners to track and manage tasks together.

## Features

- **Task Management**: Create and track your personal tasks
- **Partnership System**: Connect with an accountability partner
- **Task Visibility**: View your partner's tasks to stay in sync
- **User Authentication**: Secure login and registration process
- **Responsive Design**: Works across desktop and mobile devices

## Technology Stack

- **Frontend**:

  - [React 18](https://react.dev/)
  - [Vite](https://vitejs.dev/) (for fast development)
  - [TanStack Query](https://tanstack.com/query/latest) (for server state management)
  - [React Router](https://reactrouter.com/) (for navigation)
  - [Tailwind CSS](https://tailwindcss.com/) (for styling)
  - [Lucide React](https://lucide.dev/guide/packages/lucide-react) (for icons)

- **Backend**:
  - [PocketBase](https://pocketbase.io/) (for database, authentication, and real-time features)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PocketBase server

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/buddytask.git
cd buddytask
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
VITE_POCKETBASE_URL=http://localhost:8090
```

4. Start the PocketBase server

```bash
./pocketbase serve
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
buddytask/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (including PocketContext)
│   ├── hooks/          # Custom React hooks (including usePartnerTasks)
│   ├── lib/            # Utility functions and PocketBase client
│   ├── pages/          # Main application pages
│   ├── routes/         # Route definitions
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed.

## Deployment

1. Deploy your PocketBase backend to your preferred hosting service
2. Update the `.env` file with your production PocketBase URL
3. Build the frontend application
4. Deploy the `dist` directory to a static hosting service like Netlify, Vercel, or GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
