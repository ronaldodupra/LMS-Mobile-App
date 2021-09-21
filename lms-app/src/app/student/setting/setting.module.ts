import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SettingComponent } from "./setting/setting.component";

@NgModule({
  declarations: [SettingComponent],
  imports: [SharedModule],
})
export class SettingModule {}
