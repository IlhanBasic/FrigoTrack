import { useState } from "react";
import {
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Star,
  Award
} from "lucide-react";
import "./stats.css";

export default function Stats() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - replace with real data from your API
  const statsData = {
    totalRevenue: "€245,890",
    averageOrderValue: "€5,240",
    totalOrders: "47",
    activeCustomers: "28",
  };

  const topProducts = [
    { name: "Jabuke", quantity: "125,000 kg", revenue: "€62,500" },
    { name: "Maline", quantity: "138,230 kg", revenue: "€96,761" },
    { name: "Višnje", quantity: "95,000 kg", revenue: "€47,500" },
  ];

  const topPartners = [
    { name: "Fruit d.o.o.", orders: "15", revenue: "€85,000" },
    { name: "Fresh Export", orders: "12", revenue: "€65,000" },
    { name: "Agro Trgovina", orders: "8", revenue: "€45,000" },
  ];

  return (
    <div className="stats-container">
      <section className="stats-header">
        <h1>Statistika i Analitika</h1>
        <p>Detaljan pregled poslovanja, trendova i performansi</p>
      </section>

      <div className="period-selector">
        <button
          className={`period-button ${selectedPeriod === "week" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("week")}
        >
          Nedelja
        </button>
        <button
          className={`period-button ${selectedPeriod === "month" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("month")}
        >
          Mesec
        </button>
        <button
          className={`period-button ${selectedPeriod === "quarter" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("quarter")}
        >
          Kvartal
        </button>
        <button
          className={`period-button ${selectedPeriod === "year" ? "active" : ""}`}
          onClick={() => setSelectedPeriod("year")}
        >
          Godina
        </button>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <h3>
            <DollarSign size={20} />
            Ukupan prihod
          </h3>
          <div className="value">{statsData.totalRevenue}</div>
          <div className="subtitle">+15.8% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <ShoppingCart size={20} />
            Prosečna vrednost porudžbine
          </h3>
          <div className="value">{statsData.averageOrderValue}</div>
          <div className="subtitle">+5.3% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <Package size={20} />
            Ukupno porudžbina
          </h3>
          <div className="value">{statsData.totalOrders}</div>
          <div className="subtitle">+12% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <Users size={20} />
            Aktivni partneri
          </h3>
          <div className="value">{statsData.activeCustomers}</div>
          <div className="subtitle">+8% od prošlog perioda</div>
        </div>
      </div>

      <div className="chart-container">
        <h3>
          <LineChart size={20} />
          Trend prodaje po proizvodima
        </h3>
        <div className="chart-placeholder">
          Ovde će biti prikazan linijski grafikon trenda prodaje
        </div>
      </div>

      <div className="chart-container">
        <h3>
          <PieChart size={20} />
          Raspodela prihoda po proizvodima
        </h3>
        <div className="chart-placeholder">
          Ovde će biti prikazan pie chart raspodele prihoda
        </div>
      </div>

      <div className="chart-container">
        <h3>
          <Star size={20} />
          Najprodavaniji proizvodi
        </h3>
        <div className="top-items">
          {topProducts.map((product, index) => (
            <div key={index} className="top-item">
              <div className="top-item-icon">
                <Package size={20} />
              </div>
              <div className="top-item-info">
                <h4>{product.name}</h4>
                <p>{product.quantity} | {product.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h3>
          <Award size={20} />
          Najbolji poslovni partneri
        </h3>
        <div className="top-items">
          {topPartners.map((partner, index) => (
            <div key={index} className="top-item">
              <div className="top-item-icon">
                <Users size={20} />
              </div>
              <div className="top-item-info">
                <h4>{partner.name}</h4>
                <p>{partner.orders} porudžbina | {partner.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}