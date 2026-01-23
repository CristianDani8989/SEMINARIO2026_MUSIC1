import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  // [TAREA] crear un nuevo guard para cuando intente entrar al home validar si estoy logueada si no redireccionar a login [LISTA]
  loginForm: FormGroup;


  errorMessage: string = "";

  // [TAREA] añadir los validation_message para password [LISTA]

  validation_message =  {
    email: [
      {
        type: "required", message: "el email es obligatorio"
      },
      {
        type: "email", message: "email no es valido"
      }
    ],
      password: [
    {
      type: 'required',
      message: 'la contraseña es obligatoria'
    },
    {
      type: 'minlength',
      message: 'la contraseña debe tener mínimo 6 caracteres'
    }
  ]

  }

  constructor( private formBluider: FormBuilder, private AuthService: AuthService, private navCtrl: NavController ) {
    this.loginForm = this.formBluider.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required, // campo obligatorio
          Validators.email // valida el correo 
        ])
      ),
        password: new FormControl(
        '',
        Validators.compose([
          Validators.required, // campo obligatorio
          Validators.minLength(6)
        ])
    )  
    })
   }

  ngOnInit() {
  }

  loginUser(credentials: any){
    console.log(credentials)
    this.AuthService.loginUser(credentials).then(res =>{
      this.errorMessage = "";
      this.navCtrl.navigateForward("/home")
    }).catch(error => {
      this.errorMessage = error;
    })
    }
  }


