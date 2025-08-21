import React, { useState } from "react"
import * as styles from "./VideoChat.module.css"

export default function VideoChat() {
  // Example data: array of short video URLs
  const [videos] = useState([
    {
      id: 1,
      src: "https://cdn.example.com/video1.mp4",
      caption: "Check out this new group workout! #FitnessEnthusiasts",
    },
    {
      id: 2,
      src: "https://cdn.example.com/video2.mp4",
      caption: "Tropical vibes in Bali #TravelLovers",
    },
  ])

  return (
    <div className={styles.container}>
      {videos.map((video, index) => (
        <div key={video.id} className={styles.videoContainer}>
          <video
            className={styles.video}
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
            // Optional onClick to pause/play
            onClick={(e) => {
              if (e.target.paused) {
                e.target.play()
              } else {
                e.target.pause()
              }
            }}
          />
          {/* Overlay UI */}
          <div className={styles.overlay}>
            <p>{video.caption}</p>
          </div>
        </div>
      ))}
    </div>
  )
}