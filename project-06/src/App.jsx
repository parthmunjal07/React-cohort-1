import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getProducts() {
      const url = "https://api.freeapi.app/api/v1/public/randomproducts?page=1&limit=10&inc=category%2Cprice%2Cthumbnail%2Cimages%2Ctitle%2Cid&query=mens-watches";
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

        setProducts(data?.data?.data || []);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setStatus("error");
        }
      }
    }

    getProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-14 p-8 font-sans bg-[#cb6ce6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl text-black">
      <div className="text-center mb-10 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h2 className="text-3xl md:text-4xl m-0 font-black uppercase tracking-widest text-black">
          Product Catalog
        </h2>
      </div>

      {status === "loading" && (
        <div className="text-center py-16 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <p className="text-2xl font-black uppercase tracking-widest animate-pulse m-0">
            Fetching inventory...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[#ff5757] border-4 border-black p-8 rounded-xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="m-0 font-black text-2xl uppercase tracking-widest text-black">
            Failed to load products. Please try again.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-56 object-cover border-4 border-black rounded-lg mb-5 bg-[#f3f4f6]"
                />
              )}
              
              <div className="flex-1">
                <h3 className="m-0 text-xl font-black uppercase tracking-wide leading-tight mb-2">
                  {product.title}
                </h3>
              </div>

              <div className="mt-5 pt-5 border-t-4 border-black flex justify-between items-end gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
                    {product.category || "General"}
                  </span>
                  <span className="text-2xl font-black">
                    ${product.price}
                  </span>
                </div>
                
                <button className="px-4 py-2 bg-[#7ed957] text-black font-black uppercase tracking-wider text-sm border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#6cc24a] transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;