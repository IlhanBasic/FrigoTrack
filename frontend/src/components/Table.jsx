import "./table.css";
import Search from "./Search";
import { useState, useEffect, useRef } from "react";
import { TABLEHEADERS } from "../data/data.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";

export default function Table({ items, type }) {
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

