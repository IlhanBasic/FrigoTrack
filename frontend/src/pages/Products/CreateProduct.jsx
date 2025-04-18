import "./product.css";
import CreateProductForm from '../../components/CreateProductForm.jsx';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export default function CreateProduct() {
  const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
      if (!(user.role === "admin" || (user.role === "user" && user.department === "skladište"))) {
          toast.error("Nemate pristup ovoj stranici!");
          navigate("/");
        }      
    }, []);
  return (
    <div className="create-product">
      <h1>Dodaj Proizvod</h1>
      <CreateProductForm />
    </div>
  );
}
