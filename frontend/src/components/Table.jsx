import "./table.css";
import Search from "./Search";
import { useState, useEffect, useRef } from "react";
import { TABLEHEADERS } from "../data/data.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
const TABLES = {
  partneri: "partners",
  proizvodi: "products",
  dokumenti: "documents",
  placanja: "payments",
  prostori: "coldrooms",
};
import { useSelector } from "react-redux";
export default function Table({ items, type }) {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const tableRef = useRef(null);
  const exportToPDF = () => {
    if (!filteredItems.length) return alert("Nema podataka za export.");

    const doc = new jsPDF();

    const headers = Object.keys(items[0]).filter(
      (key) =>
        typeof items[0][key] !== "object" &&
        !["_id", "createdAt", "updatedAt", "__v"].includes(key)
    );

    const tableHeaders = headers.map((key) => TABLEHEADERS[key] || key);

    const tableData = filteredItems.map((item) =>
      headers.map((key) => {
        if (
          [
            "date",
            "startDate",
            "endDate",
            "expiryDate",
            "paymentDate",
          ].includes(key)
        ) {
          return new Intl.DateTimeFormat("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(item[key]));
        }
        return String(item[key]);
      })
    );

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      styles: { fontSize: 8 },
      margin: { top: 20 },
      didDrawPage: () => {
        doc.text(`${type} - ${new Date().toLocaleDateString()}`, 14, 10);
      },
    });

    doc.save(
      `${type}_${filteredItems.length}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  const exportToExcel = () => {
    const headers = Object.keys(items[0]).filter(
      (key) =>
        typeof items[0][key] !== "object" &&
        !["_id", "createdAt", "updatedAt", "__v"].includes(key)
    );

    const tableHeaders = headers.map((key) => ({
      header: TABLEHEADERS[key] || key,
    }));

    const tableData = filteredItems.map((item) => {
      const row = {};
      headers.forEach((key) => {
        if (
          [
            "date",
            "startDate",
            "endDate",
            "expiryDate",
            "paymentDate",
          ].includes(key)
        ) {
          row[TABLEHEADERS[key] || key] = new Intl.DateTimeFormat("hr-HR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(item[key]));
        } else {
          row[TABLEHEADERS[key] || key] = item[key];
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${type}`);

    XLSX.writeFile(
      workbook,
      `${type}_${filteredItems.length}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  };

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

  const handleSort = (key) => {
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
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <>
        <Search
          term={term}
          setTerm={setTerm}
          type={type}
          exportToPDF={exportToPDF}
          exportToExcel={exportToExcel}
        />
        <p>Tabela je prazna.</p>
        <hr />
      </>
    );
  }

  const headers = Object.keys(items[0]);
  async function deleteItem(id) {
    if (!window.confirm("Da li ste sigurni da zelite obrisati?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${TABLES[type]}/${id}`,
        { method: "DELETE", credentials: "include" ,headers:{
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }}
      );
      if (response.ok) {
        window.location.reload();
        toast.success("Uspesno obrisano!");
      } else {
        const error = await response.json();
        console.log(error);
        toast.error("Greska prilikom brisanja!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Neautorizovani pristup!");
      } else {
        console.log(error);
        toast.error("Greska prilikom brisanja!");
      }
    }
  }
  function editItem(id) {
    navigate("edit/" + id);
  }

  return (
    <>
      <Search
        term={term}
        setTerm={setTerm}
        type={type}
        exportToPDF={exportToPDF}
        exportToExcel={exportToExcel}
      />
      <div className="table-wrapper" ref={tableRef}>
        <table className="table">
          <thead>
            <tr>
              {type !== "placanja" && <th>Akcije</th>}
              {headers
                .filter(
                  (key) =>
                    ![
                      "_id",
                      "createdAt",
                      "updatedAt",
                      "__v",
                      "method",
                    ].includes(key) &&
                    (type === "placanja"
                      ? true
                      : typeof items[0][key] !== "object")
                )
                .map((key) => (
                  <th onClick={() => handleSort(key)} key={key}>
                    {type === "placanja" && key === "document"
                      ? "Broj dokumenta"
                      : TABLEHEADERS[key] || key}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item._id || index}>
                {type === "partneri" ||
                type === "proizvodi" ||
                type === "prostori" ||
                type === "dokumenti" ? (
                  <td className="action-ceil">
                    {type !== "dokumenti" && (
                      <button
                        className="delete-button"
                        onClick={() => deleteItem(item._id)}
                      >
                        <Trash2 />
                      </button>
                    )}
                    <button
                      className="edit-button"
                      onClick={() => {
                        editItem(item._id);
                      }}
                    >
                      <Edit />
                    </button>
                  </td>
                ) : null}
                {headers
                  .filter(
                    (key) =>
                      typeof item[key] !== "object" ||
                      (type === "placanja" && key === "document")
                  )
                  .filter(
                    (key) =>
                      ![
                        "_id",
                        "createdAt",
                        "updatedAt",
                        "__v",
                        "method",
                      ].includes(key)
                  )
                  .map((key) => (
                    <td key={key}>
                      {type === "placanja" && key === "document"
                        ? item.document?.documentNumber || "—"
                        : [
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
                        : key === "isActive" || key === "isPaid" || key === "isVATRegistered"
                        ? item[key]
                          ? "DA"
                          : "NE"
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
