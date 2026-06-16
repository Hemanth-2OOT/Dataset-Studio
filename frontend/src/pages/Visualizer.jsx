import { useEffect, useState } from "react";
import API from "../services/api";
import ChartViewer from "../components/ChartViewer";

export default function Visualizer() {
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fallback security lookup
    const schemaData = JSON.parse(localStorage.getItem("schema") || "null");
    const sessionId = schemaData?.session_id || localStorage.getItem("sessionId");

    if (!sessionId) {
      setLoading(false);
      return;
    }

    API.get(`/visualize/${sessionId}`)
      .then((res) => {
        setCharts(res.data.charts || {});
      })
      .catch((err) => {
        console.error("Visualization fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        Loading charts...
      </div>
    );
  }

  if (Object.keys(charts).length === 0) {
    return (
      <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>
        No visual graphics maps or charts available for this session.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>📊 Visualization Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(500px,1fr))", gap: "20px" }}>
        {Object.values(charts).map((chart, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: "12px", padding: "15px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <ChartViewer chart={chart} />
          </div>
        ))}
      </div>
    </div>
  );
}