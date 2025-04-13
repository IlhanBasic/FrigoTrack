import "./table.css";
import Search from "./Search";
import { useState, useEffect } from "react";
import { TABLEHEADERS } from "../data/data.js";
export default function Table({ items,type }) {
  const [term, setTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (term.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        Object.keys(item).some((key) => {
          const value = String(item[key]).toLowerCase();
          return value.includes(term.toLowerCase());
        })
      );
      setFilteredItems(filtered);
    }
  }, [term, items]);

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <>
      <Search term={term} setTerm={setTerm} type={type} />
        <p>Tabela je prazna.</p>
        <hr />
      </>
    );
  }

  const headers = Object.keys(items[0]);
  function handleSort(key) {
    setFilteredItems((prevState) => {
      let asc = [...prevState].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        }
        return String(aValue).localeCompare(String(bValue));
      });
      return asc;
    });
  }
  return (
    <>
      <Search term={term} setTerm={setTerm} type={type} />
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {headers
                .filter(
                  (key) =>
                    typeof items[0][key] !== "object" &&
                    !["_id", "createdAt", "updatedAt", "__v"].includes(key)
                )
                .map((key) => (
                  <th onClick={() => handleSort(key)} key={key}>
                    {TABLEHEADERS[key] || key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item._id || index}>
                {headers
                  .filter(
                    (key) =>
                      typeof item[key] !== "object" &&
                      !["_id", "createdAt", "updatedAt", "__v"].includes(key)
                  )
                  .map((key) => (
                    <td key={key}>
                      {[
                        "date",
                        "startDate",
                        "endDate",
                        "expiryDate",
                        "paymentDate",
                      ].includes(key)
                        ? new Intl.DateTimeFormat("hr-HR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(new Date(item[key]))
                        : String(item[key])}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
