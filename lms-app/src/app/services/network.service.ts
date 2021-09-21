import { Injectable } from "@angular/core";
import { Observable, merge, fromEvent, of } from "rxjs";
import { mapTo } from "rxjs/operators";
import { Network } from "@ionic-native/network/ngx";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class NetworkService {
  private online$: Observable<boolean> = undefined;
  constructor(public network: Network, public platform: Platform) {
    this.online$ = Observable.create((observer) => {
      observer.next(true);
    }).pipe(mapTo(true));
    if (this.platform.is("cordova")) {
      this.online$ = merge(
        this.network.onConnect().pipe(mapTo(true)),
        this.network.onDisconnect().pipe(mapTo(false))
      );
    } else {
      this.online$ = merge(
        of(navigator.onLine),
        fromEvent(window, "online").pipe(mapTo(true)),
        fromEvent(window, "offine").pipe(mapTo(false))
      );
    }
  }
  public getNetworkStatus(): Observable<boolean> {
    return this.online$;
  }
  public getNetworkType(): string {
    return this.network.type;
  }
}
