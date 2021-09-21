import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SiteRoutingModule } from "./site-routing.module";
import { SiteComponent } from "./site/site.component";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, SiteComponent],
  imports: [SiteRoutingModule, SharedModule],
})
export class SiteModule {}
