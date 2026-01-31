import { Injectable } from '@angular/core';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private storageService: StorageService) {}

  async searchUser(credentials: any): Promise<{ login: boolean; intro: boolean } | null> {
    const user = await this.storageService.get('user');
    if (user && user.email === credentials.email && user.password === credentials.password) {
      return { login: true, intro: user.intro };
    }
    return null;
  }

  async loginUser(credentials: any) {
    return new Promise(async (accept, reject) => {
      const result = await this.searchUser(credentials);
      if (result) {
        await this.storageService.set('login', result.login);
        await this.storageService.set('intro', result.intro);
        accept('login correcto');
      } else {
        reject('login incorrecto');
      }
    });
  }

  register(userData: any) {
    return {
      subscribe: async ({ next, error }: any) => {
        if (userData.email && userData.password) {

          const user = { ...userData, intro: false };
          await this.storageService.set('user', user);
          await this.storageService.set('intro', false);
          next({
            success: true,
            message: 'Usuario registrado correctamente'
          });
        } else {
          next({
            success: false,
            message: 'Datos inválidos: ' + error
          });
        }
      }
    };
  }
}

// crear pagina de registro
// vamos a crear formulario reactivo (nombre,apellido,email,contraseña)
// crear un servicio que reciba los datos ingresados
// si el servicio devuelve accep, navegar hacia login y guardar los datos del registro en el stroge
// validaciones (mensajes de error)
// se habilite el boton de registro si todo el formulario esta correcto
// un boton para volver a login *em login un boton que me lleve a la pagina de registro
// si no que muestre el mensaje de error si el registro no fue existoso
