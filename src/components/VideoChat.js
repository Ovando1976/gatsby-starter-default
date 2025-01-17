import React from "react";
import styles from "./VideoChat.module.css";

function VideoChat({ groupId }) {
  return (
    <div className={styles.videoChat}>
      <iframe
        src={`https://video-chat-service.com/${groupId}`}
        title="Live Video Chat"
        className={styles.videoFrame}
        allow="camera; microphone; autoplay"
      ></iframe>
      <p>Enjoy live interactions with your group!</p>
    </div>
  );
}

export default VideoChat;