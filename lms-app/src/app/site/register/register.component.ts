import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { SERVER_URL } from "src/environments/environment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  api: string;
  constructor(private http: HttpClient) {
    this.api = `${SERVER_URL}`;
  }

  ngOnInit() {
    this.register();
  }
  public register() {
    const data = {
      name: "bie",
      username: "dela cruz",
      password: "password",
    };
    this.http
      .post(
        this.api + "/insertuser",
        { data: JSON.stringify(data) },
        {
          headers: new HttpHeaders({
            "contenct-Type": "application/json",
          }),
        }
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
