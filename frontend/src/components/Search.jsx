import "./search.css";
export default function Search({ term, setTerm }) {
  function handleSearch() {}
  return (
    <div className="search-container">
      <div className="action-group crud-btns">
        <button className="action-btn btn-create">btn1</button>
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
