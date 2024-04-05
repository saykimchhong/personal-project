import React from "react";
import styles from "@/styles/index.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserReply from "@/components/UserReply";
import { Bars } from "react-loader-spinner";
import { BsImage } from "react-icons/bs";
import { Configuration, OpenAIApi } from "openai";
import BotReplyImg from "@/components/BotReplyImg";

function generateImg() {
  const [userInput, setUserInput] = useState("");
  const [userChat, setUserChat] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserChat(userInput);

    try {
      setLoading(true);

      const openai = new OpenAIApi(
        new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        })
      );
      const res = await openai.createImage({
        prompt: `${userInput}`,
        n: 1,
        size: "1024x1024",
      });

      const imageData = res.data.data[0].url;

      setImageUrl(imageData);
      console.log(imageUrl);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
    setUserInput("");
  };
  return (
    <>
      <div className={styles.container}>
        <section>
          <div className="container" style={{ height: "100vh" }}>
            <div className="row d-flex justify-content-center">
              <div
                className="card shadow-lg p-sm-5 mt-3"
                style={{ borderRadius: "15px", height: "95vh" }}
              >
                <div
                  className="card-header d-flex justify-content-between align-items-center p-3 bg-secondary text-white border-0 mt-2"
                  style={{
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                  }}
                >
                  <i className="fas fa-angle-left">
                    {" "}
                    <Link href="/" className="text-light">
                      Back{" "}
                    </Link>
                  </i>
                  <p className="mb-0 fw-bold fs-5">
                    <BsImage
                      fontSize={28}
                      color="#c3283a"
                      className="me-sm-3 me-md-2 me-1"
                    />
                    Image Generate
                  </p>
                  <i className="fas fa-times">openai API</i>
                </div>
                <div
                  className="p-2 mt-3"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#eeeeee",
                    height: "70%",
                    maxHeight: "70%",
                    overflowY: "scroll",
                  }}
                >
                  {userChat != "" ? <UserReply text={userChat} /> : null}
                  {imageUrl != null ? <BotReplyImg url={imageUrl} /> : null}

                  {loading && (
                    <div className="row">
                      <div className="col-1">
                        <img
                          src="/images/bot.jpg"
                          alt="Avatar"
                          className="avatar_img"
                        />{" "}
                      </div>
                      <div className="col-1">
                        <Bars
                          height="60"
                          width="60"
                          color="#4fa94d"
                          ariaLabel="bars-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                        />{" "}
                      </div>
                      <div className="col-10"></div>
                    </div>
                  )}
                </div>
                <div className="mt-auto p-1 p-sm-3" style={{ flexShrink: 0 }}>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Type your message"
                      value={userInput}
                      onChange={handleUserInput}
                    ></textarea>
                    <button
                      type="submit"
                      className="btn btn-success float-end mt-2"
                    >
                      send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default generateImg;
