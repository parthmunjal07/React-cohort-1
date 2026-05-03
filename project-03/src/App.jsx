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
    <div
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "40px",
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
          textTransform: "uppercase",
          fontSize: "14px",
          letterSpacing: "1.5px",
        }}
      >
        Random Cat Discovery
      </h2>

      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: "500" }}>
            Summoning a feline...
          </p>
        </div>
      )}

      {status === "error" && (
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
            Failed to load cat. Please refresh to try again.
          </p>
        </div>
      )}

      {status === "success" && cat && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
            <img 
              src={cat?.image || "https://via.placeholder.com/600x400?text=No+Image+Available"} 
              alt={cat?.name || "A beautiful cat"}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "350px",
                objectFit: "cover",
                display: "block"
              }}
            />
          </div>

\          <div style={{ padding: "10px 0 0 0" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#111827" }}>
              {cat?.name || "Unknown Breed"}
            </h3>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              {cat?.origin && (
                <span style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                  🌍 {cat.origin}
                </span>
              )}
              {cat?.life_span && (
                <span style={{ backgroundColor: "#fce7f3", color: "#be185d", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                  ⏳ {cat.life_span} years
                </span>
              )}
            </div>

            {cat?.description && (
              <p style={{ margin: "0 0 16px 0", fontSize: "15px", color: "#4b5563", lineHeight: "1.6" }}>
                {cat.description}
              </p>
            )}

            {cat?.temperament && (
              <div style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                <strong style={{ display: "block", fontSize: "12px", textTransform: "uppercase", color: "#6b7280", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  Temperament
                </strong>
                <span style={{ fontSize: "14px", color: "#1f2937", fontWeight: "500" }}>
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