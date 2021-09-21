import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { ExamMessageComponent } from "./exam/exam-message/exam-message.component";
import { ExamComponent } from "./exam/exam/exam.component";
import { TakeExamComponent } from "./exam/take-exam/take-exam.component";
import { MainComponent } from "./layout/main/main.component";
import { SettingComponent } from "./setting/setting/setting.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        component: DashboardComponent,
      },
      {
        path: "exam",
        component: ExamComponent,
      },

      {
        path: "settings",
        component: SettingComponent,
      },
    ],
  },
  {
    path: "exam/:id",
    component: TakeExamComponent,
  },
  {
    path: "exam/:id/success",
    component: ExamMessageComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
