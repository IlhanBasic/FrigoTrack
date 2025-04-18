import "./payment.css";
import CreatePaymentForm from "../../components/CreatePaymentForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function CreatePayment() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    if (
      !(
        user.role === "admin" ||
        (user.role === "user" && user.department === "administracija")
      )
    ) {
      toast.error("Nemate pristup ovoj stranici!");
      navigate("/");
    }
  }, []);
  return (
    <div className="create-payment">
      <h1>Dodaj Placanje</h1>
      <CreatePaymentForm />
    </div>
  );
}
