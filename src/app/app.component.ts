import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { StorageService } from './services/storage';

register (); 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService) {}
  async ngOnInit() {

    await this.storageService.remove('intro');
    await this.storageService.set('login', false);

  }
}
