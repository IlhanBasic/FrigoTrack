import { useEffect, useState } from "react";
import Table from "../../components/Table";
import "./rooms.css";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function Rooms() {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (
      !(
        user.role === "admin" ||
        (user.role === "user" && user.department === "skladište")
      )
    ) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coldRooms`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRooms();
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Table items={rooms} type={"prostori"} />
    </>
  );
}
