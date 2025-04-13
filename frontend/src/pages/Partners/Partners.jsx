import { useState, useEffect } from "react";
import Table from "../../components/Table";
import "./partners.css";
import Loader from "../../components/Loader";
export default function Partners() {
  const [isLoading, setIsLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/partners`);
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
      <Table items={partners} type={"partnera"} />
    </>
  );
}
