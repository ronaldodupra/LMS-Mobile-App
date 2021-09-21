import { Route } from "@angular/compiler/src/core";
import { stringify } from "@angular/compiler/src/util";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, Platform } from "@ionic/angular";
import { computeStackId } from "@ionic/angular/directives/navigation/stack-utils";
import { BehaviorSubject, Subject, timer } from "rxjs";
import { finalize, map, takeUntil, takeWhile } from "rxjs/operators";
import { examInterface } from "src/app/interface/exam.interface";
import { OnlineExamModel } from "src/app/model/online_exam.model";
import { QuestionBankModel } from "src/app/model/question_bank.model";
import { ExamService } from "src/app/services/exam.service";

@Component({
  selector: "app-take-exam",
  templateUrl: "./take-exam.component.html",
  styleUrls: ["./take-exam.component.scss"],
})
export class TakeExamComponent implements OnInit {
  unsubcribe: any;
  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private loadingController: LoadingController
  ) {
    this.examId = +this.route.snapshot.paramMap.get("id");
  }
  itesms: [];
  duration: number;
  examId: number;
  examResultId: Number;
  examQuestions: QuestionBankModel[];
  examDetails: OnlineExamModel;
  form = new FormGroup({
    items: new FormArray([]),
  });
  get items() {
    return this.form.get("items") as FormArray;
  }
  next() {
    localStorage.setItem("storedAnswer", "");
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener(
          "backbutton",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("hello");
          },
          false
        );
      });
    });
    this.getExamResultId();
  }
  getExamResultId() {
    this.examService.getExamResultId(this.examId).subscribe((data) => {
      this.examResultId = data;
      this.getExamQuestionBank();
    });
  }
  getExamQuestionBank() {
    this.examService.getExamQuestions(this.examId).subscribe((data) => {
      this.examQuestions = data.questionBank;
      this.examDetails = data.examDetails;
      this.examQuestions.forEach((x) => {
        if (
          x.type == "enumeration" ||
          x.type == "fill_in_the_blanks" ||
          x.type == "chronological_order"
        ) {
          x.options = x.options.toString().split(",");
        } else if (x.type == "matching_type") {
          x.matching_type = JSON.parse(x.matching_type.toString());
          x.matching_type_answer = JSON.parse(
            x.matching_type_answer.toString()
          );
        } else {
          if (x.options != null) {
            x.options = JSON.parse(x.options.toString());
          }
        }
      });
      console.log(this.examQuestions);
      this.addFormControl();
    });
  }

  addFormControl() {
    this.examQuestions.forEach((field) => {
      if (field.type == "enumeration" || field.type == "fill_in_the_blanks") {
        this.addItem(
          field.correct_answers,
          field.question_bank_id,
          this.fb.array(this.options(field.options))
        );
      } else if (field.type == "chronological_order") {
        this.addItem(
          field.correct_answers,
          field.question_bank_id,
          this.fb.array(this.optionschonolgical(field.options))
        );
      } else if (field.type == "matching_type") {
        this.addItem(
          field.correct_answers,
          field.question_bank_id,
          this.fb.array(this.options(field.matching_type))
        );
      } else if (field.type == "true_false") {
        this.addItem(
          field.correct_answers,
          field.question_bank_id,
          this.fb.control("true")
        );
      } else {
        this.addItem(
          field.correct_answers,
          field.question_bank_id,
          this.fb.control([])
        );
      }
    });
    console.log(this.form);
  }
  options(option: string[]) {
    var array = [];
    for (let i = 0; i < option.length; i++) {
      array.push(this.fb.control(""));
    }
    return array;
  }
  optionschonolgical(option: string[]) {
    var array = [];
    for (let i = 0; i < option.length; i++) {
      array.push(this.fb.control(option[i]));
    }
    return array;
  }
  finish() {
    console.log(this.form.value);
    var form = this.form.value;
    this.examService
      .submitExam(this.examId, this.examResultId, form)
      .subscribe((data) => {
        if (data == "Submitted") {
          this.router.navigate(["student", "exam", this.examId, "success"]);
        }
      });
  }
  createItem(answer, id, control): FormGroup {
    return this.fb.group({
      question_bank_id: id.toString(),
      submitted_answer: control,
      correct_answers: answer,
    });
  }

  addItem(answer, id, control): void {
    this.items.push(this.createItem(answer, id, control));
  }

  reorderItems(ev, opt, i) {
    let draggedItem = opt.splice(ev.detail.from, 1)[0];
    opt.splice(ev.detail.to, 0, draggedItem);
    this.form.value.items[i].submitted_answer = opt;
    ev.detail.complete();
  }
}
