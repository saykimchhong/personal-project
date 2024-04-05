import React from "react";
import styles from "@/styles/UserReply.module.css";

function UserReply(props) {
  return (
    <div className="d-flex flex-row justify-content-end mb-4">
      <div
        className="p-3 me-3 border"
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
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {props.text}
        </pre>
      </div>
      <div className={styles.avatar_container}>
        <img src="/images/kim.JPG" alt="Avatar" className={styles.avatar_img} />
      </div>
    </div>
  );
}

export default UserReply;
