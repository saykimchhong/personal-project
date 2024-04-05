import { useState } from "react";
import UserReply from "@/components/UserReply";
import styles from "../styles/index.module.css";
import { Configuration, OpenAIApi } from "openai";
import BotReply from "@/components/BotReply";
import { Bars } from "react-loader-spinner";
import Link from "next/link";
import { BsFillChatTextFill } from "react-icons/bs";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [userChat, setUserChat] = useState("");
  const [apiData, setApiData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserChat(userInput);

    try {
      setLoading(true);
      const res = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: userInput }],
      });

      const apiData = res.data.choices[0].message.content;
      setApiData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiData(null);
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
                    <BsFillChatTextFill
                      fontSize={28}
                      color="#c3283a"
                      className="ms-3"
                    />
                  </i>
                  <p className="mb-0 fw-bold fs-5">
                    <Link href="/" className="text-light">
                      GPT API chat{" "}
                    </Link>
                  </p>
                  <i className="fas fa-times">
                    <Link href="/generateImg" className="text-light me-3">
                      {" "}
                      Image Generate{" "}
                    </Link>
                  </i>
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
                  {userChat !== "" || null ? (
                    <UserReply text={userChat} />
                  ) : null}
                  {apiData !== "" || null ? <BotReply text={apiData} /> : null}

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
