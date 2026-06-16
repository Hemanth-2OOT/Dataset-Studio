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

// FIX: Higher-order Route Guard component to prevent null data crashes
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
      <Navbar />

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
    </BrowserRouter>
  );
}