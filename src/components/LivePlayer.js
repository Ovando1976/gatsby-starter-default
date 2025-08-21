import React, { useEffect, useRef } from "react"
import SimplePeer from "simple-peer"
import "./LivePlayer.module.css"

export default function LivePlayer({ roomId, title, description }) {
  const videoRef = useRef(null)

  useEffect(() => {
    // Example: fetch a remote stream from your server or a signaling server
    // For simplicity, we assume you get `remoteStream` from a signaling flow
    let peer = new SimplePeer(/* config for WebRTC */)
    
    peer.on("stream", (remoteStream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = remoteStream
      }
    })

    // Cleanup
    return () => {
      peer.destroy()
    }
  }, [roomId])

  return (
    <div className={styles.livePlayer}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        playsInline
      />
      <div className={styles.overlay}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}