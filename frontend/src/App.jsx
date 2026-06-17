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
      {/* Root viewport barrier layer */}
      <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col overflow-x-hidden antialiased">
        
        {/* Sticky Adaptive Navigation Header Section */}
        <header className="sticky top-0 z-50 w-full">
          <Navbar />
        </header>

        {/* Content Viewport Shell Layout */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8 flex flex-col justify-start">
          <div className="w-full bg-slate-950 border border-slate-800/50 rounded-xl md:rounded-2xl shadow-2xl transition-all duration-300">
            <Routes>
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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}