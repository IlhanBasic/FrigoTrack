import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { toast } from "react-toastify";

const api_url = import.meta.env.VITE_API_URL;

export default function RootLayout() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${api_url}/users/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.user) {
          dispatch(
            authActions.setUser({
              user: data.user,
              token: token || getCookie("token"),
            })
          );
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/auth");
      }
    };

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    if (!user) {
      checkAuth();
    }
  }, [user, navigate, dispatch, token]);

  if (!user) {
    return null;
  }

  return <Outlet />;
}
