import React, { useState } from "react";
import styles from "@/styles/BotReply.module.css";

function BotReplyImg(props) {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div className="d-flex flex-row justify-content-start mb-4">
      <div className={styles.avatar_container}>
        <img src="/images/bot.jpg" alt="Avatar" className={styles.avatar_img} />
      </div>

      <div
        className={`${styles.fullscreen_container} ${
          fullscreen ? styles.fullscreen : ""
        }`}
        style={{
          borderRadius: "15px",
          backgroundColor: "rgba(9, 9, 9, 1)",
          padding: "5px",
          maxWidth: "100%",
        }}
      >
        <img
          src={props.url}
          className={`img-fluid mb-2 rounded-top`}
          onClick={toggleFullscreen}
        />
        {fullscreen && (
          <button className={styles.exit_fullscreen} onClick={toggleFullscreen}>
            Exit Fullscreen
          </button>
        )}
      </div>
    </div>
  );
}

export default BotReplyImg;
