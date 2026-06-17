import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PromptPage from "./pages/PromptPage";
import SchemaEditor from "./pages/SchemaEditor";
import DatasetPreview from "./pages/DatasetPreview";
import Visualizer from "./pages/Visualizer";

// Higher-order Route Guard component to prevent null data crashes
function RequireSchema({ children }) {
  const hasSchema = localStorage.getItem("schema");
  if (!hasSchema) {
    // If no schema session exists, boot them back to the prompt configuration room safely
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* The root layout wrapper uses a slate system background.
        min-h-screen ensures the background stretches to full device height.
      */}
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
        
        {/* Sticky Global Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <Navbar />
        </header>

        {/* Main Responsive Viewport Container:
          - mx-auto centers the container horizontally on wide monitors
          - w-full spreads across mobile widths
          - max-w-7xl prevents the content from stretching too wide on laptops
          - p-4 adjusts to p-6/p-8 on larger devices for elegant padding whitespace
        */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Card-like UI Stage:
            Ensures that whether the layout inside individual pages uses a 
            flexbox or grid, it stays responsive and fluidly scales down to mobile widths.
          */}
          <div className="w-full h-full bg-slate-950 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden p-3 sm:p-6 md:p-8 transition-all duration-300">
            
            <Routes>
              {/* Public Landing Entrance */}
              <Route path="/" element={<PromptPage />} />

              {/* Protected Dashboard Channels */}
              <Route 
                path="/schema" 
                element={
                  <RequireSchema>
                    <SchemaEditor />
                  </RequireSchema>
                } 
              />
              <Route 
                path="/preview" 
                element={
                  <RequireSchema>
                    <DatasetPreview />
                  </RequireSchema>
                } 
              />
              <Route 
                path="/visualize" 
                element={
                  <RequireSchema>
                    <Visualizer />
                  </RequireSchema>
                } 
              />

              {/* Fallback Catch All redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}