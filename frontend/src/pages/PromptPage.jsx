import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromptInput from "../components/PromptInput";
import API from "../services/api";

export default function PromptPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generate = async (prompt) => {
    try {
      setIsGenerating(false);
      setErrorMessage(""); // Clear old errors
      setIsGenerating(true);
      
      const res = await API.post("/generate-schema", { prompt });

      localStorage.setItem("schema", JSON.stringify(res.data));
      navigate("/schema");
    } catch (err) {
      console.error(err);
      // Fallback message handles generic errors cleanly without an aggressive browser pop-up alert
      setErrorMessage("The generative pipeline encountered an error compiling the layout model. Please check your prompt or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        
        {/* Modern Pulse Ring & Loading Spinner Container */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outward Ring Wave */}
          <div className="absolute w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
          {/* Active Spinning Core */}
          <div className="w-12 h-12 border-4 border-slate-800 border-t-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>

        {/* Dynamic Status Reading */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
          Analyzing Architecture Topology
        </h3>
        
        <p className="mt-2 text-sm md:text-base text-slate-400 max-w-md balance">
          Our generative engine is formatting semantic categories and structuring validation nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 md:py-10">
      
      {/* Dynamic Error Status Banner (Only displays if generation catches an issue) */}
      {errorMessage && (
        <div className="w-full max-w-2xl mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm md:text-base flex items-start gap-3 animate-shake">
          <span className="mt-0.5">⚠️</span>
          <div>
            <strong className="font-semibold block mb-0.5">Compilation Failure</strong>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Core Form Interface */}
      <div className="w-full max-w-2xl transition-all duration-300">
        <PromptInput onGenerate={generate} />
      </div>
    </div>
  );
}