const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const app = express();
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

process.on("uncaughtException", function (err) {
    console.error(err);
});

app.use("/static", express.static(__dirname + "/public/static"));
app.use("/css", express.static(__dirname + "/public/static/css"));
app.use("/js", express.static(__dirname + "/public/static/"));
app.use("/img", express.static(__dirname + "/public/static/img"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser());

//Body Parser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

var JWT_SECRET = "JHJH9KJHNJHKJhi8Y687JVjhs8HAS92JLS9";

var username = "admin";
var passs = "your_secret_password";

app.get("/flag", (req, res) => {
    jwt.verify(req.cookies.auth, JWT_SECRET, (err) => {
        if (err) {
            res.status(403).send("<script>alert('Unauthorized Attempt!')</script>");
        } else {
            var jwt_token = jwt.verify(req.cookies.auth, JWT_SECRET);
            if (jwt_token.user == "admin") {
                res.send("Flag: your flag here");
            }
            res.status(403).send("<script>alert('Unauthorized Attempt!')</script>");
        }
    });
});

app.get("/test", (req, res) => {
    jwt.verify(req.cookies.auth, JWT_SECRET, (err) => {
        if (err) {
            res.status(403).send("<script>alert('Unauthorized Attempt!')</script>");
        } else {
            res.send("This is a test account!");
        }
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/", (req, res) => {
res.redirect("login");
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too Many Login Attempts" });

app.post("/login", urlencodedParser, limiter, (req, res) => {
    if (req.body.users == "admin" && req.body.passs == "admin") {
        const user = "admin";
        jwt.sign({ user }, JWT_SECRET, { expiresIn: "3600s" }, (err, token) => {
            res.cookie("auth", token);
            res.redirect("/flag");
        });
    } else if (req.body.users == "test" && req.body.passs == "test") {
        const user = "test";
        jwt.sign({ user }, JWT_SECRET, { expiresIn: "3600s" }, (err, token) => {
            res.cookie("auth", token);
            res.redirect("/test");
        });
    } else {
        res.send("<script>alert('Invalid Username or Password!')</script>");
    }
});

app.listen(80, () => {
    console.log("Listening on port 80");
});
