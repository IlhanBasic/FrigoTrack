import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import { toast } from "react-toastify";
import { VARIETY } from "../data/data.js";
import {useSelector} from "react-redux";
export default function CreateProductForm() {
  const token = useSelector((state)=>state.auth.token);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [coldRooms, setColdRooms] = useState([]);
  async function createProductAction(prevFormState, formData) {
    const name = formData.get("name");
    const variety = formData.get("variety");
    const purchasePrice = Number(formData.get("purchasePrice"));
    const sellingPrice = Number(formData.get("sellingPrice"));
    const vatRate = Number(formData.get("vatRate"));
    const minStockKg = Number(formData.get("minStockKg"));
    const coldRoomId = formData.get("coldRoomId");
    const harvestYear = Number(formData.get("harvestYear"));
    const isActive = formData.get("isActive") === "true";
    const expiryDate = formData.get("expiryDate");
    const freezingMethod = formData.get("freezingMethod");
    const brix = Number(formData.get("brix"));
    const acidity = Number(formData.get("acidity"));
    const sugarContent = Number(formData.get("sugarContent"));
    const currentStockKg = 0;
    const errors = [];

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          variety,
          purchasePrice,
          sellingPrice,
          vatRate,
          minStockKg,
          coldRoomId,
          harvestYear,
          isActive,
          expiryDate,
          freezingMethod,
          brix,
          acidity,
          sugarContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/store`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              productId: data.product._id,
              coldRoomId,
              quantityKg: currentStockKg,
              storageDate: new Date(),
            }),
          }
        );

        const storeData = await res.json();
        if (!res.ok) {
          errors.push(storeData.message);
        }

        toast.success("Proizvod uspješno dodan!");
        navigate("/products");
      } else {
        const data = await response.json();
        errors.push(`Proverite podatke:${data.message}`);
        return { errors: errors };
      }
    } catch (err) {
      errors.push(err.message);
      toast.error(err.message);
      return { errors };
    }
  }

  const [formState, formAction] = useActionState(createProductAction, {
    errors: null,
  });
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/coldrooms`,{
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setColdRooms(data.data));
  }, []);
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="name">Vrsta Proizvoda:</label>
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            required
          >
            <option value="malina">Malina</option>
            <option value="jagoda">Jagoda</option>
            <option value="ribizla">Ribizla</option>
            <option value="kupina">Kupina</option>
            <option value="borovnica">Borovnica</option>
            <option value="tresnja">Trešnja</option>
            <option value="visnja">Višnja</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="variety">Vrsta:</label>
          <select id="variety" name="variety" required>
            {(VARIETY[name] || []).map((variety) => (
              <option key={variety} value={variety}>
                {variety}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="harvestYear">Godina Berbe:</label>
          <input
            type="number"
            id="harvestYear"
            name="harvestYear"
            required
            min="2020"
            max={new Date().getFullYear()}
          />
        </div>
        <div className="form-group">
          <label htmlFor="purchasePrice">Cena Kupovine:</label>
          <input
            type="number"
            id="purchasePrice"
            name="purchasePrice"
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sellingPrice">Cena Prodaje:</label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            required
            min="0"
            step={"0.01"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vatRate">PDV:</label>
          <input
            type="number"
            id="vatRate"
            name="vatRate"
            defaultValue="20"
            step={"0.01"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="minStockKg">Minimalna Tezina na Stanju:</label>
          <input
            type="number"
            id="minStockKg"
            name="minStockKg"
            defaultValue="10"
            step={"0.01"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="coldRoomId">Prostor:</label>
          <select id="coldRoomId" name="coldRoomId" required>
            {coldRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="sugarContent">Količina Šećera (%):</label>
          <input
            type="number"
            id="sugarContent"
            name="sugarContent"
            min="0"
            max="100"
            step={"0.01"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="acidity">Kiselost (°pH):</label>
          <input
            type="number"
            id="acidity"
            name="acidity"
            min="0"
            step={"0.01"}
          />
        </div>
        <div className="form-group">
          <label htmlFor="brix">Brix (%):</label>
          <input type="number" id="brix" name="brix" step={"0.01"} />
        </div>
        <div className="form-group">
          <label htmlFor="freezingMethod">Metoda Zamrzavanja:</label>
          <select id="freezingMethod" name="freezingMethod">
            <option value="IQF">IQF</option>
            <option value="block">Block</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Datum Isteka:</label>
          <input type="date" id="expiryDate" name="expiryDate" />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan:</label>
          <input type="checkbox" id="isActive" name="isActive" defaultChecked />
        </div>
        {formState?.errors && formState.errors.length > 0 && (
          <div className="form-group">
            <ul className="errors">
              {formState.errors.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Dodaj Proizvod</button>
      </form>
    </div>
  );
}
