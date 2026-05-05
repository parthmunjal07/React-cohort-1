import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("loading");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getVideos() {
      const url = "https://api.freeapi.app/api/v1/public/youtube/videos";
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

        setVideos(data?.data?.data || []);
        setStatus("success");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setStatus("error");
        }
      }
    }

    getVideos();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-14 p-8 font-sans bg-[#ffde59] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-black">
      
      <div className="text-center mb-12 bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h1 className="text-4xl md:text-5xl m-0 font-black uppercase tracking-widest text-black">
          Video Feed
        </h1>
      </div>

      {status === "loading" && (
        <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
          <p className="text-2xl font-black uppercase tracking-widest animate-pulse m-0">
            Buffering videos...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[#ff5757] border-4 border-black p-10 rounded-xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="m-0 font-black text-2xl uppercase tracking-widest text-black">
            Failed to load video feed. Please try again.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => {
            const videoId = video.id || video._id || index;
            const title = video.title || video?.snippet?.title || "Untitled Video";
            const thumbnailUrl = video.thumbnail?.url || video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail";
            const channelName = video.owner?.username || video.channelName || "Unknown Channel";
            const views = video.views || 0;

            return (
              <div
                key={videoId}
                className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="relative border-b-4 border-black bg-[#f3f4f6] aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#ff5757] text-white px-3 py-1 border-2 border-black rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {views.toLocaleString()} Views
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="m-0 text-lg font-black uppercase tracking-wide leading-tight mb-2 line-clamp-2">
                    {title}
                  </h3>
                  
                  <p className="m-0 text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">
                    {channelName}
                  </p>

                  <div className="mt-auto pt-4 border-t-4 border-black">
                    <button className="w-full py-3 bg-[#5ce1e6] text-black font-black uppercase tracking-widest text-base border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#47d1d6] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                      Play Video
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;