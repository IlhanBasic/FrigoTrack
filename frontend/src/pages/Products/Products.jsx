import { useEffect, useState } from "react";
import "./products.css";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
export default function Products() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  console.log(user);
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
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProducts(data);
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
      <Table items={products} type={"proizvodi"} />
    </>
  );
}
