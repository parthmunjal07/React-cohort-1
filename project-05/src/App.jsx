import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getQuotes() {
      setStatus("loading");
      const url = `https://api.freeapi.app/api/v1/public/quotes?page=${page}&limit=10`;
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
        signal: signal,
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        setQuotes(data?.data?.data || []);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setStatus("error");
        }
      }
    }

    getQuotes();

    return () => {
      controller.abort();
    };
  }, [page]);

  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-[#5ce1e6] p-6 md:p-12 font-sans text-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-black mb-4 border-b-4 border-black pb-4">
            Daily Inspirations
          </h1>
          <p className="text-xl font-bold uppercase tracking-wide text-gray-800 m-0">
            Discover thoughts & wisdom from notable minds
          </p>
        </div>

        {status === "loading" && (
          <div className="text-center py-16 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            <p className="text-2xl font-black uppercase tracking-widest animate-pulse">
              Curating quotes...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-[#ff5757] border-4 border-black p-8 rounded-xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="m-0 font-black text-2xl uppercase tracking-widest text-black">
              Failed to load quotes. Please refresh.
            </p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="relative bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="absolute -top-6 -left-4 text-7xl font-black text-[#ffde59] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] z-10">
                    “
                  </span>
                  
                  <div className="relative z-20 mb-8 mt-2">
                    <p className="m-0 text-xl font-bold text-black leading-relaxed">
                      {quote.content}
                    </p>
                  </div>

                  <div className="relative z-20 mt-auto pt-4 border-t-4 border-black">
                    <p className="m-0 text-base font-black uppercase tracking-widest text-black mb-3">
                      {quote.author}
                    </p>
                    
                    {quote.tags && quote.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {quote.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-bold uppercase tracking-wide px-3 py-1 bg-[#cb6ce6] text-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 flex-wrap sm:flex-nowrap">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`px-6 py-4 text-base font-black uppercase tracking-widest border-4 rounded-xl transition-all ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 border-gray-500 cursor-not-allowed"
                    : "bg-[#ffde59] text-black border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                }`}
              >
                Previous
              </button>

              <span className="text-xl font-black uppercase tracking-widest bg-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                Page {page}
              </span>

              <button
                onClick={handleNext}
                className="px-6 py-4 text-base font-black uppercase tracking-widest border-4 border-black rounded-xl bg-[#ffde59] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;