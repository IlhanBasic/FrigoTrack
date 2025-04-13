import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useSelector} from "react-redux";
import "./createform.css";
export default function CreatePaymentForm() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.username);
  async function createPaymentAction(prevFormState, formData) {}
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
          <label htmlFor="method">Metoda transakcije:</label>
          <select id="method" name="method" required>
            <option value="gotovina">Gotovina</option>
            <option value="račun">Račun</option>
          </select>
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
          {/* <input type="text" id="description" name="description" /> */}
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
        <button type="submit">Dodaj Partnera</button>
      </form>
    </div>
  );
}
