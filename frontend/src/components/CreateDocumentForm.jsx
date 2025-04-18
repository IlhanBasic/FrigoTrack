import React from "react";
import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./form.css";
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
  const [typeDocument, setTypeDocument] = useState("otkup");
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/partners`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPartners(data));
    fetch(`${import.meta.env.VITE_API_URL}/products`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);
  async function createDocumentAction(prevFormState, formData) {
    let userId = "";
    const type = formData.get("type");
    const documentNumber = "";
    const date = new Date();
    const partnerId = formData.get("partner");
    const notes = formData.get("notes");
    const transportCost = Number(formData.get("transportCost"));
    const status = "u pripremi";

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
        toast.error(userData.message);
      }
      userId = userData._id;

      const productsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/products`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const productsData = await productsResponse.json();

      if (!productsResponse.ok) {
        toast.error(productsData.message);
      }

      const documentItems = products.map((product) => {
        const matchingProduct = productsData.find(
          (p) => p.name === product.productId && p.variety === product.varietyId
        );

        if (!matchingProduct) {
          toast.error(
            `Proizvod nije pronadjen: ${product.productId} - ${product.varietyId}`
          );
        }

        return {
          productId: matchingProduct._id,
          variety: matchingProduct.variety,
          quantity: product.quantity,
          pricePerUnit: matchingProduct.sellingPrice,
          vatRate: 20,
          total:
            product.quantity * matchingProduct.sellingPrice * (1 + 20 / 100),
        };
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents`,
        {
          method: "POST",
          credentials: "include",
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
            transportCost,
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
      toast.error(err);
      return {
        errors: [err.message || "Došlo je do greške pri slanju zahtjeva."],
      };
    }
  }

  const [formState, formAction] = useActionState(createDocumentAction, {
    errors: null,
  });

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
          <select
            id="type"
            name="type"
            required
            defaultValue=""
            value={typeDocument}
            onChange={(e) => setTypeDocument(e.target.value)}
          >
            <option value="" disabled>
              -- Izaberite tip --
            </option>
            <option value="otkup">Otkup</option>
            <option value="prodaja">Prodaja</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="partner">Partner:</label>
          <select id="partner" name="partner" required defaultValue="">
            <option value="" disabled>
              -- Izaberite partnera --
            </option>
            {partners
              .filter(
                (partner) =>
                  (typeDocument === "otkup" &&
                    partner.type === "poljoprivrednik") ||
                  (typeDocument === "prodaja" && partner.type === "kupac")
              )
              .map((partner) => (
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
                {items.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
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
                {items
                  .filter((item) => item.name === selectedProduct)
                  .map((item) => (
                    <option key={item.variety} value={item.variety}>
                      {item.variety}
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
          <label htmlFor="transportCost">Trošak prevoza:</label>
          <input
            type="number"
            id="transportCost"
            name="transportCost"
            defaultValue={0}
            step={"0.01"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Napomene:</label>
          <textarea id="notes" name="notes"></textarea>
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
