import { Injectable } from '@angular/core';
import { loginCredentials, registerCredentials } from '../models/auth-models';
import { StorageService } from './storage';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  email = '';
  password = '';
  loggedIn = false;
  url = 'https://music.fly.dev';

  constructor(private storage: StorageService, private http: HttpClient) {}

  async loadStorageData() {
    const [savedEmail, savedPassword] = await Promise.all([
      this.storage.get('email'),
      this.storage.get('password'),
    ]);
    this.email = savedEmail || '';
    this.password = savedPassword || '';
  }

  async loginUser(credentials: loginCredentials) {
    const body = {
      user: {
        email: credentials.email,
        password: credentials.password
      }
    };
    try {
      const response: any = await firstValueFrom(this.http.post(this.url + '/login', body));
      if (response && response.status === 'OK') {
        await this.storage.set('login', true);
        await this.storage.set('user', response.user);
        await this.storage.set('email', credentials.email);
        await this.storage.set('password', credentials.password);
        console.log('Login successful:', response);
        return response;
      } else {
        throw new Error(response?.msg || 'Login Incorrecto');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.error?.msg || error?.message || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
  }

  async registerUser(credentials: registerCredentials) {
    const body = {
      user: {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        last_name: credentials.last_name
      }
    };
    try {
      const response: any = await firstValueFrom(
        this.http.post(this.url + '/signup', body)
      );
      
      if (response && response.status === 'OK') {
        console.log('Registration successful:', response);
        return response;
      } else {
        throw new Error(response?.msg || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'ojo con eso';
      
      if (error?.error?.msg) {
        errorMessage = error.error.msg;
      } else if (error?.error?.errors) {
        const errors = error.error.errors;
        errorMessage = Object.values(errors).join(', ');
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const loginStatus = await this.storage.get('login');
    return loginStatus === true;
  }

  async logout() {
    await this.storage.remove('login');
    await this.storage.remove('user');
    await this.storage.remove('email');
    await this.storage.remove('password');
    console.log('Logout successful');
  }
}

export { loginCredentials, registerCredentials };