import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RootLayout from "./pages/Root";
import CreateTasks from "./pages/MyTasksPage";
import { checkAuthLoader } from "./utils/auth";
import CompleteMicrotaskPage from "./pages/CompleteMicrotaskPage";
import CrowdTasksPage from "./pages/CrowdTasksPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: checkAuthLoader,
    children: [
      { path: "", element: <MainPage /> },
      { path: "mytasks", element: <CreateTasks /> },
      { path: "crowdtasks", element: <CrowdTasksPage /> },
      { path: "/crowdtasks/:taskId", element: <CompleteMicrotaskPage /> },
    ],
  },
  { path: "/auth", element: <LoginPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
