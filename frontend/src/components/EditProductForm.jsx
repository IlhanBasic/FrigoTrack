import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./createform.css";
import { VARIETY } from "../data/data";
export default function EditPartnerForm() {
  const navigate = useNavigate();
  const [coldRooms, setColdRooms] = useState([]);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    async function fetchProduct() {
      try {
        const id = window.location.pathname.split("/")[3];
        if (!id) {
          toast.error("Niste izabrali proizvod");
          navigate("/products");
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProduct();
  }, []);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/coldrooms`)
      .then((res) => res.json())
      .then((data) => setColdRooms(data.data));
  }, []);
  async function EditProductAction(prevFormState, formData) {
    const purchasePrice = Number(formData.get("purchasePrice"));
    const sellingPrice = Number(formData.get("sellingPrice"));
    const vatRate = Number(formData.get("vatRate"));
    const minStockKg = Number(formData.get("minStockKg"));
    const coldRoomId = formData.get("coldRoomId");
    const isActive = formData.get("isActive") === "true";
    const expiryDate = formData.get("expiryDate");
    const freezingMethod = formData.get("freezingMethod");
    const brix = Number(formData.get("brix"));
    const acidity = Number(formData.get("acidity"));
    const sugarContent = Number(formData.get("sugarContent"));
    const currentStockKg = product.currentStockKg;
    const errors = [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purchasePrice,
            sellingPrice,
            vatRate,
            currentStockKg,
            minStockKg,
            coldRoomId,
            isActive,
            expiryDate,
            freezingMethod,
            brix,
            acidity,
            sugarContent,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Proizvod uspješno izmenjen!");
        navigate("/products");
        return { errors: null };
      } else {
        return { errors: responseData };
      }
    } catch (err) {
      errors.push(err.message || err);
      console.error(err);
      toast.error("Greška prilikom izmene!");
      return { errors };
    }
  }

  const [formState, formAction] = useActionState(EditProductAction, {
    errors: null,
  });
  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="purchasePrice">Cena Kupovine:</label>
          <input
            type="number"
            id="purchasePrice"
            name="purchasePrice"
            required
            min="0"
            step={"0.01"}
            value={product?.purchasePrice}
            onChange={(e) =>
              setProduct({ ...product, purchasePrice: e.target.value })
            }
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
            value={product?.sellingPrice}
            onChange={(e) =>
              setProduct({ ...product, sellingPrice: e.target.value })
            }
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
            value={product?.vatRate}
            setProduct={setProduct}
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
            value={product?.minStockKg}
            onChange={(e) =>
              setProduct({ ...product, minStockKg: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="coldRoomId">Prostor:</label>
          <select
            id="coldRoomId"
            name="coldRoomId"
            required
            value={product?.coldRoomId}
            onChange={(e) =>
              setProduct({ ...product, coldRoomId: e.target.value })
            }
          >
            {coldRooms.map((room) => (
              <option key={room._id} value={room._id}>
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
            value={product?.sugarContent}
            onChange={(e) =>
              setProduct({ ...product, sugarContent: e.target.value })
            }
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
            value={product?.acidity}
            onChange={(e) =>
              setProduct({ ...product, acidity: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="brix">Brix (%):</label>
          <input
            type="number"
            id="brix"
            name="brix"
            step={"0.01"}
            value={product?.brix}
            onChange={(e) => setProduct({ ...product, brix: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="freezingMethod">Metoda Zamrzavanja:</label>
          <select
            id="freezingMethod"
            name="freezingMethod"
            value={product?.freezingMethod}
            onChange={(e) =>
              setProduct({ ...product, freezingMethod: e.target.value })
            }
          >
            <option value="IQF">IQF</option>
            <option value="block">Block</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Datum Isteka:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={
              product?.expiryDate
                ? new Date(product.expiryDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setProduct({ ...product, expiryDate: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Aktivan:</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked
            value={product?.isActive}
            onChange={(e) =>
              setProduct({ ...product, isActive: e.target.checked })
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
        <button type="submit">Izmeni Proizvod</button>
      </form>
    </div>
  );
}
