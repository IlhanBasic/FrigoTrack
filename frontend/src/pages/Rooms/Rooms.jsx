import { useEffect, useState } from "react";
import Table from "../../components/Table";
import "./rooms.css";
import Loader from "../../components/Loader";
export default function Rooms() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coldRooms`);
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
      <Table items={rooms} type={"prostor"} />
    </>
  );
}
