import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.html',
})
export class Contacto {
  nombre = '';
  email = '';
  mensaje = '';
  enviado = signal(false);

  enviar() {
    this.enviado.set(true);
    this.nombre = '';
    this.email = '';
    this.mensaje = '';
  }
}
