import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { UserModel } from "src/app/model/user.model";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
