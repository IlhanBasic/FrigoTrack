import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Star,
  Award,
} from "lucide-react";
import "./stats.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SalesCharts = ({ documents }) => {
  const salesDocs = documents.filter((doc) => doc.type === "prodaja");

  const lineChartData = [];

  salesDocs.forEach((doc) => {
    const date = new Date(doc.date).toLocaleDateString();
    doc.items.forEach((item) => {
      const existing = lineChartData.find((d) => d.date === date);
      if (existing) {
        existing.total += item.total;
      } else {
        lineChartData.push({ date, total: item.total });
      }
    });
  });

  lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const pieDataMap = {};

  salesDocs.forEach((doc) => {
    doc.items.forEach((item) => {
      const key = `${item.productId.name} (${item.productId.variety})`;
      if (pieDataMap[key]) {
        pieDataMap[key] += item.total;
      } else {
        pieDataMap[key] = item.total;
      }
    });
  });

  const pieChartData = Object.entries(pieDataMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <>
      <div className="chart-container">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LineChartIcon size={20} />
          Trend prodaje po proizvodima
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="Ukupan prihod"
              stroke="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PieChartIcon size={20} />
          Raspodela prihoda po proizvodima
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieChartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default function Stats() {
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/partners`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPartners(data);
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchOrders() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/documents`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrders(data.data);
      } catch (err) {
        console.log(err);
      }
    }
    async function fetchProducts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPartners();
    fetchOrders();
    fetchProducts();
  }, []);

  const topProducts = [
    { name: "Jabuke", quantity: "125,000 kg", revenue: "€62,500" },
    { name: "Maline", quantity: "138,230 kg", revenue: "€96,761" },
    { name: "Višnje", quantity: "95,000 kg", revenue: "€47,500" },
  ];

  const partnerStats = partners.map((partner) => {
    const currentPartnerDocuments = orders.filter(
      (doc) => doc.partner._id === partner._id
    );

    const revenue = currentPartnerDocuments.reduce((acc, doc) => {
      const docTotal = doc.items.reduce((sum, item) => sum + item.total, 0);
      return acc + docTotal;
    }, 0);

    return {
      name: partner.name,
      pibOrJmbg: partner.pibOrJmbg,
      orders: currentPartnerDocuments.length,
      revenue,
    };
  });
  const productStats = products.map((product) => {
    let totalQuantity = 0;
    let totalRevenue = 0;

    orders.forEach((doc) => {
      doc.items.forEach((item) => {
        if (item.productId._id === product._id) {
          totalQuantity += item.quantity;
          totalRevenue += item.total;
        }
      });
    });

    return {
      name: `${product.name} - ${product.variety}`,
      quantity: totalQuantity,
      revenue: totalRevenue,
    };
  });

  return (
    <div className="stats-container">
      <section className="stats-header">
        <h1>Statistika i Analitika</h1>
        <p>Detaljan pregled poslovanja, trendova i performansi</p>
      </section>
      <div className="stats-grid">
        <div className="stats-card">
          <h3>
            <DollarSign size={20} />
            Ukupan prihod
          </h3>
          <div className="value">
            {new Intl.NumberFormat("sr-RS", {
              style: "currency",
              currency: "RSD",
            }).format(
              orders
                .filter((order) => order.type === "prodaja")
                .reduce(
                  (sum, order) =>
                    sum +
                    order.items.reduce((acc, item) => acc + item.total, 0),
                  0
                )
            )}
          </div>
          <div className="subtitle">+15.8% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <ShoppingCart size={20} />
            Prosečna vrednost porudžbine
          </h3>
          <div className="value">
            {new Intl.NumberFormat("sr-RS", {
              style: "currency",
              currency: "RSD",
            }).format(
              orders.length > 0
                ? orders
                    .filter((order) => order.type === "prodaja")
                    .reduce(
                      (sum, order) =>
                        sum +
                        order.items.reduce((acc, item) => acc + item.total, 0),
                      0
                    ) /
                    orders.filter((order) => order.type === "prodaja").length
                : 0
            )}
          </div>
          <div className="subtitle">+5.3% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <Package size={20} />
            Ukupno porudžbina
          </h3>
          <div className="value">
            {orders.filter((order) => order.type === "prodaja").length}
          </div>
          <div className="subtitle">+12% od prošlog perioda</div>
        </div>

        <div className="stats-card">
          <h3>
            <Users size={20} />
            Aktivni partneri
          </h3>
          <div className="value">
            {partners.filter((partner) => partner.isActive).length}
          </div>
          <div className="subtitle">+8% od prošlog perioda</div>
        </div>
      </div>

      <SalesCharts documents={orders} />

      <div className="chart-container">
        <h3>
          <Star size={20} />
          Najprodavaniji proizvodi
        </h3>
        <div className="top-items">
          {productStats
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3)
            .map((product, index) => (
              <div key={index} className="top-item">
                <div className="top-item-icon">
                  <Package size={20} />
                </div>
                <div className="top-item-info">
                  <h4>{product.name}</h4>
                  <p>
                    {(product.quantity / 1000.0).toFixed(2)} T |{" "}
                    {new Intl.NumberFormat("sr-RS", {
                      style: "currency",
                      currency: "RSD",
                    }).format(product.revenue)}
                  </p>
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
          {partnerStats
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3)
            .map((partner, index) => (
              <div key={index} className="top-item">
                <div className="top-item-icon">
                  <Users size={20} />
                </div>
                <div className="top-item-info">
                  <h4>{partner.name}</h4>
                  <p>
                    {partner.orders} porudžbina |{" "}
                    {new Intl.NumberFormat("sr-RS", {
                      style: "currency",
                      currency: "RSD",
                    }).format(partner.revenue)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
