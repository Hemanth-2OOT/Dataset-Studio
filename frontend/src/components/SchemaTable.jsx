import { useState, useEffect } from "react";

export default function SchemaTable({ schema, onChange }) {
  const [columns, setColumns] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (schema?.columns) {
      setColumns(schema.columns);
    }
  }, [schema?.columns]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLocalChange = (index, field, value) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  };

  const handlePushUpdate = () => {
    onChange(columns);
  };

  const addColumn = () => {
    const updated = [...columns, { name: "new_column", type: "string", semantic_type: "" }];
    setColumns(updated);
    onChange(updated);
  };

  const removeColumn = (index) => {
    const updated = columns.filter((_, i) => i !== index);
    setColumns(updated);
    onChange(updated);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ 
        overflowX: "auto", 
        border: "1px solid #e2e8f0", 
        borderRadius: "8px", 
        background: "#ffffff",
        width: "100%",
        WebkitOverflowScrolling: "touch"
      }}>
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          fontSize: "14px", 
          textAlign: "left", 
          color: "#334155",
          minWidth: "700px"
        }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Column Label Name</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Primitive Type Mapping</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Semantic Rules Parameter</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ divideY: "1px solid #cbd5e1" }}>
            {columns.map((col, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => handleLocalChange(idx, "name", e.target.value)}
                    onBlur={handlePushUpdate}
                    style={{ width: "90%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#0f172a", fontFamily: "monospace", outline: "none" }}
                  />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <select
                    value={col.type}
                    onChange={(e) => {
                      handleLocalChange(idx, "type", e.target.value);
                      setTimeout(handlePushUpdate, 50);
                    }}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", background: "#ffffff", outline: "none", width: "100%" }}
                  >
                    <option value="string">String (text)</option>
                    <option value="integer">Integer (int)</option>
                    <option value="float">Decimal (float)</option>
                    <option value="boolean">Boolean (bool)</option>
                    <option value="date">Timestamp (date)</option>
                  </select>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="text"
                    value={col.semantic_type || ""}
                    placeholder="Optional: e.g., Email, Full Name"
                    onChange={(e) => handleLocalChange(idx, "semantic_type", e.target.value)}
                    onBlur={handlePushUpdate}
                    style={{ width: "90%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", outline: "none", background: col.semantic_type ? "#ffffff" : "#fdfdfd" }}
                  />
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button 
                    onClick={() => removeColumn(idx)}
                    style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "background 0.2s" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={addColumn}
        style={{ 
          marginTop: "16px", 
          background: "#10b981", 
          color: "#ffffff", 
          border: "none", 
          padding: "10px 16px", 
          borderRadius: "8px", 
          fontSize: "13px", 
          fontWeight: "600", 
          cursor: "pointer", 
          width: isMobile ? "100%" : "auto" 
        }}
      >
        ➕ Append Parameter Node
      </button>
    </div>
  );
}