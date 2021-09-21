const router = require("express").Router();

var examService = require("../service/exam.service");
var verifyToken = require("../verifyToken");

router.get("/", verifyToken, function (req, res) {
  examService.getExamToday(req.user._id, res);
});
router.get("/:id", verifyToken, function (req, res) {
  examService.getExamAndQuestions(req.params.id, res);
});
router.get("/:id/getExamResultId", verifyToken, function (req, res) {
  examService.getExamResultId(req.params.id, req.user._id, res);
});
router.post("/:exam_result_id/:exam_id", verifyToken, function (req, res) {
  examService.finishExam(
    req.body,
    req.params.exam_result_id,
    req.params.exam_id,
    req.user._id,
    res
  );

  examService.checkAnswers(
    req.body,
    req.params.exam_result_id,
    req.params.exam_id,
    req.user._id
  );
});
router.post("/startExam", verifyToken, function (req, res) {
  examService.startExam(req.body.examId, req.user._id, res);
});
module.exports = router;
