import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./createform.css";
export default function CreatePaymentForm() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const user = useSelector((state) => state.auth.user.username);
  const token = useSelector((state) => state.auth.token);
  async function createPaymentAction(prevFormState, formData) {
    let userId = "";
    const amountPaid = formData.get("amountPaid");
    const paymentDate = formData.get("paymentDate");
    const recordedBy = formData.get("recordedBy");
    const documentId = formData.get("documentId");
    const errors = [];
    if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      errors.push("Iznos transakcije mora biti pozitivan broj.");
    }
    if (!paymentDate) {
      errors.push("Datum transakcije je obavezan.");
    }
    if (!method) {
      errors.push("Metoda transakcije je obavezna.");
    }
    if (!recordedBy) {
      errors.push("Zabilježio je obavezan.");
    }
    if (errors.length > 0) {
      return { errors };
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await response.json();
      if (!response.ok) {
        toast.error(userData.message);
      }
      userId = userData._id;
    } catch (err) {
      toast.error(err);
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountPaid,
          paymentDate,
          recordedBy: userId,
          document: documentId,
        }),
      });
      if (response.ok) {
        toast.success("Transakcija uspješno dodana!");
        navigate("/payments");
      }
      return { errors: await response.json() };
    } catch (err) {
      toast.error(err);
    }
  }
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/documents`)
      .then((res) => res.json())
      .then((data) => setDocuments(data.data));
  }, []);
  const [formState, formAction] = useActionState(createPaymentAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="amountPaid">Iznos transakcije:</label>
          <input type="number" id="amountPaid" name="amountPaid" required />
        </div>
        <div className="form-group">
          <label htmlFor="paymentDate">Datum transakcije:</label>
          <input type="date" id="paymentDate" name="paymentDate" required />
        </div>
        <div className="form-group">
          <label htmlFor="recordedBy">Zabilježio:</label>
          <input
            type="text"
            id="recordedBy"
            name="recordedBy"
            readOnly
            value={user}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Po dokumentu:</label>
          <select id="documentId" name="documentId" required>
            {documents.map((document) => (
              <option key={document._id} value={document._id}>
                {document.documentNumber}
              </option>
            ))}
          </select>
        </div>
        {formState.errors && formState.errors.length > 0 && (
          <div className="form-group">
            <ul className="errors">
              {formState.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Dodaj Plaćanje</button>
      </form>
    </div>
  );
}
