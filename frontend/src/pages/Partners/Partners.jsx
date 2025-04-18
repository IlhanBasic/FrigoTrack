import { useState, useEffect } from "react";
import Table from "../../components/Table";
import "./partners.css";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Partners() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  useEffect(()=>{
    if(!(user.role === "admin" || (user.role === "user" && user.department === "administracija"))){
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  },[])
  const [isLoading, setIsLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/partners`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPartners(data);
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
      <Table items={partners} type={"partneri"} />
    </>
  );
}
