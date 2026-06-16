import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatasetTable from "../components/DatasetTable";
import API from "../services/api";

export default function DatasetPreview() {
  const navigate = useNavigate();

  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("dataset");
    if (!saved) return [];
    try {
      return JSON.parse(saved).preview || [];
    } catch {
      return [];
    }
  });

  const [datasetInfo, setDatasetInfo] = useState(() => {
    const saved = localStorage.getItem("dataset");
    if (!saved) return null;
    try {
      const data = JSON.parse(saved);
      return { rowCount: data.row_count, colCount: data.col_count };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  
  // Storing row size as a string allows leading zeros like '010' in the text buffer
  const [settings, setSettings] = useState({
    size: "500", 
    style: "random",
    missing_pct: 0,
    noise: "low",
  });

  const generateDataset = async () => {
    try {
      setLoading(true);
      const schemaData = JSON.parse(localStorage.getItem("schema"));
      if (!schemaData) {
        alert("No active schema session context found.");
        return;
      }

      // Convert size safely back to an integer right before executing the API request
      const parsedSize = parseInt(settings.size, 10) || 10;

      const res = await API.post("/generate-dataset", {
        session_id: schemaData.session_id,
        schema: schemaData.schema,
        settings: {
          ...settings,
          size: parsedSize
        },
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

  useEffect(() => {
    if (rows.length === 0) {
      generateDataset();
    }
  }, []);

  const exportFile = (format) => {
    const schemaData = JSON.parse(localStorage.getItem("schema") || "null");
    const sessionId = schemaData?.session_id || localStorage.getItem("sessionId");
    if (!sessionId) {
      alert("Session validation token reference lost.");
      return;
    }
    const baseUrl = API.defaults.baseURL || "http://127.0.0.1:8000";
    window.open(`${baseUrl}/export/${sessionId}/${format}`, "_blank");
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "40px auto", padding: "0 30px" }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#0f172a" }}>Dataset Engine Pipeline</h1>
        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>Configure parameters, synthesize simulated row records, and access downstream analytics options.</p>
      </div>

      {/* Analytics Summary Counters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
        <div style={{ flex: 1, padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>TOTAL DATASET SIZE</span>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
            {datasetInfo?.rowCount?.toLocaleString() || 0} <span style={{ fontSize: "14px", fontWeight: "400", color: "#94a3b8" }}>rows</span>
          </h2>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.05em" }}>DATASET BREADTH</span>
          <h2 style={{ margin: "4px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
            {datasetInfo?.colCount || 0} <span style={{ fontSize: "14px", fontWeight: "400", color: "#94a3b8" }}>columns</span>
          </h2>
        </div>
      </div>

      {/* Synthesis Configuration Controls */}
      <div style={{ padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "32px", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>Synthesis Parameters Engine</h3>
        
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#475569", fontWeight: "700", letterSpacing: "0.03em" }}>GENERATED ROWS COUNT</label>
            <input
              type="text"
              value={settings.size}
              onChange={(e) => {
                // Strips out non-numeric entries but leaves digits and leading zeros completely intact
                const cleanVal = e.target.value.replace(/[^0-9]/g, "");
                setSettings({ ...settings, size: cleanVal });
              }}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", width: "130px", outline: "none", color: "#334155" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#475569", fontWeight: "700", letterSpacing: "0.03em" }}>DISTRIBUTION STYLE</label>
            <select 
              value={settings.style} 
              onChange={(e) => setSettings({ ...settings, style: e.target.value })}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", outline: "none", color: "#334155" }}
            >
              <option value="random">Random Distribution</option>
              <option value="balanced">Balanced Blocks</option>
              <option value="realistic">Realistic Profiles</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#475569", fontWeight: "700", letterSpacing: "0.03em" }}>MISSINGNESS RATIO (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.missing_pct}
              onChange={(e) => setSettings({ ...settings, missing_pct: Number(e.target.value) })}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", width: "130px", outline: "none", color: "#334155" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", color: "#475569", fontWeight: "700", letterSpacing: "0.03em" }}>OUTLIER NOISE VARIANCE</label>
            <select 
              value={settings.noise} 
              onChange={(e) => setSettings({ ...settings, noise: e.target.value })}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", outline: "none", color: "#334155" }}
            >
              <option value="low">Low Noise</option>
              <option value="medium">Medium Variance</option>
              <option value="high">High Variance</option>
            </select>
          </div>

          <button 
            onClick={generateDataset} 
            disabled={loading}
            style={{
              padding: "11px 22px",
              background: loading ? "#cbd5e1" : "#2563eb",
              color: loading ? "#94a3b8" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "13px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {loading ? "Synthesizing Framework..." : "Regenerate Dataset ✨"}
          </button>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => exportFile("csv")} style={{ padding: "11px 20px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(2, 132, 199, 0.15)" }}>📥 Download CSV (.csv)</button>
          <button onClick={() => exportFile("xlsx")} style={{ padding: "11px 20px", background: "#16a34a", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(22, 163, 74, 0.15)" }}>📊 Download Excel (.xlsx)</button>
          <button onClick={() => exportFile("json")} style={{ padding: "11px 20px", background: "#4b5563", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(75, 85, 99, 0.15)" }}>{`{ }`} Download JSON (.json)</button>
        </div>

        <button onClick={() => navigate("/visualize")} style={{ padding: "11px 22px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
          View Analytics Dashboard →
        </button>
      </div>

      {/* Interactive Grid */}
      <div style={{ marginTop: "16px" }}>
        <DatasetTable rows={rows} />
      </div>
    </div>
  );
}