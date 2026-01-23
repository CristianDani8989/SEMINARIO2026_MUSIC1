import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {}

  loginUser(credentials: any) {
    return new Promise((accept, reject) => {
      if (
        credentials.email === 'guzmandani503@gmail.com' &&
        credentials.password === '123456'
      ) {
        localStorage.setItem('login', 'true');
        accept('login correcto');
      } else {
        reject('login incorrecto');
      }
    });
  }

  register(userData: any) {
    return {
      subscribe: ({ next, error }: any) => {
        if (userData.email && userData.password) {

          localStorage.setItem('user',JSON.stringify(userData));
          next({
            success: true,
            message: 'Usuario registrado correctamente'
          });
        } else {
          next({
            success: false,
            message: 'Datos inválidos'
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
