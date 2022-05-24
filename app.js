// imports
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./db/connect");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

// routes import
const guests = require("./routes/guests");
const users = require("./routes/users");
const auth = require("./routes/auth");
const records = require("./routes/records");
const contact = require("./routes/contactEmail");

//*middlewares
//require the header "key" to authorize the request
const authorize = require("./middleware/authorization");
//require login ("auth-token" header) to authorize the request
const verifyToken = require("./middleware/verifyToken");
//require a valid userId header to authorize the request
const userIdVerify = require("./middleware/userIdVerify");

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "key"],
};
app.use(cors(corsOpts));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(express.json());

// routes

app.use("/auth", authorize, auth);
app.use("/api/users", authorize, users);
app.use("/api/guests", authorize, verifyToken, userIdVerify, guests);
app.use("/api/records", authorize, verifyToken, userIdVerify, records);
app.use("/contact", authorize, contact);

// serving the frontend
//TODO serve frontend app when deploying
// app.use(express.static(path.join(__dirname, "public")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/index.html"));
// });

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

//starting the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
