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
    <div className="max-w-2xl mx-auto my-10 p-8 font-sans bg-[#ffde59] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black">
      <h2 className="text-3xl text-center mb-8 font-black uppercase tracking-widest border-b-4 border-black pb-4">
        Random Users Directory
      </h2>

      {status === "loading" && (
        <div className="text-center py-10 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg">
          <p className="text-xl font-bold uppercase tracking-widest animate-pulse">
            Loading users...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[#ff5757] border-4 border-black p-6 rounded-lg text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="m-0 font-black text-lg uppercase tracking-wide">
            Failed to load users. Please try again.
          </p>
        </div>
      )}

      {status === "success" && (
        <ul className="list-none p-0 m-0 space-y-5">
          {users.map((user) => (
            <li
              key={user.login.uuid}
              className="flex items-center gap-5 p-5 bg-white rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              <img
                src={user.picture.thumbnail}
                alt={`${user.name.first} ${user.name.last}`}
                className="w-16 h-16 object-cover rounded-full border-4 border-black bg-[#5ce1e6]"
              />
              <div className="flex-1">
                <h4 className="m-0 text-xl font-black uppercase tracking-wide">
                  {user.name.first} {user.name.last}
                </h4>
                <p className="m-0 text-sm font-bold text-gray-700 border-t-2 border-black pt-2 mt-2">
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