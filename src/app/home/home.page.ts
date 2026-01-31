import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';  
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage';
import { Router } from '@angular/router'; 
import { ModalController } from '@ionic/angular';


import { MusicService } from '../services/music';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, NgIf],
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
  Song:any = {};
  songSelected:any = {
    name: '',
    preview_url: '',
    duration_ms: null,
    playing:false
  };
  elapsedMs:number = 0;
  progressValue:number = 0;
  loaded: boolean = false;

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
  tracks: any;
  albums: any;

  constructor(
    private modalController: ModalController,
    private musicService: MusicService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit(){
    this.loadAlbums();
    this.loadTracks();
    this.loaded = true;
    await this.loadStorageData();
    this.simularCargaDatos(); 
  }

  loadTracks(){
    this.musicService.getTracks().then(tracks =>{
      this.tracks = tracks;
      console.log(this.tracks, "las canciones")
    })
  }
  loadAlbums(){
    this.musicService.getAlmbuns().then(albums =>{
      this.albums = albums;
      console.log(this.albums, "los albums")
    })
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
    this.router.navigateByUrl('menu/intro');
}

async loadSongsByAlbum(albumId: string){
  const songs = await this.musicService.getSongsByAlbum(albumId);
  const modal = await this.modalController.create({
    component: SongsModalPage,
    componentProps: {
      songs: songs,
    },
  });
  modal.onDidDismiss().then((result) => {
    if(result.data){
      this.songSelected = result.data;
    }
  });
  modal.present();
}

  play(){
    try { if (this.Song && this.Song.pause) { this.Song.pause(); } } catch(e){}

    this.Song = new Audio(this.songSelected.preview_url);

    this.Song.addEventListener('timeupdate', () => {
      const current = this.Song.currentTime || 0; // seconds
      const duration = this.Song.duration || 0; // seconds
      this.elapsedMs = Math.floor(current * 1000);
      this.progressValue = duration > 0 ? (current / duration) : 0;
    });

    this.Song.addEventListener('ended', () => {
      this.songSelected.playing = false;
      this.progressValue = 0;
      this.elapsedMs = 0;
    });

    this.Song.play();
    this.songSelected.playing = true;
  }

  pause(){
    if (this.Song && this.Song.pause) {
      this.Song.pause();
    }
    this.songSelected.playing = false;
  }

  getRemainngTime(){
    if (!this.Song.duration || !this.Song.currentTime) {
      return '0:00';
    }
    const remainingTime = this.Song.duration - this.Song.currentTime;
    return this.formatDuration(remainingTime * 1000);
  }

  formatDuration(durationMs: number): string {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}


