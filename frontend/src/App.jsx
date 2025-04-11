import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import RootLayout from "./pages/Home/RootLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Products from "./pages/Products/Products.jsx";
import Partners from "./pages/Partners/Partners.jsx";
import Payments from "./pages/Payments/Payments.jsx";
import Rooms from "./pages/Rooms/Rooms.jsx";
import Documents from "./pages/Documents/Documents.jsx";
import Error from "./pages/Error/Error.jsx";
import Stats from "./pages/Stats/Stats.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement:<Error/>,
      children: [
        { index: true, element: <Home /> },
        { path: "/products", element: <Products /> },
        { path: "/documents", element: <Documents /> },
        { path: "/payments", element: <Payments /> },
        { path: "/rooms", element: <Rooms /> },
        { path: "/partners", element: <Partners /> },
        { path: "/stats", element: <Stats /> },
      ],
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
