import "./product.css";
import EditProductForm from "../../components/EditProductForm.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function EditProduct() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (
      !(
        user.role === "admin" ||
        (user.role === "user" && user.department === "skladište")
      )
    ) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  return (
    <div className="edit-product">
      <h1>Uredi Proizvod</h1>
      <EditProductForm />
    </div>
  );
}
