import { useEffect, useState } from "react";
import API from "../services/api";
import ChartViewer from "../components/ChartViewer";

export default function Visualizer() {
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const schemaData = JSON.parse(localStorage.getItem("schema") || "null");
    const sessionId = schemaData?.session_id || localStorage.getItem("sessionId");

    if (!sessionId) {
      setLoading(false);
      return;
    }

    API.get(`/visualize/${sessionId}`)
      .then((res) => { setCharts(res.data.charts || {}); })
      .catch((err) => { console.error("Visualization fetch failed:", err); })
      .finally(() => { setLoading(false); });
  }, []);

  if (loading) {
    return <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>Loading charts...</div>;
  }

  if (Object.keys(charts).length === 0) {
    return <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>No visual graphics maps or charts available for this session.</div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "auto", padding: isMobile ? "12px" : "20px", boxSizing: "border-box" }}>
      <h1 style={{ marginBottom: "20px", fontSize: isMobile ? "22px" : "28px", fontWeight: "700" }}>📊 Visualization Dashboard</h1>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(450px, 1fr))", 
        gap: "20px",
        width: "100%"
      }}>
        {Object.entries(charts).map(([key, chartData]) => (
          <div key={key} style={{ 
            background: "#ffffff", 
            border: "1px solid #e2e8f0", 
            borderRadius: "12px", 
            padding: isMobile ? "12px" : "20px", 
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
            overflow: "hidden",
            width: "100%",
            boxSizing: "border-box"
          }}>
            <ChartViewer chart={chartData} />
          </div>
        ))}
      </div>
    </div>
  );
}