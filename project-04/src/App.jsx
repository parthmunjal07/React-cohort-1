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
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        color: "#333",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#111827",
          fontWeight: "700",
          letterSpacing: "-0.5px",
        }}
      >
        Random Jokes
      </h2>

      {status === "loading" && jokes.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: "500" }}>
            Loading jokes...
          </p>
        </div>
      )}

      {status === "error" && jokes.length === 0 && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#dc2626", fontWeight: "500" }}>
            Failed to load jokes. Please try again.
          </p>
        </div>
      )}

      {jokes.length > 0 && currentJoke && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              padding: "32px 24px",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
              minHeight: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#374151",
                lineHeight: "1.6",
                fontWeight: "500",
              }}
            >
              {currentJoke.content}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                color: currentIndex === 0 ? "#9ca3af" : "#4b5563",
                backgroundColor: currentIndex === 0 ? "#f3f4f6" : "#ffffff",
                border: "1px solid",
                borderColor: currentIndex === 0 ? "#e5e7eb" : "#d1d5db",
                borderRadius: "8px",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
              Joke {currentIndex + 1}
            </span>

            <button
              onClick={handleNext}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
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