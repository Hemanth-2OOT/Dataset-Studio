import { useState } from "react";

export default function DatasetTable({ rows }) {
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>📂</span>
        No active rows generated for this schema branch yet.
      </div>
    );
  }

  const columns = Object.keys(rows[0]);
  const totalPages = Math.ceil(rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
      <div style={{ overflowX: "auto", maxHeight: "500px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#334155", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col) => (
                <th key={col} style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  padding: "12px 16px",
                  fontWeight: "600",
                  color: "#475569",
                  borderBottom: "1px solid #e2e8f0",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap"
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{
                background: rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc",
                transition: "background 0.15s"
              }}>
                {columns.map((col) => {
                  const isNull = row[col] === null || row[col] === undefined;
                  return (
                    <td key={col} style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #f1f5f9",
                      whiteSpace: "nowrap",
                      color: isNull ? "#cbd5e1" : "#334155",
                      fontFamily: typeof row[col] === "number" ? "Courier, monospace" : "inherit"
                    }}>
                      {isNull ? "null" : String(row[col])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Compact Pagination Footer */}
      {rows.length > pageSize && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 24px",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          fontSize: "13px",
          color: "#64748b"
        }}>
          <div>
            Showing <strong style={{ color: "#0f172a" }}>{startIndex + 1}</strong>–<strong style={{ color: "#0f172a" }}>{Math.min(startIndex + pageSize, rows.length)}</strong> of {rows.length} rows
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              style={{
                padding: "6px 12px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
                fontSize: "12px",
                fontWeight: "500",
                color: "#334155"
              }}
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
              style={{
                padding: "6px 12px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
                fontSize: "12px",
                fontWeight: "500",
                color: "#334155"
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}