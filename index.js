const express = require("express");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");

const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const { s3Url } = require("./config");

const compression = require("compression");

const app = express();

app.use((req, res, next) => {
    next();
});

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(
    cookieSession({
        secret: "let it be.",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(express.json());
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//----FILE UPLOAD BOILERPLATE-----//
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { promises } = require("fs");
const { ClientRequest } = require("http");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//-----------------------------//

app.post("/register", (req, res) => {
    hash(req.body.password)
        .then((hashedPw) => {
            db.register(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((results) => {
                    let userId = results.rows[0].id;
                    req.session.userId = userId;
                    req.session.success = "true";
                    res.json({
                        success: "true",
                        data: results.rows,
                    });
                })
                .catch((err) => {
                    console.log("error in hash in POST register", err);
                    res.json({
                        success: "false",
                    });
                });
        })
        .catch((err) => {
            console.log("error in send the info in POST register", err);
        });
});

app.post("/post-image", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = s3Url + filename;
    db.postImage(
        req.session.userId,
        url,
        req.body.inputs,
        req.body.time,
        req.body.title,
        req.body.lat,
        req.body.lng
    )
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in post the image", err);
        });
});

app.post("/update-image", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const url = s3Url + filename;
    db.updateImage(req.body.lat, req.body.lng, url)
        .then((results) => {
            console.log("results.rows update:", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in update image: ", err);
        });
});

app.post("/update-report", (req, res) => {
    console.log("req.body", req.body);
    db.updateReport(
        req.body.lat,
        req.body.lng,
        req.body.inputs,
        req.body.time,
        req.body.title
    )
        .then((results) => {
            console.log("results.rows", results.rows);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in update: ", err);
        });
});
app.post("/publish-report", (req, res) => {
    db.insertPosts(
        req.session.userId,
        req.body.inputs,
        req.body.time,
        req.body.title,
        req.body.lat,
        req.body.lng
    )
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in inserting the posts", err);
        });
});

app.get("/get-posts", (req, res) => {
    db.getAllPosts()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getting all the posts", err);
        });
});

app.post("/login", (req, res) => {
    db.getPassword(req.body.email)
        .then((results) => {
            console.log("result in login", results.rows[0]);
            if (!results.rows[0]) {
                res.json({
                    success: "false",
                });
            } else {
                compare(req.body.password, results.rows[0].password)
                    .then((matchValue) => {
                        req.session.userId = results.rows[0].usersId;
                        console.log(
                            "does the user password match our hash in the database?",
                            matchValue
                        );
                        if (matchValue) {
                            let userId = results.rows[0].id;
                            req.session.userId = userId;
                            req.session.success = "true";

                            res.json({
                                success: "true",
                                data: results.rows,
                            });
                        } else {
                            res.json({
                                success: "false",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in maching the password", err);
                        res.json({
                            success: "false",
                        });
                    });
            }
        })
        .catch((err) => {
            console.log("error in getting the email and password", err);
            res.json({
                success: "false",
            });
        });
});

app.get("/user", (req, res) => {
    db.userInfo(req.session.userId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getting user info: ", err);
        });
});

app.get("/each-point/:id", (req, res) => {
    console.log("req.body", req.params);
    db.getEachPost(req.params.id)
        .then((results) => {
            console.log("results.rows", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getting the info for each", err);
        });
});

app.delete("/delete/:id", (req, res) => {
    db.deletePoint(req.params.id)
        .then(() => {
            res.json({ success: true });
        })

        .catch((err) => {
            console.log("error in deleting", err);
        });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
