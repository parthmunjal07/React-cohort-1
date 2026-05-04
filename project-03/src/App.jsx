import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [cat, setCat] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getCat() {
      const url = "https://api.freeapi.app/api/v1/public/cats/cat/random";
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
        signal: signal,
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        setCat(result.data || null);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch cat:", error);
          setStatus("error");
        }
      }
    }

    getCat();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-14 p-8 font-sans bg-[#ffde59] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black">
      <h2 className="text-3xl text-center mb-8 font-black uppercase tracking-widest border-b-4 border-black pb-4">
        Random Cat Discovery
      </h2>

      {status === "loading" && (
        <div className="text-center py-10 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg">
          <p className="text-xl font-bold uppercase tracking-widest animate-pulse">
            Summoning a feline...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[#ff5757] border-4 border-black p-6 rounded-lg text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="m-0 font-black text-lg uppercase tracking-wide">
            Failed to load cat. Please refresh to try again.
          </p>
        </div>
      )}

      {status === "success" && cat && (
        <div className="flex flex-col gap-6">
          
          <div className="w-full rounded-lg overflow-hidden border-4 border-black bg-[#5ce1e6] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <img 
              src={cat?.image || "https://via.placeholder.com/600x400?text=No+Image+Available"} 
              alt={cat?.name || "A beautiful cat"}
              className="w-full h-auto max-h-[350px] object-cover block border-b-4 border-black"
            />
          </div>

          <div className="pt-2">
            <h3 className="m-0 mb-3 text-2xl font-black uppercase tracking-wide text-black">
              {cat?.name || "Unknown Breed"}
            </h3>
            
            <div className="flex gap-3 flex-wrap mb-5">
              {cat?.origin && (
                <span className="bg-[#cb6ce6] text-white border-2 border-black px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  🌍 {cat.origin}
                </span>
              )}
              {cat?.life_span && (
                <span className="bg-[#7ed957] text-black border-2 border-black px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  ⏳ {cat.life_span} years
                </span>
              )}
            </div>

            {cat?.description && (
              <p className="m-0 mb-6 text-base font-bold text-gray-800 leading-relaxed border-l-4 border-black pl-4">
                {cat.description}
              </p>
            )}

            {cat?.temperament && (
              <div className="bg-white p-5 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <strong className="block text-sm uppercase font-black text-black tracking-widest border-b-2 border-black pb-2 mb-3">
                  Temperament
                </strong>
                <span className="text-base text-gray-900 font-bold">
                  {cat.temperament}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;