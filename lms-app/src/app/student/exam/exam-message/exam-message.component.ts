import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-exam-message",
  templateUrl: "./exam-message.component.html",
  styleUrls: ["./exam-message.component.scss"],
})
export class ExamMessageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  back() {
    this.router.navigate(["/"]).then(() => {
      this.router.navigate(["/", "student", "exam"]);
    });
  }
}
