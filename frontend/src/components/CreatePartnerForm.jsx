import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
export default function CreatePartnerForm() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  async function createPartnerAction(prevFormState, formData) {
    const name = formData.get("name")?.trim();
    const address = formData.get("address")?.trim();
    const phone = formData.get("phone")?.trim();
    const email = formData.get("email")?.trim();
    const pibOrJmbg = formData.get("pibOrJmbg")?.trim();
    const accountNumber = formData.get("accountNumber")?.trim();
    const bankName = formData.get("bankName")?.trim();
    const type = formData.get("type")?.trim();
    const isActive = formData.get("isActive") === "on";
    const isVATRegistered = formData.get("isVATRegistered") === "on";
    
    const errors = [];

    if (!name || !address || !phone || !pibOrJmbg || !type) {
      errors.push(
        "Polja 'Ime', 'Adresa', 'Telefon', 'PIB/JMBG' i 'Tip' su obavezna."
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email adresa nije u validnom formatu.");
    }

    if (phone && !/^\d{6,15}$/.test(phone)) {
      errors.push("Telefon mora sadržati samo brojeve (6-15 cifara).");
    }

    if (pibOrJmbg && !/^\d{8,13}$/.test(pibOrJmbg)) {
      errors.push("PIB ili JMBG mora sadržati između 8 i 13 cifara.");
    }

    if (accountNumber && !/^\d{10,20}$/.test(accountNumber)) {
      errors.push("Broj računa mora sadržati između 10 i 20 cifara.");
    }

    if (type !== "poljoprivrednik" && type !== "kupac") {
      errors.push("Tip mora biti 'poljoprivrednik' ili 'kupac'.");
    }

    if (errors.length > 0) {
      return { errors };
    }

    const partner = {
      name,
      address,
      phone,
      email,
      pibOrJmbg,
      accountNumber,
      bankName,
      type,
      isActive,
      isVATRegistered
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/partners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(partner),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { errors: errorData.errors };
      } else {
        toast.success("Uspešna dodat partner!");
        navigate("/partners");
        return { errors: null };
      }
    } catch (error) {
      return { errors: error.message };
    }
    return { errors: null };
  }

  const [formState, formAction] = useActionState(createPartnerAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="name">Ime partnera:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Adresa:</label>
          <input type="text" id="address" name="address" required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="pibOrJmbg">PIB or JMBG:</label>
          <input type="text" id="pibOrJmbg" name="pibOrJmbg" required />
        </div>
        <div className="form-group">
          <label htmlFor="accountNumber">Broj računa:</label>
          <input type="text" id="accountNumber" name="accountNumber" required />
        </div>
        <div className="form-group">
          <label htmlFor="bankName">Ime Banke:</label>
          <input type="text" id="bankName" name="bankName" required />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select name="type" id="type" required>
            <option value="poljoprivrednik">Poljoprivrednik</option>
            <option value="kupac">Kupac</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="isVATRegistered">U PDV sistemu:</label>
          <input
            type="checkbox"
            id="isVATRegistered"
            name="isVATRegistered"
            defaultChecked={false}
          />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={true}
          />
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
