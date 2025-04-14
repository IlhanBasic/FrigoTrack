import { useState } from "react";
import { BarChart, TrendingUp, TrendingDown, Package, Thermometer, Users, DollarSign } from "lucide-react";
import "./home.css";
import {useSelector} from "react-redux";
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const user = useSelector((state) => state.auth.user);
  // Mock data - replace with real data from your API
  const metrics = {
    totalStock: "458,230 kg",
    availableCapacity: "75%",
    activeOrders: "24",
    revenue: "€45,890",
  };

  const stockData = [
    {
      id: 1,
      product: "Jabuke",
      quantity: "125,000 kg",
      temperature: "-2°C",
      status: "optimal",
      lastUpdated: "2024-03-15",
    },
    {
      id: 2,
      product: "Kruške",
      quantity: "85,000 kg",
      temperature: "-1.5°C",
      status: "high",
      lastUpdated: "2024-03-15",
    },
    {
      id: 3,
      product: "Šljive",
      quantity: "15,000 kg",
      temperature: "-1°C",
      status: "low",
      lastUpdated: "2024-03-14",
    },
    {
      id: 4,
      product: "Višnje",
      quantity: "95,000 kg",
      temperature: "-2°C",
      status: "optimal",
      lastUpdated: "2024-03-15",
    },
    {
      id: 5,
      product: "Maline",
      quantity: "138,230 kg",
      temperature: "-18°C",
      status: "high",
      lastUpdated: "2024-03-15",
    },
  ];

  const filteredStock = stockData.filter(item => {
    if (selectedProduct !== "all" && item.product !== selectedProduct) return false;
    if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Dobrodošli {user.username}</h1>
        <p>Pregled trenutnog stanja, zaliha i metrika</p>
      </section>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Ukupne zalihe</h3>
          <div className="value">{metrics.totalStock}</div>
          <div className="trend">
            <TrendingUp size={16} />
            +5.3% od prošle nedelje
          </div>
        </div>

        <div className="metric-card">
          <h3>Raspoloživi kapacitet</h3>
          <div className="value">{metrics.availableCapacity}</div>
          <div className="trend negative">
            <TrendingDown size={16} />
            -8% od prošlog meseca
          </div>
        </div>

        <div className="metric-card">
          <h3>Aktivne porudžbine</h3>
          <div className="value">{metrics.activeOrders}</div>
          <div className="trend">
            <TrendingUp size={16} />
            +12% od prošle nedelje
          </div>
        </div>

        <div className="metric-card">
          <h3>Prihod ovog meseca</h3>
          <div className="value">{metrics.revenue}</div>
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
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="all">Svi proizvodi</option>
              {stockData.map(item => (
                <option key={item.id} value={item.product}>
                  {item.product}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Svi statusi</option>
              <option value="low">Nizak nivo</option>
              <option value="optimal">Optimalan</option>
              <option value="high">Visok nivo</option>
            </select>
          </div>
        </div>

        <table className="stock-table">
          <thead>
            <tr>
              <th>Proizvod</th>
              <th>Količina</th>
              <th>Temperatura</th>
              <th>Status</th>
              <th>Poslednje ažuriranje</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((item) => (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>{item.temperature}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    {item.status === "low" && "Nizak nivo"}
                    {item.status === "optimal" && "Optimalan"}
                    {item.status === "high" && "Visok nivo"}
                  </span>
                </td>
                <td>{new Date(item.lastUpdated).toLocaleDateString("sr-RS")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="chart-section">
        <div className="chart-card">
          <h3>Iskorišćenost kapaciteta po komorama</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
            <BarChart size={32} />
            <span style={{ marginLeft: "1rem" }}>Graf će biti implementiran sa pravim podacima</span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Temperatura po komorama (24h)</h3>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
            <Thermometer size={32} />
            <span style={{ marginLeft: "1rem" }}>Graf će biti implementiran sa pravim podacima</span>
          </div>
        </div>
      </section>
    </div>
  );
}