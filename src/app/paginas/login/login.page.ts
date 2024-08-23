import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage: string='';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private loginService: LoginService,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      usr_correo: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const objlogin = this.loginForm.value;
      this.loginService.login(objlogin).subscribe(
        async (response) => {
          
          if (response.cant===1) {
            this.errorMessage = ''; // Clear any previous error message
            this.navCtrl.navigateForward('/principal');
            const ObjJSON = response.data;
            console.log(ObjJSON.usr_usuario);
            this.loginService.setUsrId(ObjJSON.usr_usuario);
          } else {
            this.errorMessage = response.mensaje || 'Credenciales incorrectas';
            const toast = await this.toastCtrl.create({
              message: this.errorMessage,
              duration: 2000,
              position: 'bottom',
              color: 'danger'
            });
            await toast.present();
          }
        },
        async (error) => {
          this.errorMessage = 'Ha ocurrido un error. Por favor, inténtelo de nuevo.';
          const toast = await this.toastCtrl.create({
            message: this.errorMessage,
            duration: 2000,
            position: 'bottom',
            color: 'danger'
          });
          await toast.present();
        }
      );
    }
  }
  
  
}
