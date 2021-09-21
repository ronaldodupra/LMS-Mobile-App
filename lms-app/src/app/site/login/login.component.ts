import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    username: [null],
    password: [null],
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  errorMessage: string;
  ngOnInit() {}
  login() {
    this.authService
      .login(this.formGroup.value.username, this.formGroup.value.password)
      .subscribe((data) => {
        console.log(data);
        if (data.token) {
          console.log(data.token);
          localStorage.setItem("token", data.token);
          this.router.navigate(["student"]);
        } else {
          this.errorMessage = data;
        }
      });
  }
}
