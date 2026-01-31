import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {

  urlServer= "https://music.fly.dev";
  constructor() { }

  getTracks() {
     return fetch(`${this.urlServer}/tracks`).then(
       response => response.json()
     );
  } 

  getAlmbuns() {
     return fetch(`${this.urlServer}/albums`).then(
       response => response.json()
     );
  }

  getSongsByAlbum(albumId: string){
  return  fetch(`${this.urlServer}/tracks/album/${albumId}`).then(
      response => response.json()
    );
  }
}
