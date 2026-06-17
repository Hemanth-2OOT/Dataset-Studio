import { useState, useEffect } from "react";

export default function DatasetTable({ rows }) {
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", width: "100%" }}>
      <div style={{ overflowX: "auto", maxHeight: "500px", WebkitOverflowScrolling: "touch", width: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#334155", textAlign: "left", minWidth: "800px" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col) => (
                <th key={col} style={{ position: "sticky", top: 0, background: "#f8fafc", padding: "12px 16px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #e2e8f0", zIndex: 10 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                {columns.map((col) => (
                  <td key={col} style={{ padding: "10px 16px", fontFamily: typeof row[col] === "number" ? "monospace" : "inherit" }}>{String(row[col] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center", 
        justifyContent: "between", 
        padding: "14px 16px", 
        borderTop: "1px solid #e2e8f0", 
        background: "#ffffff",
        gap: isMobile ? "12px" : "0px"
      }}>
        <div style={{ fontSize: "13px", color: "#64748b", width: isMobile ? "100%" : "auto", textAlign: isMobile ? "center" : "left" }}>
          Showing <strong style={{ color: "#0f172a" }}>{startIndex + 1}</strong> to <strong style={{ color: "#0f172a" }}>{Math.min(startIndex + pageSize, rows.length)}</strong> of {rows.length} rows
        </div>
        <div style={{ display: "flex", gap: "6px", width: isMobile ? "100%" : "auto", justifyContent: "center" }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ padding: "6px 12px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, fontSize: "12px", fontWeight: "500", color: "#334155", flexGrow: isMobile ? 1 : 0 }}
          >
            Previous
          </button>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ padding: "6px 12px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, fontSize: "12px", fontWeight: "500", color: "#334155", flexGrow: isMobile ? 1 : 0 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}