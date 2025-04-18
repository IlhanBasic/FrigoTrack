import "./document.css";
import EditDocumentForm from "../../components/EditDocumentForm.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function EditDocument() {
  const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
      if (!(user.role === "admin" || (user.role === "user" && user.department === "administracija"))) {
          toast.error("Nemate pristup ovoj stranici!");
          navigate("/");
        }      
    }, []);
  return (
    <div className="edit-document">
      <h1>Uredi Dokument</h1>
      <EditDocumentForm />
    </div>
  );
}
