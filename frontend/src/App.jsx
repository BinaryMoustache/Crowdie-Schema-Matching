import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { checkAuthLoader } from "./utils/auth";

import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/Root";
import CreateTasks from "./pages/MyTasksPage";
import CompleteMicrotaskPage from "./pages/CompleteMicrotaskPage";
import CrowdTasksPage from "./pages/CrowdTasksPage";
import AuthenticationPage from "./pages/AuthenticationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: checkAuthLoader,
    children: [
      { path: "", element: <MainPage /> },
      { path: "mytasks", element: <CreateTasks /> },
      { path: "crowdtasks", element: <CrowdTasksPage /> },
      { path: "/crowdtasks/:taskId", element: <CompleteMicrotaskPage /> },
    ],
  },
  { path: "/auth", element: <AuthenticationPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
