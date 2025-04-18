import "./partner.css";
import EditPartnerForm from "../../components/EditPartnerForm.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function EditPartner() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate;
  useEffect(() => {
    if (!(user.role === "admin" || (user.role === "user" && user.department === "administracija"))) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  return (
    <div className="edit-partner">
      <h1>Uredi Partnera</h1>
      <EditPartnerForm />
    </div>
  );
}
