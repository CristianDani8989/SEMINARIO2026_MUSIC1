import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IntroPage implements OnInit {

  //organizar todo el intro con slides dinamicos [LISTA]
  //minimo 4 slides [LISTA]
  //utilizar variables css [LISTA]
  //utilizar css utilidades [LISTA]
  // agregar un botton que nos lleve al home [LISTA]

  colorActual = 'color-base';

  genres = [
    {
      title: 'Bienvenidos',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdw3L4V1hS2jJ2Crt_BCR0kzlu6T0bvyUxyQ&s',
      description: 'Bienvenido a la app de musica 2026 con las mejores canciones de los mejores artistas.'
    },
    {
      title: 'A tu gusto',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...',
      description: 'Crea o guarda con la mejor calidad tus playList para poder escuchar en cualquier momento y en cualquier lugar.'
    },
    {
      title: 'Configura',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKm5mNp4fr0Cg_c0PpfrSnBiG51AunJ4V0vw&s',
      description: 'Todo a tu gusto y medida.'
    },
    {
      title: 'Disfruta',
      image: 'https://i.blogs.es/286f01/captura-de-pantalla-2025-06-05-a-las-10.36.48/500_333.jpeg',
      description: 'Explora todos tus gustos y generos a tu gusto y personalidad.'
    }
  ];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    const theme = await this.storageService.get('theme');
    if (theme) {
      this.colorActual = theme;
    }
  }

  goBack() {

    this.storageService.set('intro', true);

    this.router.navigateByUrl('/menu/home');

    // al volver atras o volver al home guardar en el storage que ya estuve o vi la pagina de intro [LISTA]
  }
}



