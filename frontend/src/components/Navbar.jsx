import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "✨ Prompt" },
    { path: "/schema", label: "📋 Schema Editor" },
    { path: "/preview", label: "👀 Dataset Preview" },
    { path: "/visualize", label: "📊 Visualizations" },
  ];

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 40px",
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
    }}>
      <div style={{ fontWeight: "700", fontSize: "18px", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>💿</span> DatasetStudio
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                background: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#2563eb" : "#475569",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}