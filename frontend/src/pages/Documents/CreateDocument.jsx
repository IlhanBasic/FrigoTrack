import "./document.css";
import CreateDocumentForm from "../../components/CreateDocumentForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
export default function createdocument() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (!(user.role === "admin" || (user.role === "user" && user.department === "administracija"))) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);

  return (
    <div className="create-document">
      <h1>Dodaj Dokument</h1>
      <CreateDocumentForm />
    </div>
  );
}
