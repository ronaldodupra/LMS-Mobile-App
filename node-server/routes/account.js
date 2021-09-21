const router = require("express").Router();

var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var verifyToken = require("../verifyToken");
var connection = require("../connection");

router.post("/login", function (req, res) {
  var data = req.body;
  var username = data.username;
  var password = crypto
    .createHash("sha1")
    .update(data.password, "binary")
    .digest("hex");
  connection.connect(function () {
    var query = `select * from student where username= '${username}' and password= '${password}'`;
    connection.query(query, function (err, result) {
      if (result && result.length) {
        const token = jwt.sign(
          { _id: result[0].student_id },
          process.env.TOKEN_SECRET
        );
        res.header("auth_token", token).send(JSON.stringify({ token: token }));
      } else {
        res.json("Either username or password is wrong!");
      }
    });
  });
});

router.get("/", verifyToken, function (req, res) {
  connection.connect(function () {
    var query = `select * from student where student_id=${req.user._id}`;
    connection.query(query, function (err, result, field) {
      if (err) res.end(err);
      if (result && result.length) {
        res.end(JSON.stringify(result[0]));
      }
    });
  });
});
module.exports = router;
