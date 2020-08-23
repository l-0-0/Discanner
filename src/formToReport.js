import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FormToReport(props) {
    const { lat, lng, getInfo } = props;
    // // console.log("props", props);
    const [posts, setPosts] = useState([]);
    const [inputs, setInputs] = useState();
    const [file, setFile] = useState();
    const [time, setTime] = useState();
    const [title, setTitle] = useState();
    const [showDetails, setShowDetails] = useState(false);
    const [button, setButton] = useState("Save");
    const [edit, setEdit] = useState(false);

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

                    setPosts(data);
                    getInfo(data);
                    setFile(null);
                })
                .catch((err) => console.log("error in post an image: ", err));
        } else {
            axios
                .post("/publish-report", {
                    inputs,
                    time,
                    title,
                    lat,
                    lng,
                })
                .then(({ data }) => {
                    console.log("data in publish post route", data[0].id);

                    setPosts(data);
                    const info = data[0].description;

                    getInfo(data);
                })
                .catch((err) =>
                    console.log("error in publish post route: ", err)
                );
            document.querySelector("textarea").value = "";
            setInputs("");
        }
        setShowDetails(true);
    }

    console.log("posts", posts);

    const editReport = () => {
        setShowDetails(false);

        let formData = new FormData();
        formData.append("file", file);
        formData.append("lat", lat);
        formData.append("lng", lng);

        if (file) {
            axios
                .post("/update-image", formData)
                .then(({ data }) => {
                    // console.log("data from post image", data);
                    setPosts(data);
                    setFile(null);
                })
                .catch((err) => console.log("error in post an image: ", err));
        } else {
            axios
                .post("/update-report", {
                    inputs,
                    time,
                    title,
                    lat,
                    lng,
                })
                .then(({ data }) => {
                    // console.log("data in update post route", data);

                    setPosts(data);
                })
                .catch((err) =>
                    console.log("error in update post route: ", err)
                );
            document.querySelector("textarea").value = "";
            setInputs("");
        }
        setShowDetails(true);
    };

    const dateChange = (time) => {
        let newTime = new Date(time);
        return newTime.toLocaleString("de-DE");
    };

    const buttonFunc = () => {
        if (button == "Save") {
            sendReport();
            setButton("Edit");
        } else if (button == "Edit") {
            // setShowDetails(false);
            setEdit(true);
            setButton("Save the changes");
        } else if (button == "Save the changes") {
            setEdit(false);
            editReport();
            setButton("Edit");
        }
    };

    // console.log("posts", getInfo);

    return (
        <>
            {!edit && !showDetails && (
                <div id="insert-info">
                    <input
                        type="datetime-local"
                        name="time"
                        placeholder="date and time"
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <input
                        id="title"
                        name="title"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        name="textarea"
                        placeholder="Describe the happening!"
                        onChange={(e) => setInputs(e.target.value)}
                    ></textarea>

                    <label className="label" id="post-label">
                        Upload an image!
                        <input
                            className="files"
                            onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                    </label>
                </div>
            )}

            {edit && posts && (
                <div id="insert-info">
                    <input
                        defaultValue={posts[0].time_incident}
                        type="datetime-local"
                        name="time"
                        placeholder="date and time"
                        onChange={(e) => setTime(e.target.value)}
                    />
                    <input
                        defaultValue={posts[0].title}
                        id="title"
                        name="title"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        defaultValue={posts[0].description}
                        name="textarea"
                        placeholder="Describe the happening!"
                        onChange={(e) => setInputs(e.target.value)}
                    ></textarea>

                    <label className="label" id="post-label">
                        Upload an image!
                        <input
                            className="files"
                            onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                    </label>
                </div>
            )}

            {!edit &&
                posts &&
                posts.map((post, id) => {
                    return (
                        <>
                            <div key={id}>
                                <div className="info-window">
                                    <h2> {post.title}</h2>
                                    <p>posted on: {dateChange(post.ts)}</p>
                                    <img src={post.image || "/index.png"} />

                                    <p className="desc">{post.description}</p>

                                    <p>
                                        This incident happend on:{" "}
                                        {dateChange(post.time_incident)}
                                    </p>
                                </div>
                            </div>
                        </>
                    );
                })}

            <button id="change-button" onClick={buttonFunc}>
                {button}
            </button>
        </>
    );
}
