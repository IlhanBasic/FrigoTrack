import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import EditColdRoomForm from "../../components/EditColdRoomForm.jsx";
import "./room.css";
import { toast } from "react-toastify";
import { useEffect } from "react";
export default function EditColdRoom() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (!(user.role === "admin" || (user.role === "user" && user.department === "skladište"))) {
        toast.error("Nemate pristup ovoj stranici!");
        navigate("/");
      }      
  }, []);
  return (
    <div className="edit-cold-room">
      <h1>Uredi Prostor</h1>
      <EditColdRoomForm />
    </div>
  );
}
