import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ExamModule } from "./exam/exam.module";
import { LayoutModule } from "./layout/layout.module";
import { SettingModule } from "./setting/setting.module";
import { StudentRoutingModule } from "./student-routing";

@NgModule({
  imports: [
    SharedModule,
    StudentRoutingModule,
    LayoutModule,
    ExamModule,
    SettingModule,
    DashboardModule,
  ],
})
export class StudentModule {}
