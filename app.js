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
const unvalidateExpired = require("./routes/unvalidateExpired");
const users = require("./routes/users");
const auth = require("./routes/auth");
const records = require("./routes/records");
const contact = require("./routes/contactEmail");

//*middlewares
//require the header "key" to authorize the request
const authorize = require("./middleware/authorization");
//require login ("authToken" header) to authorize the request
const verifyToken = require("./middleware/verifyToken");
//require a valid userId header to authorize the request
const userIdVerify = require("./middleware/userIdVerify");

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "key", "authToken", "userDataId"],
};
app.use(cors(corsOpts));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(express.json());

// routes
//*authentication routes (register and login)
app.use("/auth", authorize, auth);
//*users crud routes
app.use("/api/users", authorize, users);
//*guests crud routes
app.use("/api/guests", authorize, verifyToken, userIdVerify, guests);
//*records crud routes
app.use("/api/records", authorize, verifyToken, userIdVerify, records);
//*contact (sends an email from a post request)
app.use("/contact", authorize, contact);
//*for guest page (not login needed)
app.use("/api/guest", authorize, guests);
//* unvalidating expired vouchers
app.use("/api/unvalidateExpired", authorize, unvalidateExpired);

// serving the frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

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
