import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-song-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongModalPage implements OnInit {
  songs: any;

  constructor(
    private navParams: NavParams, 
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.songs = this.navParams.data['songs'];
    console.log('Songs received in modal:', this.songs);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async selectSong(song: any) {
    console.log("cancion seleccionada: ", song);
    await this.modalCtrl.dismiss(song)
  }
}