import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PromptPage from "./pages/PromptPage";
import SchemaEditor from "./pages/SchemaEditor";
import DatasetPreview from "./pages/DatasetPreview";
import Visualizer from "./pages/Visualizer";

function RequireSchema({ children }) {
  const hasSchema = localStorage.getItem("schema");
  return hasSchema ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* The top-level container acts as a viewport defense layer.
        Using w-full and overflow-x-hidden prevents sub-components with wide tables 
        from pushing out the screen width on mobile devices.
      */}
      <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-x-hidden antialiased">
        
        {/* Sticky Global Navigation Bar Anchor */}
        <header className="sticky top-0 z-50 w-full">
          <Navbar />
        </header>

        {/* Fluid Content Layer:
          - Automatically adjusts margins on mobile screens (px-2) and expands on desktop viewports (sm:px-6 lg:px-8).
          - max-w-7xl protects your desktop widescreen design layout.
        */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8 flex flex-col justify-start box-sizing-border-box">
          <div className="w-full bg-slate-950 border border-slate-800/50 rounded-xl md:rounded-2xl shadow-2xl transition-all duration-300">
            <Routes>
              {/* Core Feature Matrix Routings */}
              <Route path="/" element={<PromptPage />} />
              
              <Route path="/schema" element={
                <RequireSchema>
                  <SchemaEditor />
                </RequireSchema>
              } />
              
              <Route path="/preview" element={
                <RequireSchema>
                  <DatasetPreview />
                </RequireSchema>
              } />
              
              <Route path="/visualize" element={
                <RequireSchema>
                  <Visualizer />
                </RequireSchema>
              } />

              {/* Wildcard Fallback Protection */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}