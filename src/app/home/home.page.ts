import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageService } from 'src/app/services/storage';
import { Router } from '@angular/router';
import { MusicService } from 'src/app/services/music';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit { 

  rotate = 0;
  modoOscuro = false;
  tracks: any;
  albums: any;
  artists: any;
  song: any={
    name: '',
    preview_url: '',
    playing: false
  };
  currentSong: any;
  newTime: any;
  liked: boolean = false;
  favorites: any;
  secciones: any[] = [];

  constructor(private storageServcie: StorageService, private router: Router, private musicService: MusicService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.loadStorageData();
    await this.loadTraks();
    await this.loadAlbums();
    await this.loadArtists();
    this.secciones = [
    {
      titulo: 'Álbumes',
      icono: 'library-outline',
      tipo: 'Álbum',
      items: this.albums,
      accion: (id: string) => this.showSongs(id)
    },
    {
      titulo: 'Artistas',
      icono: 'person-outline',
      tipo: 'Artista',
      items: this.artists,
      accion: (id: string) => this.showSongsByArtists(id)
    },
  ];

  }

  async loadTraks() {
    this.musicService.getTraks().then((tracks) => {
      this.tracks =  tracks;
      console.log('Tracks loaded:', this.tracks);
    }).catch((error) => {
      console.error('Error loading tracks:', error);
    });
  }

  async loadAlbums() {
    this.musicService.getAlbums().then((albums) => {
      this.albums =  albums;
    }).catch((error) => {
      console.error('Error loading tracks:', error);
    });
  }

  async loadArtists() {
    this.musicService.getArtists().then((artists) => {
      this.artists =  artists;
      console.log('Artists loaded:', this.artists);
    }).catch((error) => {
      console.error('Error loading artists:', error);
    });
  }

  async showSongs(albumId: string) {
    console.log('Album ID:', albumId);
    const songs = await this.musicService.getSongsByAlbum(albumId);
    console.log('Songs for album:', songs);
    const modal = await this.modalController.create({
      component: SongsModalPage,
      componentProps: {
        songs: songs,
      } ,
    });
    modal.onDidDismiss().then((result) => {
      if(result.data){
        console.log("cancion recibida ", result.data);
        this.song = result.data;
      }
    })
    await modal.present();
  }

  async showSongsByArtists(songId: string) {
    const song = await this.musicService.getSongsByArtists(songId);
    const modal = await this.modalController.create({
      component: SongsModalPage,
      componentProps: {
        songs: song,
      },
    });
    modal.onDidDismiss().then((result) => {
      if(result.data){
        console.log("cancion recibida ", result.data);
        this.song = result.data;
      }
    })
    await modal.present();
  }

  async cambiarColor() {
    this.modoOscuro = !this.modoOscuro;
    this.rotate = this.modoOscuro ? 180 : 0;

    document.body.classList.toggle('dark-mode', this.modoOscuro);

    await this.storageServcie.set('theme', this.modoOscuro ? 'dark' : 'light');
    console.log('Tema Guardado: ', this.modoOscuro ? 'dark' : 'light');
  }

  async loadStorageData() {
    const savedTheme = await this.storageServcie.get('theme');
    if (savedTheme) {
      this.modoOscuro = savedTheme === 'dark';
      this.rotate = this.modoOscuro ? 180 : 0;
      document.body.classList.toggle('dark-mode', this.modoOscuro);
    }
  }

  goInto() {
    console.log('Volver');
    this.router.navigateByUrl('/intro');
    this.storageServcie.remove('nav');
  }

  play(){
    this.currentSong = new Audio(this.song.preview_url);
    this.currentSong.play();
    this.currentSong.addEventListener("timeupdate", ()=>{
      this.newTime = this.currentSong.currentTime / this.currentSong.duration;
    })
    this.song.playing = true;
  }

  pausa(){
    this.currentSong.pause();
    this.song.playing = false;
  }

  formatTime(seconds: number){
    if(!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds/60);
    const remaningSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remaningSeconds.toString().padStart(2, '0')}`
  }

  toggleLike(){
    this.liked = !this.liked;
    if (this.liked) {
      console.log('Canción marcada como favorita');
    } else {
      console.log('Favorito removido');
    }
  }
}