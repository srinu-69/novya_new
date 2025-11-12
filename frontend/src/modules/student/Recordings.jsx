import React, { useState, useRef, useEffect } from "react";

const LessonRecordings = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef(null);

  // Lesson videos list
  const videos = [
    {
      id: 1,
      title: "Video: The Ever Evolving World of Science",
      subject: "Science",
      src: "/videos/science/chapter-1.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/17/102bf976635c41bcbebf7829229ecca9.webp",
    },
    {
      id: 2,
      title: "Video: Exploring substances: Acidic, Basic, Neutral",
      subject: "Science",
      src: "/videos/science/chapter-2.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/17/e51532b3f16946ef9a7e12c9d2498c57.webp",
    },
    {
      id: 3,
      title: "Video: A Quiet village morning",
      subject: "English",
      src: "/videos/english/7th english unit -1 LEARNING TOGETHER (2).mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/aa06488aa8154dfab8e1691bbb226f0b.webp",
    },
    {
      id: 4,
      title: "Video: The power of perseverance",
      subject: "English",
      src: "/videos/english/7th english unit -1 LEARNING TOGETHER.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/17/7fce42770e7c458dbd8c14aa77cfec96.webp",
    },
    {
      id: 5,
      title: "Video: Setting the stage",
      subject: "English",
      src: "/videos/english/english_3.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/17/aa222a6a28a7417ebbe7a24f7448cfc4.webp",
    },
    {
      id: 6,
      title: "Video: Introduction to Electricity",
      subject: "Science",
      src: "/videos/science/chapter-3.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/32561f2b70e949f5ae31df7c6abd5ca7.webp",
    },
    {
      id: 7,
      title: "Video: The world of Metals and Non-metals",
      subject: "Science",
      src: "/videos/science/chapter-4.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/53c66f3becb94e7bb71cd923d5a1ebf2.webp",
    },
    {
      id: 8,
      title: "Video: Large Numbers Around Us",
      subject: "Maths",
      src: "/videos/maths/chapter-1.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/65d0125149934d9d9f45ef5f9717a1a1.webp",
    },
    {
      id: 9,
      title: "Video: What are Arthmetic Expressions?",
      subject: "Maths",
      src: "/videos/maths/chapter-2.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/3d226d6847db47ea9d0f137ef2c231e2.webp",
    },
    {
      id: 10,
      title: "Video: Introduction to Algebraic Expressions ",
      subject: "Maths",
      src: "/videos/maths/chapter-4.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/057d63e090744bea82b73d4f616eb1e7.webp",
    },
    {
      id: 11,
      title: "Video: Tracing changes to Maps",
      subject: "Social",
      src: "/videos/social/chapter1 (online-video-cutter.com).mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/18/418ae05d8bdc41449159891f7c392e7d.webp",
    },
    {
      id: 12,
      title: "Video: New kings and kingdoms",
      subject: "Social",
      src: "/videos/social/chpter2social.mp4",
      thumbnail:
        "https://images.piclumen.com/normal/20250828/17/bb4525b043d74cb3bf940be7c94bba0b.webp",
    },
  ];

  // Handle video errors
  const handleVideoError = (videoId, error) => {
    console.error(`Video ${videoId} failed to load:`, error);
    setError(
      `Video failed to load. Please check your connection and try again.`
    );
    setLoading(false);
    setBuffering(false);
  };

  // Reset error when modal is closed
  useEffect(() => {
    if (!selectedVideo) {
      setError(null);
      setLoading(false);
      setBuffering(false);
    }
  }, [selectedVideo]);

  // Handle video play
  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setLoading(true);
    setPlaying(video.id);
  };

  // Handle video load
  const handleVideoLoad = () => {
    setLoading(false);
    setBuffering(false);
    setError(null);
  };

  // Handle waiting (buffering)
  const handleWaiting = () => {
    setBuffering(true);
  };

  // Handle playing (buffering ended)
  const handlePlaying = () => {
    setBuffering(false);
  };

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.keyCode === 27) {
        setSelectedVideo(null);
        setPlaying(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div
      style={{
        paddingTop: "120px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        fontSize: "14px",
      }}
    >
      <style>
        {`
          .video-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 30px;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
          }
          
          @media (max-width: 1024px) {
            .video-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (max-width: 768px) {
            .video-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              padding: 0 10px;
            }
          }
          
          @media (max-width: 480px) {
            .video-grid {
              grid-template-columns: 1fr;
            }
          }

          .video-error {
            color: #ff4d4f;
            text-align: center;
            padding: 10px;
            background: #fff2f0;
            border: 1px solid #ffccc7;
            border-radius: 4px;
            margin: 10px 0;
          }
          
          .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .thumbnail-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            font-size: 16px;
            font-weight: bold;
            width: 100%;
            height: 100%;
          }

          .video-card {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .card-content {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            padding: 15px;
          }

          .watch-now-btn {
            margin-top: auto;
          }
        `}
      </style>

      <h1 style={{ textAlign: "center", color: "#111", fontSize: "1.2rem" }}>
        Lesson Recordings
      </h1>
      <p style={{ textAlign: "center", color: "#555", fontSize: "0.9rem" }}>
        Catch up on lectures or review complex topics with our recorded lessons.
      </p>

      {error && (
        <div className="video-error">
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "10px",
              background: "none",
              border: "none",
              color: "#1890ff",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Video Grid */}
      <div className="video-grid">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-card"
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              background: "#fff",
              fontSize: "14px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 5px rgba(0,0,0,0.1)";
            }}
          >
            {/* Thumbnail with overlay button */}
            <div
              style={{
                height: "200px",
                position: "relative",
                background: "#ccc",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => handlePlayVideo(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="thumbnail-fallback" style={{ display: "none" }}>
                {video.subject}
              </div>

              {/* Overlay Play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayVideo(video);
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  fontSize: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "rgba(0,0,0,0.8)")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "rgba(0,0,0,0.6)")
                }
              >
                ▶
              </button>
            </div>

            {/* Card Content */}
            <div className="card-content">
              <h4
                style={{
                  margin: "0 0 6px 0",
                  color: "#111",
                  fontSize: "1.0rem",
                  fontWeight: "600",
                  lineHeight: "1.3",
                  height: "2.6em",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {video.title}
              </h4>
              <p
                style={{
                  margin: "0 0 10px 0",
                  color: "#777",
                  fontSize: "0.85rem",
                }}
              >
                {video.subject}
              </p>
              <button
                onClick={() => handlePlayVideo(video)}
                className="watch-now-btn"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "#0d253f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "#00a896")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#0d253f")
                }
              >
                Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedVideo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            flexDirection: "column",
          }}
          onClick={() => {
            setSelectedVideo(null);
            setPlaying(null);
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedVideo(null);
              setPlaying(null);
            }}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⟵
          </button>

          {/* Video Info */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              color: "white",
              textAlign: "center",
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
              zIndex: 1001,
              maxWidth: "80%",
              margin: "0 auto",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>
              {selectedVideo.title}
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>
              {selectedVideo.subject}
            </p>
          </div>

          {/* Video Player */}
          <div
            style={{
              position: "relative",
              width: "90%",
              maxWidth: "1200px",
              height: "auto",
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={selectedVideo.src}
              controls
              autoPlay
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                background: "#000",
                borderRadius: "10px",
              }}
              onError={(e) => handleVideoError(selectedVideo.id, e)}
              onLoadedData={handleVideoLoad}
              onCanPlay={handleVideoLoad}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
            />

            {/* Loading indicator */}
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div className="loading-spinner"></div>
                <p>Loading video...</p>
              </div>
            )}

            {/* Buffering indicator */}
            {buffering && !loading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <div className="loading-spinner"></div>
                <p>Buffering...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Make sure to export as default
export default LessonRecordings;
