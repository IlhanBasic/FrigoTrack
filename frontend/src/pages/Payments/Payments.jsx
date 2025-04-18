import { useEffect, useState } from "react";
import "./payments.css";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Payments() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (
      !(
        user.role === "admin" ||
        (user.role === "user" && user.department === "administracija")
      )
    ) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        setPayments(data.data);
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
      <Table items={payments} type={"placanja"} />
    </>
  );
}
