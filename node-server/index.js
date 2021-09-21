var express = require("express");
var mysql = require("mysql");
var bodyparser = require("body-parser");
var app = express();
var cors = require("cors");
app.use(cors({ credentials: true, origin: true }));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(bodyparser.json());
app.listen(3300, () => console.log("node app is running on port 3300"));
app.listen = function () {
  var server = http.createServer(this);
  return server.listen.apply(server, 12345);
};
var dotenv = require("dotenv");

dotenv.config();

const accountRoute = require("./routes/account");
const examRoute = require("./routes/exam");

app.use("/api/account", accountRoute);
app.use("/api/exams", examRoute);
