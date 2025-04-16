import React from 'react';
import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./createform.css";
import { VARIETY, PRODUCTS } from "../data/data.js";
import { Trash, Plus } from "lucide-react";

export default function CreateDocumentForm() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [partners, setPartners] = useState([]);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.auth.user.username);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  async function createDocumentAction(prevFormState, formData) {
    let userId = "";
    const type = formData.get("type");
    const documentNumber = formData.get("documentNumber");
    const date = formData.get("date");
    const partnerId = formData.get("partner");
    const notes = formData.get("notes");
    const driverName = formData.get("driverName");
    const vehiclePlate = formData.get("vehiclePlate");
    const cost = Number(formData.get("cost"));
    const status = formData.get("status");

    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const userData = await userResponse.json();
      if (!userResponse.ok) {
        throw new Error(userData.message);
      }
      userId = userData._id;

      const productsResponse = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      const productsData = await productsResponse.json();
      
      if (!productsResponse.ok) {
        throw new Error(productsData.message);
      }

      const documentItems = products.map(product => {
        const matchingProduct = productsData.find(
          p => p.name === product.productId && p.variety === product.varietyId
        );

        if (!matchingProduct) {
          throw new Error(`Product not found: ${product.productId} - ${product.varietyId}`);
        }

        return {
          productId: matchingProduct._id,
          variety: matchingProduct.variety,
          quantity: product.quantity,
          pricePerUnit: matchingProduct.sellingPrice,
          vatRate: 20,
          total: product.quantity * matchingProduct.sellingPrice * (1 + 20 / 100),
        };
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type,
            documentNumber,
            date,
            partner: partnerId,
            items: documentItems,
            notes,
            driverName,
            vehiclePlate,
            cost,
            status,
            createdBy: userId,
          }),
        }
      );

      if (response.ok) {
        toast.success("Dokument uspješno dodan!");
        navigate("/documents");
        return { errors: null };
      } else {
        const errorData = await response.json();
        return { errors: [errorData.message] };
      }
    } catch (err) {
      console.error(err);
      return { errors: [err.message || "Došlo je do greške pri slanju zahtjeva."] };
    }
  }

  const [formState, formAction] = useActionState(createDocumentAction, {
    errors: null,
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/partners`)
      .then((res) => res.json())
      .then((data) => setPartners(data));
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  function addItem() {
    if (selectedProduct && selectedVariety && quantity) {
      setProducts((prev) => {
        const existingProductIndex = prev.findIndex(
          (item) =>
            item.productId === selectedProduct &&
            item.varietyId === selectedVariety
        );

        if (existingProductIndex !== -1) {
          const updatedProducts = [...prev];
          updatedProducts[existingProductIndex].quantity = Number(quantity);
          return updatedProducts;
        }

        return [
          ...prev,
          {
            productId: selectedProduct,
            varietyId: selectedVariety,
            quantity: Number(quantity),
          },
        ];
      });
      
      setSelectedProduct("");
      setSelectedVariety("");
      setQuantity("");
    }
  }

  function removeItem(productId, varietyId) {
    if (productId && varietyId) {
      setProducts((prev) =>
        prev.filter(
          (item) => item.productId !== productId || item.varietyId !== varietyId
        )
      );
    }
  }


  return (
    <div className="create-form">
      <form action={formAction} method="post">
        <div className="form-group">
          <label htmlFor="type">Tip:</label>
          <select id="type" name="type" required defaultValue="">
            <option value="" disabled>
              -- Izaberite tip --
            </option>
            <option value="otkup">Otkup</option>
            <option value="prodaja">Prodaja</option>
            <option value="otpis">Otpis</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="documentNumber">Broj dokumenta:</label>
          <input
            type="text"
            id="documentNumber"
            name="documentNumber"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Datum:</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="partner">Partner:</label>
          <select id="partner" name="partner" required defaultValue="">
            <option value="" disabled>
              -- Izaberite partnera --
            </option>
            {partners.map((partner) => (
              <option key={partner._id} value={partner._id}>
                {partner.name} - {partner.pibOrJmbg}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Stavke:</label>
          {products.length === 0 && <p>Nema stavki.</p>}
          {products.map((item) => (
            <ul key={`${item.productId}-${item.varietyId}`}>
              <li>
                <span>
                  {item.productId} - {item.varietyId} - {item.quantity} kg{" "}
                </span>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem(item.productId, item.varietyId)}
                >
                  <Trash />
                </button>
              </li>
            </ul>
          ))}
          <div className="items">
            <div className="input-group">
              <label htmlFor="product">Proizvod:</label>
              <select
                id="product"
                name="product"
                onChange={(e) => setSelectedProduct(e.target.value)}
                value={selectedProduct}
              >
                <option value="">-- Izaberite proizvod --</option>
                {PRODUCTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="variety">Tip:</label>
              <select
                id="variety"
                name="variety"
                onChange={(e) => setSelectedVariety(e.target.value)}
                value={selectedVariety}
                disabled={!selectedProduct}
              >
                <option value="">-- Izaberite tip --</option>
                {selectedProduct &&
                  VARIETY[selectedProduct]?.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="quantity">Količina:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button 
              type="button" 
              className="add-button" 
              onClick={addItem}
              disabled={!selectedProduct || !selectedVariety || !quantity}
            >
              <Plus />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="driverName">Ime vozača:</label>
          <input type="text" id="driverName" name="driverName" />
        </div>

        <div className="form-group">
          <label htmlFor="vehiclePlate">Registarska oznaka vozila:</label>
          <input type="text" id="vehiclePlate" name="vehiclePlate" />
        </div>

        <div className="form-group">
          <label htmlFor="cost">Trošak:</label>
          <input type="number" id="cost" name="cost" defaultValue={0} />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Napomene:</label>
          <textarea id="notes" name="notes"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" required defaultValue="">
            <option value="" disabled>
              -- Izaberite status --
            </option>
            <option value="u pripremi">U pripremi</option>
            <option value="potvrđen">Potvrđen</option>
            <option value="otpremljen">Otpremljen</option>
            <option value="storniran">Storniran</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="createdBy">Kreirano od strane:</label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            value={user}
            readOnly
            disabled
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

        <button type="submit" disabled={products.length === 0}>
          Dodaj Dokument
        </button>
      </form>
    </div>
  );
}