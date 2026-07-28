import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios-admin.html',
})
export class UsuariosAdmin implements OnInit {
  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  error = signal('');

  nombre = '';
  email = '';
  password = '';

  constructor(
    private usuarioService: UsuarioService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.usuarioService
      .list()
      .then((res) => this.usuarios.set(res.data))
      .finally(() => this.cargando.set(false));
  }

  async crear() {
    this.error.set('');
    this.guardando.set(true);
    try {
      await this.usuarioService.create(this.nombre, this.email, this.password);
      this.nombre = '';
      this.email = '';
      this.password = '';
      this.cargar();
    } catch (err: any) {
      this.error.set(err?.error?.message || 'Error al crear el usuario');
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(usuario: Usuario) {
    if (!confirm(`¿Eliminar al usuario "${usuario.nombre}"?`)) return;
    try {
      await this.usuarioService.remove(usuario.id);
      this.cargar();
    } catch (err: any) {
      alert(err?.error?.message || 'Error al eliminar el usuario');
    }
  }
}
