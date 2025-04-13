import "./search.css";
import { useNavigate } from "react-router-dom";
export default function Search({ term, setTerm, type }) {
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
          Dodaj {type}
        </button>
        <button className="action-btn btn-update">btn2</button>
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
        <button className="action-btn btn-pdf">btn3</button>
        <button className="action-btn btn-confirm">btn4</button>
      </div>
    </div>
  );
}
