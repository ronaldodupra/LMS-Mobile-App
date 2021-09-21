import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { AuthGuardLogin } from "./auth/auth.guard.login";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "site",
    pathMatch: "full",
  },
  {
    path: "site",
    loadChildren: () => import("./site/site.module").then((m) => m.SiteModule),
    canActivate: [AuthGuardLogin],
  },
  {
    path: "student",
    loadChildren: () =>
      import("./student/student.module").then((m) => m.StudentModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
