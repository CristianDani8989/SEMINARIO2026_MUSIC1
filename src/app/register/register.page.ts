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
import { registerCredentials } from '../services/auth';

const VALIDATOR_MESSAGES: Record<string, { type: string; message: string }[]> =
  {
    name: [{ type: 'required', message: 'Nombre obligatorio' }],
    apellido: [{ type: 'required', message: 'Apellido obligatorio' }],
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
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: any = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastController: ToastController,
    private readonly authService: AuthService,
    private readonly navCtrl: NavController,
    private readonly storageService: StorageService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }

  hasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.touched || control.valid) return '';

    const error = VALIDATOR_MESSAGES[field]?.find((v) =>
      control.hasError(v.type)
    );
    
    return error?.message || '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async presentToast(field: string) {
    const control = this.registerForm.get(field);
    if (!control || !control.touched || control.valid) return;

    const error = VALIDATOR_MESSAGES[field].find((v) =>
      control.hasError(v.type)
    );
    if (!error) return;

    const toast = await this.toastController.create({
      message: error.message,
      duration: 1500,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }

  async register() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Por favor completa todos los campos correctamente',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const credentials: registerCredentials = {
      name: this.registerForm.value.name,
      last_name: this.registerForm.value.apellido,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    await this.registerUser(credentials);
  }

  async registerUser(credentials: registerCredentials) {
    try {
      const response = await this.authService.registerUser(credentials);

      await this.storageService.set('name', credentials.name);
      await this.storageService.set('last_name', credentials.last_name);
      await this.storageService.set('email', credentials.email);
      await this.storageService.set('registered', true);

      const toast = await this.toastController.create({
        message: '¡Registro exitoso!',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      this.navCtrl.navigateForward('/login');
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al registrar, valida';
      
      await this.storageService.set('registered', false);

      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}