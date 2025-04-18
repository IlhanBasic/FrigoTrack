import { useEffect } from "react";
import CreateColdRoomForm from "../../components/CreateColdRoomForm.jsx";
import "./room.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
export default function CreateColdRoom() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (!(user.role === "admin" || (user.role === "user" && user.department === "skladište"))) {
        toast.error("Nemate pristup ovoj stranici!");
        navigate("/");
      }      
  }, []);
  return (
    <div className="create-cold-room">
      <h1>Dodaj Prostor</h1>
      <CreateColdRoomForm />
    </div>
  );
}
