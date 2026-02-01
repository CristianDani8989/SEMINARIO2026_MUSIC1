import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  url = 'https://music.fly.dev';

  constructor() {}

  async getTraks() {
    return fetch(`${this.url}/tracks`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching tracks:', error);
        throw error;
      });
  }

  async getAlbums() {
    return fetch(`${this.url}/albums`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching albums:', error);
        throw error;
      });
  }

  async getSongsByAlbum(id: string) {
    return fetch(`${this.url}/tracks/album/${id}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching album:', error);
        throw error;
      });
  }

  async getArtists() {
    return fetch(`${this.url}/artists`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching artists:', error);
        throw error;
      });
  }

  async getSongsByArtists(id: string) {
    return fetch(`${this.url}/tracks/artist/${id}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching artist:', error);
        throw error;
      });
  }
}