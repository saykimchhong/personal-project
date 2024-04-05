import React from "react";
import styles from "@/styles/BotReply.module.css";

function BotReply(props) {
  return (
    <div className="d-flex flex-row justify-content-start mb-4">
      <div className={styles.avatar_container}>
        <img src="/images/bot.jpg" alt="Avatar" className={styles.avatar_img} />
      </div>

      <div
        className="p-3 ms-3"
        style={{
          borderRadius: "15px",
          backgroundColor: "rgba(150, 214, 236, 1)",
          maxWidth: "80%",
        }}
      >
        <pre
          className="small mb-0"
          style={{
            maxWidth: "100%",
            wordWrap: "break-word",
            overflowX: 'auto',
            whiteSpace: "pre-wrap",
          }}
        >
          {props.text}
        </pre>
      </div>
    </div>
  );
}

export default BotReply;
