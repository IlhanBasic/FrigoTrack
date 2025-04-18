import { useSelector } from "react-redux";
import CreatePartnerForm from "../../components/CreatePartnerForm";
import "./partner.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CreatePartner() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  useEffect(() => {
    if (!(user.role === "admin" || (user.role === "user" && user.department === "administracija"))) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  return (
    <div className="create-partner">
      <h1>Dodaj Partnera</h1>
      <CreatePartnerForm />
    </div>
  );
}
