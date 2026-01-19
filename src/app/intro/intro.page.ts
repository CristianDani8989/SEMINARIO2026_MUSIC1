import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IntroPage implements OnInit {

  constructor(private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
  }

  goBack(){
  this.storageService.set('intro_vista', true);
  console.log ("volver")
  this.router.navigateByUrl("/home");
  // al volver atras o volver al home guardar en el storage que ya estuve o vi la pagina de intro [LISTA]

  }
}
