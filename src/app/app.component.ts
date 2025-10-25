import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }


  async initializeApp() {
    await SplashScreen.show({ autoHide: false });
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }
}
