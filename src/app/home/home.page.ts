import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomePage implements OnInit {
  //color base
  colorClaro = 'var(--color-claro)';
  colorOscuro = 'var(--color-oscuro)';
  //colores del slide
  colorSlideTitle = 'var(--color-slide-title)';
  colorSlideTexto = 'var(--color-texto-slide)';
  //estados actuales
  colorActual = this.colorOscuro;
  temaActual = this.colorSlideTitle;


  //[actividad 1 (lista)] 
  //[actividad 2 (lista)]
  genres =  [
    {
      title: "Musica vallenato",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9qZuxaQK69BctFFKx0XSvw2jhbdCyqg5Lw&s",
      description: "El vallenato es un género musical folclórico colombiano de la Costa Caribe, caracterizado por el sonido del acordeón, la caja y la guacharaca, interpretando ritmos como el paseo, merengue, son y puya, con letras que narran historias, amores y la vida cotidiana, y fue declarado Patrimonio Cultural Inmaterial por la UNESCO."
    },
    {
      title: "Musica salsera",
      image: "https://play-lh.googleusercontent.com/IELnWTlnM7jl14-vjJx5oOa9KF7MCn5eSXZWqlu7SBpUWHgdpoe6LuuN6OqpqaN0GgM",
      description: "La salsa es un género musical vibrante y rítmico, nacido en Nueva York con raíces profundas en los ritmos afrocaribeños cubanos (son, mambo, chachachá, rumba) y puertorriqueños (bomba, plena), fusionado con jazz y otros estilos latinoamericanos, caracterizado por su fuerte percusión (clave, congas, timbales) y letras que reflejan la vida latina, el amor, la lucha y la identidad cultural, creada para bailar y celebrar la herencia cultural."
    },
    {
      title: "Musica baladas",
      image: "https://s3.amazonaws.com/eventtia/event_files/45247/large/balada1920x102416022749881602274988.jpg?1602274987",
      description: "La música balada es un género narrativo lento y melódico, con raíces en poemas medievales que contaban historias, evolucionando en la música popular a canciones románticas sobre amor y desamor, caracterizadas por ritmos suaves, letras emotivas y una estructura lírica que a menudo usa estribillos repetitivos para enfatizar emociones profundas y crear conexión con el oyente."
    },
  ]
  constructor(
    private storageService: StorageService,
    private router: Router) {}

  async ngOnInit(){
    await this.loadStorageData();
    this.simularCargaDatos(); 
  }

  async cambiarColor() {
    //if ternario
   this.colorActual = this.colorActual === this.colorOscuro ? this.colorClaro : this.colorOscuro
   await this.storageService.set('theme', this.colorActual)
   console.log('tema Guardado:', this.colorActual )


  }
  cambiarTema() {
  this.temaActual =
    this.temaActual === this.colorSlideTitle
      ? this.colorSlideTexto
      : this.colorSlideTitle;
}

async loadStorageData(){
   const savedTheme = await this.storageService.get('Theme')
   if (savedTheme) {
    this.colorActual = savedTheme
   }
}

async simularCargaDatos() {
  const data = await this.obtenerDatoSimulados();
  console.log('Datos simulados: ', data)
}

obtenerDatoSimulados(){
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve (['Rock', 'Vallenato', 'Trap'])
    }, 1500)
  })
}

// Crear una funcion para ir a ver la intro se va a conectar con una funcion que debemos agregar en el html y al hacer click ejecute esta funcion para llevarme  a ver la intro  [LISTA]
verIntro() {
    this.router.navigateByUrl('/intro');
  }
}


