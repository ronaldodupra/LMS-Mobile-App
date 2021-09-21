import { Component } from "@angular/core";

import { AlertController, Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { NetworkService } from "./services/network.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  connetionStatus: string = "Online";
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertController: AlertController,
    private networkService: NetworkService,
    private toastController: ToastController
  ) {
    this.networkSubscriber();
    this.initializeApp();
  }
  // async connectionErrorAlert() {
  //   const alert = await this.alertController.create({
  //     cssClass: "my-custom-class",
  //     header: "Connect to a Network",
  //     message: "",

  //     buttons: [
  //       {
  //         text: "Exit",
  //         handler: () => {
  //           this.exitApp();
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }
  async connectionErrorToast() {
    const toast = await this.toastController.create({
      message: `<ion-icon name="warning-outline"></ion-icon> No Internet Connection!`,
      color: "dark",
      cssClass: "topToastCss",
      position: "top",
    });
    toast.present();
  }
  isConnected: boolean = false;

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  networkSubscriber(): void {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      console.log("[Home] isConnected", connected);
      this.handleNotConnected(this.isConnected);
    });
  }

  handleNotConnected(status: boolean) {
    if (status) {
      if (this.connetionStatus != "Online") {
        this.connetionStatus = "Online";
        this.isConnected = true;
        //window.location.reload();
      }
    } else {
      if (this.connetionStatus != "Offline") {
        this.isConnected = false;
        this.connetionStatus = "Offline";
        this.connectionErrorToast();
      }
    }
  }
  exitApp() {
    navigator["app"].exitApp();
  }
}
