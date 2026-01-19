import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {

    const introVista = await this.storageService.get('intro_vista');

    if (introVista === true) {
      return true; // deja pasar al home
    }

    this.router.navigateByUrl('/intro'); // redirige a intro
    return false;
  }
}
   // obtener del storage si ya vi la intro y dependiendo del resultado dejar pasar o no hacia el home [LISTA]
   // en caso false (osea no he visto la intro aun) redireccionar con angular router hacia la intro nuevamente [LISTA]