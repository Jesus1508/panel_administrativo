import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  error = signal('');
  cargando = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async iniciarSesion() {
    this.error.set('');
    this.cargando.set(true);
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/admin/paginas']);
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Error al iniciar sesión');
    } finally {
      this.cargando.set(false);
    }
  }
}
