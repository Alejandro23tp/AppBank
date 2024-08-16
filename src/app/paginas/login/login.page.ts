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
      ci: ['', [Validators.required]],
      clave: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { ci, clave } = this.loginForm.value;
      this.loginService.login(ci, clave).subscribe(
        async (response) => {
          if (response.data && response.data.length > 0) {
            this.errorMessage = ''; // Clear any previous error message
            // Save the logged user CI
            //this.loginService.setLoggedUserCI(ci);
            // Navigate to another page or handle successful login
            this.navCtrl.navigateForward('/principal');
            const ObjJSON = response.data[0];
            console.log(ObjJSON.usr_usuario);
            this.loginService.setUsrId(ObjJSON.usr_id);
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
