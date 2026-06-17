import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SchemaTable from "../components/SchemaTable";

export default function SchemaEditor() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const updatedData = { ...data, schema };
    localStorage.setItem("schema", JSON.stringify(updatedData));
    localStorage.setItem("sessionId", data.session_id);
    navigate("/preview");
  };

  return (
    <div style={{ 
      width: "100%",
      maxWidth: "1200px", 
      margin: isMobile ? "10px auto" : "40px auto", 
      padding: isMobile ? "0 12px" : "0 24px", 
      fontFamily: "system-ui, sans-serif",
      boxSizing: "border-box"
    }}>
      <div style={{ 
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: isMobile ? "16px" : "32px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
        boxSizing: "border-box",
        width: "100%"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: isMobile ? "18px" : "20px", fontWeight: "600", color: "#1e293b" }}>
          Columns Topology Definition
        </h3>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
          Review the structural entities below. You can freely rename variables, adjust primitive data type parameters, or provide custom semantic rules to guide the generation engine.
        </p>

        <SchemaTable
          schema={schema}
          onChange={(columns) => setSchema({ ...schema, columns })}
        />

        <div style={{ 
          display: "flex", 
          justifyContent: isMobile ? "center" : "flex-end", 
          borderTop: "1px solid #f1f5f9", 
          marginTop: "32px", 
          paddingTop: "24px" 
        }}>
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
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
              width: isMobile ? "100%" : "auto"
            }}
          >
            Synthesize Model Records ⚡
          </button>
        </div>
      </div>
    </div>
  );
}