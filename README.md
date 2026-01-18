# AssetVerse - Frontend

**AssetVerse** is the frontend client for the Asset Management System, offering a modern, responsive, and intuitive interface for HR Managers and Employees to interact with the platform. Built with **React** and styled with **Tailwind CSS**, it ensures a seamless user experience.

## ✨ Features

- **Modern Dashboard**: Interactive and data-rich dashboards for both HR and Employees.
- **Responsive Design**: Fully responsive layout optimized for all device sizes, powered by **Tailwind CSS** and **DaisyUI**.
- **Authentication**: Secure login, signup, and profile management integrated with **Firebase**.
- **Asset Management**: Visual tools for adding, updating, and deleting assets (HR).
- **Request System**: Easy-to-use interface for employees to request assets and for HR to approve/reject them.
- **Real-time Feedback**: Interactive notifications and alerts using `sweetalert2` and `react-toastify`.
- **Data Visualization**: Insightful charts and graphs using `recharts`.

## 💻 Tech Stack

- **Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4), [DaisyUI](https://daisyui.com/)
- **Routing**: [React Router](https://reactrouter.com/) (v7)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)

## 📦 Project Structure

```bash
B12A12-Forntend/
├── src/
│   ├── authentication/     # Login, Register, and Auth logic
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Main application layouts
│   ├── pages/              # Application pages (Home, Dashboard, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── router/             # Route configurations
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🚀 Getting Started

1.  **Clone the repository**:

    ```bash
    git clone <repository_url>
    cd B12A12-Forntend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start the Development Server**:

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173` (or the port shown in your terminal).

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🧪 Key Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run preview`: Preview the production build locally.

## 🤝 Contributing

We welcome contributions! If you'd like to improve the frontend, please fork the repo and create a pull request.

## 📄 License

This project is licensed under the MIT License.
