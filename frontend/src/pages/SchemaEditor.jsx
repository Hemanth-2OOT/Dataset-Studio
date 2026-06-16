import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchemaTable from "../components/SchemaTable";

export default function SchemaEditor() {
  const navigate = useNavigate();

  const data = JSON.parse(localStorage.getItem("schema"));

  if (!data) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#64748b", fontFamily: "system-ui, sans-serif" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>No active schema session found</h3>
        <p style={{ fontSize: "14px", marginTop: "4px" }}>Please go back to the Prompt window to create one.</p>
      </div>
    );
  }

  const [schema, setSchema] = useState(data.schema);

  const generateDataset = () => {
    const updatedData = {
      ...data,
      schema,
    };

    localStorage.setItem("schema", JSON.stringify(updatedData));
    localStorage.setItem("sessionId", data.session_id);

    navigate("/preview");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Dynamic Header Section */}
      <div style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        marginBottom: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)"
      }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#2563eb", fontWeight: "700" }}>
          Database Target Schema Configurator
        </span>
        <h2 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          {schema.dataset_name || "Dataset Structure Generation"}
        </h2>
      </div>

      {/* Interactive Schema Workbench Container */}
      <div style={{
        background: "#ffffff",
        padding: "32px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
          Columns Topology Definition
        </h3>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
          Review the structural entities below. You can freely rename variables, adjust primitive data type parameters, or provide custom semantic rules to guide the generation engine.
        </p>

        {/* Embedded Interactive Table Layer */}
        <SchemaTable
          schema={schema}
          onChange={(columns) =>
            setSchema({
              ...schema,
              columns,
            })
          }
        />

        {/* Form Action Controls */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", marginTop: "32px", paddingTop: "24px" }}>
          <button
            onClick={generateDataset}
            style={{
              padding: "12px 24px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "background 0.2s"
            }}
          >
            Compile Dataset Model →
          </button>
        </div>
      </div>
    </div>
  );
}