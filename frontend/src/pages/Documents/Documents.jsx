import { useEffect, useState } from "react";
import "./documents.css";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
export default function Documents() {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/documents`);
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
      <Table items={documents} type={"dokument"} />
    </>
  );
}
