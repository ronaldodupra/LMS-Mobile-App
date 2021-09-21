import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { UserModel } from "src/app/model/user.model";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: UserModel;
  ngOnInit() {
    this.getUserDetails();
  }
  getUserDetails() {
    this.authService.getUserDetails().subscribe((data) => {
      this.user = data;
    });
  }
}
