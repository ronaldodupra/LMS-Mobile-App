import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ExamMessageComponent } from "./exam-message/exam-message.component";
import { ExamComponent } from "./exam/exam.component";
import { TakeExamComponent } from "./take-exam/take-exam.component";

@NgModule({
  declarations: [ExamComponent, TakeExamComponent, ExamMessageComponent],
  imports: [SharedModule],
})
export class ExamModule {}
