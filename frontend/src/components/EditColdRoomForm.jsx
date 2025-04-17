import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./createform.css";
export default function EditColdRoomForm() {
  const navigate = useNavigate();
  const [selectedColdRoom, setSelectedColdRoom] = useState(null);
  useEffect(() => {
    async function fetchColdRoom() {
      try {
        const id = window.location.pathname.split("/")[3];
        if (!id) {
          toast.error("Niste izabrali prostor");
          navigate("/rooms");
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/coldrooms/${id}`
        );
        const data = await res.json();
        setSelectedColdRoom(data.data);
      } catch (err) {
        toast.error(err);
      }
    }
    fetchColdRoom();
  }, []);
  async function EditColdRoomAction(prevFormState, formData) {
    const location = formData.get("location");
    const temperature = Number(formData.get("temperature"));
    const capacityKg = Number(formData.get("capacityKg"));
    const currentLoadKg = selectedColdRoom.currentLoadKg;
    const type = formData.get("type");
    const isActive = formData.get("isActive") === "true";
    const errors = [];
    if (!location.trim()) {
      errors.push("Lokacija ne smije biti prazna");
    }
    if (isNaN(temperature) || temperature < -200 || temperature > 50) {
      errors.push(
        "Temperatura mora biti broj izme u rasponu od -200 do 50 stepeni"
      );
    }
    if (isNaN(capacityKg) || capacityKg <= 0) {
      errors.push("Kapacitet mora biti pozitivan broj");
    }
    if (
      isNaN(currentLoadKg) ||
      currentLoadKg < 0 ||
      currentLoadKg > capacityKg
    ) {
      errors.push(
        "Trenutano opterecenje mora biti broj izmedju rasponu od 0 do kapaciteta."
      );
    }
    if (!type) {
      errors.push("Tip prostora mora biti izabran");
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/coldrooms/${selectedColdRoom._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
        toast.success("Prostor uspješno izmenjen!");
        navigate("/rooms");
      }
      return { errors: await response.json() };
    } catch (err) {
      toast.error(err);
      return { errors: [err] };
    }
  }
  const [formState, formAction] = useActionState(EditColdRoomAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="location">Lokacija</label>
          <input
            type="text"
            name="location"
            id="location"
            value={selectedColdRoom?.location}
            onChange={(e) =>
              setSelectedColdRoom({
                ...selectedColdRoom,
                location: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="temperature">Temperatura ( C )</label>
          <input
            type="number"
            name="temperature"
            id="temperature"
            value={selectedColdRoom?.temperature}
            onChange={(e) =>
              setSelectedColdRoom({
                ...selectedColdRoom,
                temperature: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacityKg">Kapacitet (kg)</label>
          <input
            type="number"
            name="capacityKg"
            id="capacityKg"
            value={selectedColdRoom?.capacityKg}
            onChange={(e) =>
              setSelectedColdRoom({
                ...selectedColdRoom,
                capacityKg: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Tip</label>
          <select
            name="type"
            id="type"
            value={selectedColdRoom?.type}
            onChange={(e) =>
              setSelectedColdRoom({ ...selectedColdRoom, type: e.target.value })
            }
          >
            <option value="standard">Standard</option>
            <option value="shock freezer">Shock Freezer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan</label>
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            value={selectedColdRoom?.isActive}
            onChange={(e) =>
              setSelectedColdRoom({
                ...selectedColdRoom,
                isActive: e.target.checked,
              })
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
        <button type="submit">Izmeni Prostor</button>
      </form>
    </div>
  );
}
