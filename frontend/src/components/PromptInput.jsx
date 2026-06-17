import { useState, useEffect } from "react";

export default function PromptInput({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onGenerate(prompt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "70vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#f8fafc", 
      padding: isMobile ? "12px" : "20px",
      boxSizing: "border-box",
      width: "100%"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "560px",
        background: "#ffffff",
        padding: isMobile ? "20px 16px" : "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
        boxSizing: "border-box"
      }}>\
        <div style={{ fontSize: "28px", marginBottom: "8px" }}></div>
        <h2 style={{ margin: "0 0 6px 0", fontSize: isMobile ? "20px" : "24px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>
          Prompt your dataset
        </h2>
        <p style={{ margin: "0 0 24px 0", fontSize: isMobile ? "13px" : "14px", color: "#64748b", lineHeight: "1.5" }}>
          Describe your application context requirements below using plain natural language structures.
        </p>

        <textarea
          rows="5"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            resize: "none",
            boxSizing: "border-box",
            fontSize: "15px",
            lineHeight: "1.5",
            color: "#334155",
            outline: "none",
            transition: "border-color 0.2s",
            background: "#f8fafc"
          }}
          value={prompt}
          placeholder="e.g., An e-commerce system database with incremental customer IDs, high-value orders, realistic product descriptions, and occasional null shipping dates..."
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isSubmitting}
        />

        <button 
          type="submit" 
          disabled={!prompt.trim() || isSubmitting}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: isSubmitting ? "#cbd5e1" : "#0f172a",
            color: isSubmitting ? "#94a3b8" : "#ffffff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: !prompt.trim() || isSubmitting ? "not-allowed" : "pointer",
            transition: "background-color 0.2s"
          }}
        >
          {isSubmitting ? "Processing Matrix Blueprint..." : "Compile Data Architecture"}
        </button>
      </form>
    </div>
  );
}