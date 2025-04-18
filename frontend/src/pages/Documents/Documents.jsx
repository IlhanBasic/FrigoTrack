import { useEffect, useState } from "react";
import "./documents.css";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Documents() {
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
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        setDocuments(data.data);
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
      <Table items={documents} type={"dokumenti"} />
    </>
  );
}
