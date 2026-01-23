import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonicModule,
  LoadingController,
  AlertController,
  ToastController
} from '@ionic/angular';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    CommonModule,
    IonicModule,            
    ReactiveFormsModule
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  showPassword = false;

  validation_messages = {
    nombre: [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'minlength', message: 'El nombre debe tener al menos 2 caracteres.' }
    ],
    apellido: [
      { type: 'required', message: 'El apellido es requerido.' },
      { type: 'minlength', message: 'El apellido debe tener al menos 2 caracteres.' }
    ],
    email: [
      { type: 'required', message: 'El email es requerido.' },
      { type: 'email', message: 'Ingresa un email válido.' }
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres.' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.errors && control.touched);
  }

getErrorMessage(field: 'nombre' | 'apellido' | 'email' | 'password'): string {
  const control = this.registerForm.get(field);

  if (control && control.errors && control.touched) {
    const messages = this.validation_messages[field];

    for (const error of messages) {
      if (control.errors[error.type]) {
        return error.message;
      }
    }
  }

  return '';
}

  async onRegister() {
    if (!this.registerForm.valid) {
      Object.values(this.registerForm.controls).forEach(c => c.markAsTouched());
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    this.authService.register(this.registerForm.value).subscribe({
      next: async (res: { success: boolean; message: string }) => {
        await loading.dismiss();

        if (res.success) {
          const alert = await this.alertCtrl.create({
            header: 'Registro exitoso',
            message: res.message,
            buttons: [{
              text: 'OK',
              handler: () => this.router.navigate(['/login'])
            }]
          });
          await alert.present();
        } else {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: res.message,
            buttons: ['OK']
          });
          await alert.present();
        }
      },
      error: async () => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Error inesperado',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

