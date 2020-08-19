import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Reports(props) {
    const { lat, lng } = props;
    // // console.log("props", props);
    const [posts, setPosts] = useState();
    const [inputs, setInputs] = useState();
    const [file, setFile] = useState();
    const [time, setTime] = useState();
    const [title, setTitle] = useState();

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const { data } = await axios.get("/get-posts");

    //             setPosts(data);
    //             console.log("data getting from posts", data);
    //         } catch (err) {
    //             console.log("error in getting posts: ", err);
    //         }
    //     })();
    // }, []);

    function sendReport() {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("time", time);
        formData.append("lat", lat);
        formData.append("lng", lng);
        formData.append("inputs", inputs);

        if (document.getElementById("title").value == "") {
            setTitle("");
        }
        if (file) {
            axios
                .post("/post-image", formData)
                .then(({ data }) => {
                    // console.log("data from post image", data);
                    // setPosts([data, ...posts]);
                    setPosts(data);
                    setFile(null);
                })
                .catch((err) => console.log("error in post an image: ", err));
        } else {
            axios
                .post("/publish-report", { inputs, time, title, lat, lng })
                .then(({ data }) => {
                    // console.log("data in publish post route", data);
                    // setPosts([data, ...posts]);
                    setPosts(data);
                })
                .catch((err) =>
                    console.log("error in publish post route: ", err)
                );
            document.querySelector("textarea").value = "";
            setInputs("");
        }
    }
    return (
        <>
            <div>
                <input
                    type="datetime-local"
                    name="time"
                    placeholder="date and time"
                    onChange={(e) => setTime(e.target.value)}
                />
                <input
                    // onChange={(e) => this.handleChange(e)}

                    id="title"
                    name="title"
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                {/* defaultValue="" */}

                <textarea
                    name="textarea"
                    placeholder="Describe the happening!"
                    onChange={(e) => setInputs(e.target.value)}
                ></textarea>
                <label className="label" id="post-label">
                    Post an image!
                    <input
                        className="files"
                        onChange={(e) => setFile(e.target.files[0])}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                </label>

                <button onClick={sendReport}>Save the report</button>
            </div>
            {/* <div>
                {posts &&
                    posts.map((post, id) => {
                        return (
                            <div key={id}>
                                <h3>{post.title}</h3>
                                <p>{post.ts.toLocaleString("de-DE")}</p>
                                <img src={post.image} />
                                <p>{post.description}</p>
                                <p>
                                    This incident happend on:
                                    {post.time_incident}
                                </p>
                            </div>
                        );
                    })}
            </div> */}
        </>
    );
}
