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
import CreatePartner from "./pages/Partners/CreatePartner.jsx";
import CreatePayment from "./pages/Payments/CreatePayment.jsx";
import CreateColdRoom from "./pages/Rooms/CreateColdRoom.jsx";
import CreateProduct from "./pages/Products/CreateProduct.jsx";
import CreateDocument from "./pages/Documents/CreateDocument.jsx";
import EditColdRoom from "./pages/Rooms/EditColdRoom.jsx";
import EditPartner from "./pages/Partners/EditPartner.jsx";
import EditProduct from "./pages/Products/EditProduct.jsx";
import EditDocument from "./pages/Documents/EditDocument.jsx";
import ChatComponent from "./pages/Assistant/ChatComponent.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/products",
          children: [
            { index: true, element: <Products /> },
            { path: "create", element: <CreateProduct /> },
            { path: "edit/:id", element: <EditProduct /> },
          ],
        },
        {
          path: "/documents",
          children: [
            { index: true, element: <Documents /> },
            { path: "create", element: <CreateDocument /> },
            { path: "edit/:id", element: <EditDocument /> },
          ],
        },
        {
          path: "/payments",
          children: [
            { index: true, element: <Payments /> },
            { path: "create", element: <CreatePayment /> },
          ],
        },
        {
          path: "/rooms",
          children: [
            { index: true, element: <Rooms /> },
            { path: "create", element: <CreateColdRoom /> },
            { path: "edit/:id", element: <EditColdRoom /> },
          ],
        },
        {
          path: "/partners",
          children: [
            { index: true, element: <Partners /> },
            { path: "create", element: <CreatePartner /> },
            { path: "edit/:id", element: <EditPartner /> },
          ],
        },
        { path: "/stats", element: <Stats /> },
        { path: "/assistant", element: <ChatComponent /> },
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
