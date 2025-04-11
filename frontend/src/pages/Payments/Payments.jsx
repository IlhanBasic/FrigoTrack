import { useEffect, useState } from "react";
import "./payments.css";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
export default function Payments() {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`);
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
      <Table items={payments} />
    </>
  );
}
