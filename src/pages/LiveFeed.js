import React, { useState } from "react"
import * as styles from "../styles/liveFeed.module.css"
import LivePlayer from "../components/LivePlayer"

export default function LiveFeed() {
  // Example list of “streams” or “rooms”. Each item is a live room ID or host ID.
  const [streams] = useState([
    { id: "fitness123", title: "Fitness Live", description: "Join our daily workout" },
    { id: "travel456", title: "Travel Live", description: "Live exploring Bali" },
  ])

  return (
    <div className={styles.container}>
      {streams.map((stream, idx) => (
        <div key={stream.id} className={styles.videoContainer}>
          <LivePlayer
            roomId={stream.id}
            title={stream.title}
            description={stream.description}
          />
        </div>
      ))}
    </div>
  )
}