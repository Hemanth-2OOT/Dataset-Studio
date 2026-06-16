import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromptInput from "../components/PromptInput";
import API from "../services/api";

export default function PromptPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (prompt) => {
    try {
      setIsGenerating(true);
      const res = await API.post("/generate-schema", { prompt });

      localStorage.setItem("schema", JSON.stringify(res.data));
      navigate("/schema");
    } catch (err) {
      console.error(err);
      alert("Failed to compile natural language layout model.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc"
      }}>
        {/* Modern Infinite Loading Ring */}
        <div style={{
          width: "44px",
          height: "44px",
          border: "4px solid #cbd5e1",
          borderTop: "4px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 0.85s linear infinite",
          marginBottom: "20px"
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>Analyzing Architecture Topology</h3>
        <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#64748b" }}>Our generative engine is organizing columns and entity variables...</p>
      </div>
    );
  }

  return <PromptInput onGenerate={generate} />;
}