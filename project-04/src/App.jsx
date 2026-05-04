import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [jokes, setJokes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getJokes() {
      if (jokes.length === 0) {
        setStatus("loading");
      }

      const url = `https://api.freeapi.app/api/v1/public/randomjokes?page=${page}&limit=10`;
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
        
        const newJokes = data?.data?.data || [];
        setJokes((prevJokes) => [...prevJokes, ...newJokes]);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setStatus("error");
        }
      }
    }

    getJokes();

    return () => {
      controller.abort();
    };
  }, [page]);

  const handleNext = () => {
    if (currentIndex >= jokes.length - 3 && status !== "loading") {
      setPage((prevPage) => prevPage + 1);
    }
    if (currentIndex < jokes.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentJoke = jokes[currentIndex];

  return (
    <div className="max-w-2xl mx-auto my-14 p-8 font-sans bg-[#ffde59] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black">
      <h2 className="text-3xl text-center mb-8 font-black uppercase tracking-widest border-b-4 border-black pb-4">
        Random Jokes
      </h2>

      {status === "loading" && jokes.length === 0 && (
        <div className="text-center py-10 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg">
          <p className="text-xl font-bold uppercase tracking-widest animate-pulse">
            Loading jokes...
          </p>
        </div>
      )}

      {status === "error" && jokes.length === 0 && (
        <div className="bg-[#ff5757] border-4 border-black p-6 rounded-lg text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="m-0 font-black text-lg uppercase tracking-wide">
            Failed to load jokes. Please try again.
          </p>
        </div>
      )}

      {jokes.length > 0 && currentJoke && (
        <div className="flex flex-col gap-8">
          <div className="p-8 bg-white rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[160px] flex items-center justify-center text-center transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <p className="m-0 text-xl font-black uppercase tracking-wide text-gray-900 leading-relaxed">
              {currentJoke.content}
            </p>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-5 py-3 text-sm font-black uppercase tracking-widest border-4 rounded-lg transition-all ${
                currentIndex === 0
                  ? "bg-gray-200 text-gray-500 border-gray-400 cursor-not-allowed"
                  : "bg-[#5ce1e6] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              }`}
            >
              Previous
            </button>

            <span className="text-base font-black uppercase tracking-widest bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
              Joke {currentIndex + 1}
            </span>

            <button
              onClick={handleNext}
              className="px-5 py-3 text-sm font-black uppercase tracking-widest border-4 border-black rounded-lg bg-[#cb6ce6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              Next Joke
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;