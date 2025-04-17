import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./createform.css";
export default function CreateColdRoomForm() {
  const navigate = useNavigate();
  async function createColdRoomAction(prevFormState, formData) {
    const roomNumber = formData.get("roomNumber");
    const location = formData.get("location");
    const temperature = Number(formData.get("temperature"));
    const capacityKg = Number(formData.get("capacityKg"));
    const type = formData.get("type");
    const isActive = formData.get("isActive") === "true";
    const currentLoadKg = 0;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/coldrooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomNumber,
            location,
            temperature,
            capacityKg,
            currentLoadKg,
            type,
            isActive,
          }),
        }
      );
      if (response.ok) {
        toast.success("Prostor uspješno dodan!");
        navigate("/rooms");
      }
      return { errors: await response.json() };
    } catch (err) {
      toast.error(err);
      return { errors: err };
    }
  }
  const [formState, formAction] = useActionState(createColdRoomAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="roomNumber">Broj Sobe</label>
          <input type="text" name="roomNumber" id="roomNumber" />
        </div>
        <div className="form-group">
          <label htmlFor="location">Lokacija</label>
          <input type="text" name="location" id="location" />
        </div>
        <div className="form-group">
          <label htmlFor="temperature">Temperatura ( C )</label>
          <input type="number" name="temperature" id="temperature" />
        </div>
        <div className="form-group">
          <label htmlFor="capacityKg">Kapacitet (kg)</label>
          <input type="number" name="capacityKg" id="capacityKg" />
        </div>
        <div className="form-group">
          <label htmlFor="type">Tip</label>
          <select name="type" id="type">
            <option value="standard">Standard</option>
            <option value="shock freezer">Shock Freezer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan</label>
          <input type="checkbox" name="isActive" id="isActive" />
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
        <button type="submit">Dodaj Prostor</button>
      </form>
    </div>
  );
}
