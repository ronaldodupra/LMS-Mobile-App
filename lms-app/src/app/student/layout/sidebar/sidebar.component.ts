import { Component, OnInit } from "@angular/core";
interface MenuItem {
  route: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    route: "/student/",
    label: "Home",
    icon: "home",
  },
  {
    route: "/student/exam",
    label: "Exam",
    icon: "pencil-outline",
  },
  {
    route: "/student/settings",
    label: "Settings",
    icon: "settings-outline",
  },
];
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  readonly menuItems: MenuItem[] = menuItems;
  constructor() {}

  ngOnInit() {}
}
