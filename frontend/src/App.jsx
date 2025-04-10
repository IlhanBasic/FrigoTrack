import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import RootLayout from "./pages/Home/RootLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [{ index: true, element: <Home /> }],
    },
    { path: "/auth", element: <Login /> },
    { path: "/register", element: <Register /> },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
