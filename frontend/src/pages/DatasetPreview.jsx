import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatasetTable from "../components/DatasetTable";
import API from "../services/api";

export default function DatasetPreview() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("dataset");
    if (!saved) return [];
    try { return JSON.parse(saved).preview || []; } catch { return []; }
  });

  const [datasetInfo, setDatasetInfo] = useState(() => {
    const saved = localStorage.getItem("dataset");
    if (!saved) return null;
    try {
      const data = JSON.parse(saved);
      return { rowCount: data.row_count, colCount: data.col_count };
    } catch { return null; }
  });

  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ size: "500", style: "random", missing_pct: 0, noise: "low" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const generateDataset = async () => {
    try {
      setLoading(true);
      const schemaData = JSON.parse(localStorage.getItem("schema"));
      if (!schemaData) { alert("No active schema session context found."); return; }
      const parsedSize = parseInt(settings.size, 10) || 10;
      const res = await API.post("/generate-dataset", {
        session_id: schemaData.session_id,
        schema: schemaData.schema,
        settings: { ...settings, size: parsedSize },
      });
      localStorage.setItem("dataset", JSON.stringify(res.data));
      setRows(res.data.preview || []);
      setDatasetInfo({ rowCount: res.data.row_count, colCount: res.data.col_count });
    } catch (err) {
      console.error(err);
      alert("Failed to synthesize dataset matrix framework.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (rows.length === 0) generateDataset(); }, []);

  const exportFile = (format) => {
    const schemaData = JSON.parse(localStorage.getItem("schema") || "null");
    const sessionId = schemaData?.session_id || localStorage.getItem("sessionId");
    if (!sessionId) { alert("Session validation token reference lost."); return; }
    const baseUrl = API.defaults.baseURL || "http://127.0.0.1:8000";
    window.open(`${baseUrl}/export/${sessionId}/${format}`, "_blank");
  };

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: isMobile ? "10px auto" : "40px auto", padding: isMobile ? "0 12px" : "0 30px", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "26px", fontWeight: "700", color: "#0f172a" }}>Dataset Engine Pipeline</h1>
        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>Configure parameters and synthesize simulated row records.</p>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "16px", marginBottom: "32px" }}>
        <div style={{ flex: 1, padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>TOTAL DATASET SIZE</span>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>{datasetInfo ? `${datasetInfo.rowCount.toLocaleString()} Rows` : "--"}</h2>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>ATTRIBUTES STRUCT</span>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800", color: "#2563eb" }}>{datasetInfo ? `${datasetInfo.colCount} Fields` : "--"}</h2>
        </div>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: isMobile ? "16px" : "24px", marginBottom: "32px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "600", color: "#334155" }}>Pipeline Synthesis Tuner</h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Generation Volumetrics</label>
            <input type="text" value={settings.size} onChange={(e) => setSettings({ ...settings, size: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Distribution Profile</label>
            <select value={settings.style} onChange={(e) => setSettings({ ...settings, style: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" }}>
              <option value="random">Standard Random</option>
              <option value="realistic">Gaussian Production Fit</option>
              <option value="skewed">Asymmetric Vector Skew</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Anomalous Data Drift (%)</label>
            <input type="number" value={settings.missing_pct} onChange={(e) => setSettings({ ...settings, missing_pct: parseFloat(e.target.value) || 0 })} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Noise Amplitude</label>
            <select value={settings.noise} onChange={(e) => setSettings({ ...settings, noise: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" }}>
              <option value="none">Zero Noise Floor</option>
              <option value="low">Low Divergence (5%)</option>
              <option value="high">High Stress Variance (20%)</option>
            </select>
          </div>
        </div>
        <button onClick={generateDataset} disabled={loading} style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
          {loading ? "Re-Synthesizing Matrix..." : "Sync Engine Settings & Regulate ⚡"}
        </button>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px" }}>
        <button onClick={() => exportFile("csv")} style={{ flex: 1, padding: "11px 20px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>📥 Download CSV</button>
        <button onClick={() => exportFile("xlsx")} style={{ flex: 1, padding: "11px 20px", background: "#16a34a", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>📊 Download Excel</button>
        <button onClick={() => exportFile("json")} style={{ flex: 1, padding: "11px 20px", background: "#4b5563", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>{`{ }`} Download JSON</button>
      </div>

      <DatasetTable rows={rows} />
    </div>
  );
}