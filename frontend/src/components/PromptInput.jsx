import { useState } from "react";

export default function PromptInput({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "560px",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🧠</div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "700", color: "#0f172a" }}>
          What dataset are we building today?
        </h2>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
          Describe your required columns, context, or anomalies in natural prose. Our generative module will structure the target entity properties.
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
            transition: "all 0.2s"
          }}
        >
          {isSubmitting ? "Parsing Data Topology..." : "Generate Schema Layout ✨"}
        </button>
      </form>
    </div>
  );
}