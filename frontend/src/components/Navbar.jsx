import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { path: "/", label: "🧠 Prompt" },
    { path: "/schema", label: "📋 Schema Editor" },
    { path: "/preview", label: "📊 Dataset Preview" },
    { path: "/visualize", label: "📈 Visualizations" },
  ];

  return (
    <nav style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "12px 16px" : "16px 40px",
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      gap: isMobile ? "12px" : "0px"
    }}>
      <div style={{ 
        fontWeight: "700", 
        fontSize: "18px", 
        color: "#0f172a", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px" 
      }}>
        <span></span> DatasetStudio
      </div>
      <div style={{ 
        display: "flex", 
        gap: "6px",
        flexWrap: "wrap",
        justifyContent: "center",
        width: isMobile ? "100%" : "auto"
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                padding: isMobile ? "6px 10px" : "8px 16px",
                borderRadius: "8px",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: isActive ? "#2563eb" : "#475569",
                background: isActive ? "#eff6ff" : "transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                flexGrow: isMobile ? 1 : 0,
                textAlign: "center"
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