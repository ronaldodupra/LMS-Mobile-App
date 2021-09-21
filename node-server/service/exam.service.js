var connection = require('../connection');
var moment = require('moment-timezone');
moment.tz.setDefault('Asia/Manila');
module.exports = {
  checkAnswers: function (answer, exam_result_id, exam_id, student_id) {
    var numberOfItems = 0;
    var answer_obtained = 0;
    answer.forEach((x) => {
      var select = `SELECT * FROM question_bank where question_bank_id=${x.question_bank_id}`;
      connection.query(select, function (err, result) {
        var selectOne = result[0];

        if (selectOne.type == 'multiple_choice') {
          if (x.correct_answers == x.submitted_answer) {
            answer_obtained += Number(selectOne.mark);
            console.log('multiple_choice ' + answer_obtained);
          }
        } else if (selectOne.type == 'true_false') {
          if (x.correct_answers == x.submitted_answer) {
            answer_obtained += Number(selectOne.mark);
            console.log('true_false ' + answer_obtained);
          }
        } else if (selectOne.type == 'image') {
          if (x.correct_answers == x.submitted_answer) {
            answer_obtained += Number(selectOne.mark);
            console.log('image' + answer_obtained);
          }
        } else if (selectOne.type == 'identification') {
          if (
            x.correct_answers.toLowerCase() == x.submitted_answer.toLowerCase()
          ) {
            answer_obtained += Number(selectOne.mark);
            console.log('identification ' + answer_obtained);
          }
        } else if (selectOne.type == 'fill_in_the_blanks') {
          x.correct_answers = x.correct_answers.split(', ');
          x.submitted_answer = JSON.parse(x.submitted_answer);
          for (let i = 0; i < x.correct_answers.length; i++) {
            if (
              x.correct_answers[i].toLowerCase() ==
              x.submitted_answer[i].toLowerCase()
            ) {
              answer_obtained += Number(selectOne.mark);
              console.log('fill_in_the_blanks ' + answer_obtained);
            }
            // this.insertEnumerationData();
          }
        } else if (selectOne.type == 'chronological_order') {
          x.correct_answers = x.correct_answers.split(',');
          x.submitted_answer = JSON.parse(x.submitted_answer);
          for (let i = 0; i < x.correct_answers.length; i++) {
            x.correct_answers[i] = x.correct_answers[i].toLowerCase();
            x.submitted_answer[i] = x.submitted_answer[i].toLowerCase();
            if (x.correct_answers[i] == x.submitted_answer[i]) {
              answer_obtained += Number(selectOne.mark);
              console.log('chronological_order ' + answer_obtained);
            }
          }
        } else if (selectOne.type == 'enumeration') {
          x.correct_answers = x.correct_answers.toLowerCase().split(', ');
          x.submitted_answer = JSON.parse(x.submitted_answer.toLowerCase());
          var matchItems = x.correct_answers.filter(function (item) {
            return x.submitted_answer.includes(item);
          });
          matchItems.forEach((e) => {
            answer_obtained += Number(selectOne.mark);
            console.log('enumeration ' + answer_obtained);
          });
        } else if (selectOne.type == 'matching_type') {
          x.correct_answers = JSON.parse(selectOne.matching_type_answer);
          var matchingtype = JSON.parse(selectOne.matching_type);
          x.submitted_answer = JSON.parse(x.submitted_answer);

          for (let i = 0; i < matchingtype.length; i++) {
            if (x.correct_answers[i] == x.submitted_answer[i]) {
              answer_obtained += Number(selectOne.mark);
              console.log('matching_type ' + answer_obtained);
            }
          }
        }
      });
      this.asyncFunction(() => {
        const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        numberOfItems++;
        connection.query(select, function (err, result) {
          var selectOne = result[0];
          if (
            selectOne.type == 'chronological_order' ||
            selectOne.type == 'enumeration' ||
            selectOne.type == 'fill_in_the_blanks' ||
            selectOne.type == 'matching_type'
          ) {
            x.submitted_answer.forEach((answer) => {
              var query = `INSERT INTO tbl_enumeration_data(online_exam_quiz_id,student_id,question_bank_id,answer,points,date_trans,type,question_type) VALUES
            ('${exam_id}','${student_id}','${x.question_bank_id}','${answer}','${selectOne.mark}','${date}','exam','${selectOne.type}')`;
              connection.query(query, function (err, result) {
                if (err) {
                  console.log(err);
                }
              });
            });
          }
        });

        if (numberOfItems === answer.length) {
          this.updateExamMarks(exam_result_id, answer_obtained);
        }
      });
    });
  },
  updateExamMarks: function (exam_result_id, answer_obtained) {
    var query = `UPDATE online_exam_result SET obtained_mark= ${answer_obtained} where online_exam_result_id=${exam_result_id}`;

    connection.query(query, function (err, result) {
      if (err) throw err;
      console.log('1 record inserted');
    });
  },
  asyncFunction: function (Update) {
    setTimeout(() => {
      Update();
    }, 100);
  },
  getExamToday: function (student_id, res) {
    var date = moment(Date.now());
    console.log(Date.now());
    connection.connect(function () {
      var query = `select oe.*,oer.online_exam_result_id,s.color,s.name from online_exam oe left join subject s on oe.subject_id = s.subject_id left join enroll e on oe.section_id= e.section_id left join
      online_exam_result oer on oe.online_exam_id =oer.online_exam_id
       where oe.examdate ='${date.format('YYYY-MM-DD')}'
       and e.student_id ='${student_id}' and oe.status='published'`;
      connection.query(query, function (err, result, field) {
        if (err) res.end(err);
        if (result && result.length) {
          result.forEach((e) => {
            console.log(
              e.time_start + ' ' + date.format('HH:mm') + ' ' + e.time_end
            );
            if (
              date.format('HH:mm') >= e.time_start &&
              e.time_end <= date.format('HH:mm')
            ) {
              e.timeAvailability = true;
            } else {
              e.timeAvailability = false;
            }
          });
          res.end(JSON.stringify(result));
        } else {
          res.json(`No Exam for date ` + date.format('YYYY-MM-DD'));
        }
      });
    });
  },
  startExam: function (examId, student_id, res) {
    var UnixDate = moment(Date.now()).unix();
    var query = `INSERT into online_exam_result(online_exam_id,student_id,status,exam_started_timestamp) values ('${examId}','${student_id}','attended','${UnixDate}')`;
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json('Exam Attended');
      }
    });
  },
  finishExam: function (data, result_id, exam_id, student_id, res) {
    var UnixDate = moment(Date.now()).unix();
    data.forEach((element) => {
      if (!Array.isArray(element.submitted_answer)) {
        if (
          element.submitted_answer == 'true' ||
          element.submitted_answer == 'false'
        ) {
        } else {
          console.log(element.submitted_answer);
          element.submitted_answer = JSON.stringify([element.submitted_answer]);
        }
      }
      if (Array.isArray(element.submitted_answer)) {
        const toString = JSON.stringify(element.submitted_answer);
        console.log(toString.replace(/"\"*/gi, '\\'));
        element.submitted_answer = toString;
      }
    });
    var toString = JSON.stringify(data);

    var replace = toString.replace(/\\/g, '\\\\');

    var query = `UPDATE online_exam_result SET answer_script='${replace}',status='submitted',exam_endtime='${UnixDate}' where online_exam_result_id='${result_id}'`;

    connection.query(query, function (err, result) {
      if (err) throw err;
      console.log('1 record inserted');
      console.log(result);

      res.json('Submitted');
    });
  },
  getExamResultId: function (exam_id, student_id, res) {
    connection.connect(function () {
      var query = `select * from online_exam_result where online_exam_id ='${exam_id}' and student_id ='${student_id}' limit 1`;
      connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result[0].online_exam_result_id);
        }
      });
    });
  },
  getExamAndQuestions: function (exam_id, res) {
    connection.connect(function () {
      var query = `select * from online_exam oe where oe.online_exam_id ='${exam_id}'`;
      connection.query(query, function (err, result, field) {
        if (err) {
          console.log(err);
        } else if (!err) {
          var query2 = `select * from question_bank qb where qb.online_exam_id ='${exam_id}'`;
          connection.query(query2, function (errQb, resultQb, fieldQb) {
            if (!errQb) {
              var data = {
                examDetails: result[0],
                questionBank: resultQb,
              };
              res.json(data);
            }
          });
        }
      });
    });
  },
};
