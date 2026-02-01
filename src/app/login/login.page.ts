import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule, NavController, ToastController } from '@ionic/angular';

import { AuthService } from '../services/auth';
import { StorageService } from '../services/storage';
import { loginCredentials } from '../services/auth';

const VALIDATOR_MESSAGES: Record<string, { type: string; message: string }[]> = {
  email: [
    { type: 'required', message: 'Email obligatorio' },
    { type: 'email', message: 'Email no válido' },
  ],
  password: [
    { type: 'required', message: 'Password obligatorio' },
    {
      type: 'minlength',
      message: 'La contraseña no puede ser menor a 8 caracteres',
    },
  ],
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage: string = '';

  private readonly validatorMessages = VALIDATOR_MESSAGES;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastController: ToastController,
    private readonly authService: AuthService,
    private readonly navController: NavController,
    private readonly storageService: StorageService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  hasError(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.touched || control.valid) return '';

    const error = this.validatorMessages[field]?.find((v) =>
      control.hasError(v.type)
    );
    
    return error?.message || '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.navController.navigateForward('/register');
  }

  async login() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Por favor completa todos los campos correctamente',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const credentials: loginCredentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    await this.loginUser(credentials);
  }

  async loginUser(credentials: loginCredentials) {
    try {
      const response = await this.authService.loginUser(credentials);
      this.errorMessage = '';
      
      await this.storageService.set('login', true);
      await this.storageService.set('email', credentials.email);

      const toast = await this.toastController.create({
        message: '¡Bienvenido! Inicio de sesión exitoso',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    this.storageService.set('login', true);
    this.navController.navigateForward('/intro');

    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
      
      await this.storageService.set('login', false);

      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      
      console.error('Login error:', error);
    }
  }

  async presentToast(field: 'email' | 'password') {
    const control = this.loginForm.get(field);
    if (!control || !control.touched || control.valid) return;

    const error = this.validatorMessages[field].find((v) =>
      control.hasError(v.type)
    );
    if (!error) return;

    const toast = await this.toastController.create({
      message: error.message,
      duration: 1000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}