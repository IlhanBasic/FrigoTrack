import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import "./form.css";
import Loader from "./Loader";

export default function EditDocumentForm() {
  const navigate = useNavigate();
  const token = useSelector((state)=> state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [initStatus, setInitStatus] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [document, setDocument] = useState(null);
  const [partners, setPartners] = useState([]);
  const [products, setProducts] = useState([]);
  const [typeDocument, setTypeDocument] = useState("");
  const hasFetched = useRef(false);
  useEffect(() => {
    async function fetchData() {
      if (hasFetched.current) return;
      hasFetched.current = true;
      try {
        const id = window.location.pathname.split("/")[3];
        if (!id) {
          toast.error("Niste izabrali dokument");
          navigate("/documents");
          return;
        }

        const [documentRes, productsRes, partnersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/documents/${id}`,{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_API_URL}/products`,{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
          fetch(`${import.meta.env.VITE_API_URL}/partners`,{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }),
        ]);

        const [documentData, productsData, partnersData] = await Promise.all([
          documentRes.json(),
          productsRes.json(),
          partnersRes.json(),
        ]);

        setDocument(documentData.data);
        setInitStatus(documentData.data.status);
        setTypeDocument(documentData.data.type);
        if (documentData.data.status === "potvrđen") {
          toast.info("Dokument je već potvrđen");
          navigate("/documents");
          return;
        }

        setPartners(partnersData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        toast.error("Došlo je do greške prilikom učitavanja podataka");
      }
    }
    fetchData();
  }, [user.username, navigate]);

  function addItem() {
    if (selectedProduct && selectedVariety && quantity) {
      const product = products.find(
        (p) => p.name === selectedProduct && p.variety === selectedVariety
      );

      if (!product) {
        toast.error("Nije učitan proizvod");
        return;
      }
      setDocument((prev) => {
        const items = prev.items || [];

        const existingProductIndex = items.findIndex(
          (item) =>
            item.productId.name === selectedProduct &&
            item.productId.variety === selectedVariety
        );

        if (existingProductIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingProductIndex] = {
            ...updatedItems[existingProductIndex],
            quantity: Number(quantity),
            total:
              product.pricePerUnit *
              Number(quantity) *
              (1 + product.vatRate / 100),
          };
          return { ...prev, items: updatedItems };
        }

        const newItem = {
          productId: {
            _id: product._id,
            name: product.name,
            variety: product.variety,
          },
          quantity: Number(quantity),
          pricePerUnit: product.sellingPrice,
          vatRate: product.vatRate,
          total:
            product.pricePerUnit *
            Number(quantity) *
            (1 + product.vatRate / 100),
        };

        return {
          ...prev,
          items: [...items, newItem],
        };
      });
    }
  }

  function removeItem(productId, varietyId) {
    if (productId && varietyId) {
      console.log(productId, varietyId);
      setDocument((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) =>
            item.productId._id !== productId ||
            item.productId.variety !== varietyId
        ),
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!document) {
      toast.error("Dokument nije učitan");
      return;
    }

    try {
      if (document.type === "otkup") {
        const nabavkaResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/products/buy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              documentId: document._id,
              items: document.items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
              })),
            }),
          }
        );

        if (!nabavkaResponse.ok) {
          const errData = await nabavkaResponse.json();
          toast.error(errData.message || "Greška pri slanju nabavke");
          return;
        }
      }

      if (document.type === "prodaja") {
        const prodajaResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/products/sell`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              documentId: document._id,
              items: document.items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
              })),
            }),
          }
        );

        if (!prodajaResponse.ok) {
          const errData = await prodajaResponse.json();
          toast.error(errData.message || "Greška pri slanju prodaje");
          return;
        }
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/documents/${document._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            type: document.type,
            date: document.date,
            partnerId: document.partnerId,
            items: document.items.map((item) => ({
              _id: item._id,
              productId: item.productId._id,
              quantity: item.quantity,
              pricePerUnit: item.pricePerUnit,
              vatRate: item.vatRate,
              total: item.total,
            })),
            transportCost: document.transportCost,
            notes: document.notes,
            status: document.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message || "Došlo je do greške prilikom izmene dokumenta"
        );
        return;
      }

      toast.success("Dokument je uspešno izmenjen");
      navigate("/documents");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  if (!document) {
    return <Loader />;
  }

  return (
    <div className="create-form">
      <form onSubmit={handleSubmit}>
        {initStatus !== "otpremljen" && document.type !== "otpis" && (
          <div className="form-group">
            <label htmlFor="partner">Partner:</label>
            <select
              id="partner"
              name="partner"
              required
              value={document.partner._id || ""}
              onChange={(e) =>
                setDocument({
                  ...document,
                  partner: {
                    ["_id"]: e.target.value,
                  },
                })
              }
            >
              <option value="" disabled>
                -- Izaberite partnera --
              </option>
              {partners
                .filter(
                  (partner) =>
                    (document.type === "otkup" &&
                      partner.type === "poljoprivrednik") ||
                    (document.type === "prodaja" && partner.type === "kupac")
                )
                .map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name} - {partner.pibOrJmbg}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Stavke:</label>
          <ul>
            {document.items.length > 0 &&
              document.items.map((item) => (
                <li key={item.productId._id}>
                  <span>
                    {item.productId.name} - {item.productId.variety} -{" "}
                    {item.quantity} kg
                  </span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(item.productId._id, item.productId.variety)
                    }
                  >
                    <Trash />
                  </button>
                </li>
              ))}
          </ul>
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
                {products.map((item) => (
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
                  {products.filter((item) => item.name === selectedProduct).map((item) => (
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
              title="Dodaj stavku"
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
            value={document.transportCost || ""}
            onChange={(e) =>
              setDocument({ ...document, transportCost: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Napomene:</label>
          <textarea
            id="notes"
            name="notes"
            value={document.notes || ""}
            onChange={(e) =>
              setDocument({ ...document, notes: e.target.value })
            }
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            required
            value={document.status || ""}
            onChange={(e) =>
              setDocument({ ...document, status: e.target.value })
            }
          >
            <option value="" disabled>
              -- Izaberite status --
            </option>
            <option value="u pripremi">U pripremi</option>
            <option value="potvrđen">Potvrđen</option>
            <option value="otpremljen">Otpremljen</option>
            <option value="storniran">Storniran</option>
          </select>
        </div>

        <button type="submit">Izmeni Dokument</button>
      </form>
    </div>
  );
}
