import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { MainComponent } from "./main/main.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { TopbarComponent } from "./topbar/topbar.component";

@NgModule({
  declarations: [
    MainComponent,
    SidebarComponent,
    SidenavComponent,
    TopbarComponent,
  ],
  imports: [SharedModule],
})
export class LayoutModule {}
