import { useEffect, useState } from "react";
import { BarChart, TrendingUp, TrendingDown, Thermometer } from "lucide-react";
import "./home.css";
import { useSelector } from "react-redux";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [products, setProducts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [coldRooms, setColdRooms] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setProducts(data);
        setSupplies([...data]);
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchOrders() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/documents`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setDocuments(data.data);
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchColdRooms() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/coldrooms`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setColdRooms(data.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProducts();
    fetchOrders();
    fetchColdRooms();
  }, []);

  function handleFilterByProduct(product) {
    setSelectedProduct(product);
    let filtered = [...products];
    if (product !== "all") {
      filtered = filtered.filter((item) => item.name === product);
    }
    if (selectedStatus === "low") {
      filtered = filtered.filter(
        (item) => item.minStockKg > item.currentStockKg
      );
    } else if (selectedStatus === "optimal") {
      filtered = filtered.filter(
        (item) => item.minStockKg < item.currentStockKg
      );
    }
    setSupplies(filtered);
  }

  function handleFilterByStatus(status) {
    setSelectedStatus(status);
    let filtered = [...products];
    if (selectedProduct !== "all") {
      filtered = filtered.filter((item) => item.name === selectedProduct);
    }
    if (status === "low") {
      filtered = filtered.filter(
        (item) => item.minStockKg > item.currentStockKg
      );
    } else if (status === "optimal") {
      filtered = filtered.filter(
        (item) => item.minStockKg < item.currentStockKg
      );
    }
    setSupplies(filtered);
  }

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Dobrodošli {user.username}</h1>
        <p>Pregled trenutnog stanja, zaliha i metrika</p>
      </section>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Ukupne zalihe</h3>
          <div className="value">
            {products.reduce(
              (acc, product) => acc + product.currentStockKg,
              0
            ) / 1000.0}{" "}
            t
          </div>
          <div className="trend">
            <TrendingUp size={16} />
            +5.3% od prošle nedelje
          </div>
        </div>

        <div className="metric-card">
          <h3>Raspoloživi kapacitet</h3>
          <div className="value">
            {coldRooms.reduce(
              (acc, room) => acc + (room.capacityKg - room.currentLoadKg),
              0
            ) / 1000.0}{" "}
            t
          </div>
          <div className="trend negative">
            <TrendingDown size={16} />
            -8% od prošlog meseca
          </div>
        </div>

        <div className="metric-card">
          <h3>Aktivne porudžbine</h3>
          <div className="value">
            {documents.filter((doc) => doc.type === "otkup").length}
          </div>
          <div className="trend">
            <TrendingUp size={16} />
            +12% od prošle nedelje
          </div>
        </div>

        <div className="metric-card">
          <h3>Prihod ovog meseca</h3>
          <div className="value">
            {new Intl.NumberFormat("sr-RS", {
              style: "currency",
              currency: "RSD",
            }).format(
              documents
                .filter((doc) => doc.type === "prodaja" && new Date() - new Date(doc.date) <= 30 * 24 * 60 * 60 * 1000)
                .reduce(
                  (acc, doc) =>
                    acc + doc.items.reduce((acc, item) => acc + item.total, 0),
                  0
                )
            )}
          </div>
          <div className="trend">
            <TrendingUp size={16} />
            +15.8% od prošlog meseca
          </div>
        </div>
      </div>

      <section className="stock-section">
        <div className="stock-header">
          <h2>Pregled zaliha</h2>
          <div className="stock-filters">
            <select
              value={selectedProduct}
              onChange={(e) => handleFilterByProduct(e.target.value)}
            >
              <option value="all">Svi proizvodi</option>
              {[...new Set(products.map((item) => item.name))].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => handleFilterByStatus(e.target.value)}
            >
              <option value="all">Svi statusi</option>
              <option value="low">Nizak nivo</option>
              <option value="optimal">Optimalan</option>
            </select>
          </div>
        </div>

        <table className="stock-table">
          <thead>
            <tr>
              <th>Proizvod</th>
              <th>Količina</th>
              <th>Datum isteka</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.name} - {item.variety}
                </td>
                <td>{item.currentStockKg / 1000.0} t</td>
                <td>
                  {new Intl.DateTimeFormat("hr-HR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(new Date(item.expiryDate))}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      item.minStockKg > item.currentStockKg ? "low" : "optimal"
                    }`}
                  >
                    {item.minStockKg > item.currentStockKg
                      ? "Nizak nivo"
                      : "Optimalan"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="chart-section">
        <div className="chart-card">
          <h3>Iskorišćenost kapaciteta po komorama</h3>
          <div className="chart-placeholder">
            <BarChart size={32} />
            <span style={{ marginLeft: "1rem" }}>
              Graf će biti implementiran sa pravim podacima
            </span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Temperatura po komorama (24h)</h3>
          <div className="chart-placeholder">
            <Thermometer size={32} />
            <span style={{ marginLeft: "1rem" }}>
              Graf će biti implementiran sa pravim podacima
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
