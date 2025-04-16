import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./createform.css";
export default function EditPartnerForm() {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  useEffect(() => {
    async function fetchPartner() {
      try {
        const id = window.location.pathname.split("/")[3];
        console.log(id);
        if (!id) {
          toast.error("Niste izabrali partnera");
          navigate("/partners");
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/partners/${id}`
        );
        const data = await res.json();
        setPartner(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPartner();
  }, []);
  async function EditPartnerAction(prevFormState, formData) {
    const name = formData.get("name")?.trim();
    const address = formData.get("address")?.trim();
    const phone = formData.get("phone")?.trim();
    const email = formData.get("email")?.trim();
    const pibOrJmbg = formData.get("pibOrJmbg")?.trim();
    const accountNumber = formData.get("accountNumber")?.trim();
    const bankName = formData.get("bankName")?.trim();
    const type = formData.get("type")?.trim();
    const isActive = formData.get("isActive") === "true";

    const errors = [];

    if (!name || !address || !phone || !pibOrJmbg || !type) {
      errors.push(
        "Polja 'Ime', 'Adresa', 'Telefon', 'PIB/JMBG' i 'Tip', 'Aktivan' su obavezna."
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

    if (accountNumber && !/^\d{8,15}$/.test(accountNumber)) {
      errors.push("Broj računa mora sadržati između 8 i 15 cifara.");
    }

    if (Object.keys(errors).length > 0) {
      return { errors };
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/partners/${partner._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            address,
            phone,
            email,
            pibOrJmbg,
            accountNumber,
            bankName,
            type,
            isActive,
          }),
        }
      );
      if (response.ok) {
        toast.success("Partner uspješno izmenjen!");
        navigate("/partners");
      }
      return { errors: await response.json() };
    } catch (err) {
      toast.error(err);
      return { errors: err };
    }
  }
  const [formState, formAction] = useActionState(EditPartnerAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="name">Ime partnera:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={partner?.name}
            onChange={(e) => setPartner({ ...partner, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Adresa:</label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={partner?.address}
            onChange={(e) =>
              setPartner({ ...partner, address: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefon:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={partner?.phone}
            onChange={(e) => setPartner({ ...partner, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={partner?.email}
            onChange={(e) => setPartner({ ...partner, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pibOrJmbg">PIB or JMBG:</label>
          <input
            type="text"
            id="pibOrJmbg"
            name="pibOrJmbg"
            required
            value={partner?.pibOrJmbg}
            onChange={(e) =>
              setPartner({ ...partner, pibOrJmbg: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="accountNumber">Broj računa:</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            required
            value={partner?.accountNumber}
            onChange={(e) =>
              setPartner({ ...partner, accountNumber: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="bankName">Ime Banke:</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            required
            value={partner?.bankName}
            onChange={(e) =>
              setPartner({ ...partner, bankName: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            name="type"
            id="type"
            required
            value={partner?.type}
            onChange={(e) => setPartner({ ...partner, type: e.target.value })}
          >
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
            onChange={(e) =>
              setPartner({ ...partner, isVATRegistered: e.target.checked })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={true}
            onChange={(e) =>
              setPartner({ ...partner, isActive: e.target.checked })
            }
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
        <button type="submit">Izmeni Partnera</button>
      </form>
    </div>
  );
}
