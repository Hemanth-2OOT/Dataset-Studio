import { useState, useEffect } from "react";

export default function SchemaTable({ schema, onChange }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (schema?.columns) {
      setColumns(schema.columns);
    }
  }, [schema?.columns]);

  const handleLocalChange = (index, field, value) => {
    const updated = [...columns];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setColumns(updated);
  };

  const handlePushUpdate = () => {
    onChange(columns);
  };

  const addColumn = () => {
    const updated = [
      ...columns,
      {
        name: "new_column",
        type: "string",
        semantic_type: "",
      },
    ];
    setColumns(updated);
    onChange(updated);
  };

  const removeColumn = (index) => {
    const updated = columns.filter((_, i) => i !== index);
    setColumns(updated);
    onChange(updated);
  };

  return (
    <>
      <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#ffffff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left", color: "#334155" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Column Label Name</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Primitive Type Mapping</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569" }}>Semantic Rules (Context)</th>
              <th style={{ padding: "14px 16px", fontWeight: "600", color: "#475569", textAlign: "center" }}>Operations</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="text"
                    value={col.name || ""}
                    onChange={(e) => handleLocalChange(idx, "name", e.target.value)}
                    onBlur={handlePushUpdate}
                    style={{ width: "90%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", outline: "none" }}
                  />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <select
                    value={col.type || "string"}
                    onChange={(e) => {
                      handleLocalChange(idx, "type", e.target.value);
                      const updated = [...columns];
                      updated[idx].type = e.target.value;
                      onChange(updated);
                    }}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", background: "#ffffff", outline: "none", width: "100%", maxWidth: "160px" }}
                  >
                    <option value="string">string</option>
                    <option value="integer">integer</option>
                    <option value="float">float</option>
                    <option value="boolean">boolean</option>
                    <option value="date">date</option>
                  </select>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="text"
                    value={col.semantic_type || ""}
                    placeholder="Optional: e.g., Email, Full Name, US Zip Code"
                    onChange={(e) => handleLocalChange(idx, "semantic_type", e.target.value)}
                    onBlur={handlePushUpdate}
                    style={{ width: "95%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", outline: "none", background: col.semantic_type ? "#ffffff" : "#fdfdfd" }}
                  />
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button 
                    onClick={() => removeColumn(idx)}
                    style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "background 0.2s" }}
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
        style={{ marginTop: "16px", background: "#10b981", color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 4px rgba(16,185,129,0.15)" }}
      >
        + Add Property Field
      </button>
    </>
  );
}