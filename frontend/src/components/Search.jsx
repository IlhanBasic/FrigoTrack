import "./search.css";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";

export default function Search({
  term,
  setTerm,
  type,
  exportToPDF,
  exportToExcel,
}) {
  const navigate = useNavigate();

  function handleChangeUrl() {
    if (
      type === "partnera" ||
      type === "proizvod" ||
      type === "dokument" ||
      type === "placanje" ||
      type === "prostor"
    ) {
      navigate(`create`);
    }
  }

  return (
    <div className="search-container">
      <div className="action-group crud-btns">
        <button onClick={handleChangeUrl} className="action-btn btn-create">
          <Plus /> Dodaj {type}
        </button>
      </div>

      <div className="search-group">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="search-input"
          placeholder="kucaj..."
        />
      </div>

      <div className="action-group pdf-btns">
        <button onClick={exportToPDF} className="action-btn btn-pdf">
          <Download /> Export PDF
        </button>
        <button onClick={exportToExcel} className="action-btn btn-confirm">
          <Download /> Export Excel
        </button>
      </div>
    </div>
  );
}
