import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getUsers() {
      const url = "https://api.freeapi.app/api/v1/public/randomusers?page=1&limit=10";
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
        setUsers(result.data.data || []);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch users:", error);
          setStatus("error");
        }
      }
    }

    getUsers();

    return () => {
      controller.abort();
    };
  }, []);

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
        Random Users Directory
      </h2>

      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: "500" }}>
            Loading users...
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
            Failed to load users. Please try again.
          </p>
        </div>
      )}

      {status === "success" && (
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {users.map((user) => (
            <li
              key={user.login.uuid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                border: "1px solid #f3f4f6",
                transition: "all 0.2s ease",
              }}
            >
              <img
                src={user.picture.thumbnail}
                alt={`${user.name.first} ${user.name.last}`}
                style={{
                  borderRadius: "50%",
                  width: "56px",
                  height: "56px",
                  objectFit: "cover",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "16px",
                    color: "#1f2937",
                    fontWeight: "600",
                  }}
                >
                  {user.name.first} {user.name.last}
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  {user.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;