import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginaService, Pagina } from '../../../core/services/pagina.service';

@Component({
  selector: 'app-paginas-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paginas-admin.html',
})
export class PaginasAdmin implements OnInit {
  paginas = signal<Pagina[]>([]);
  cargando = signal(true);
  editando = signal<Pagina | null>(null);

  titulo = '';
  contenido = '';
  orden = 1;
  publicada = true;

  constructor(private paginaService: PaginaService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.paginaService
      .listAdmin()
      .then((res) => this.paginas.set(res.data))
      .finally(() => this.cargando.set(false));
  }

  editar(pagina: Pagina) {
    this.editando.set(pagina);
    this.titulo = pagina.titulo;
    this.contenido = pagina.contenido;
    this.orden = pagina.orden;
    this.publicada = pagina.publicada;
  }

  cancelarEdicion() {
    this.editando.set(null);
    this.titulo = '';
    this.contenido = '';
    this.orden = 1;
    this.publicada = true;
  }

  async guardar() {
    const data = { titulo: this.titulo, contenido: this.contenido, orden: this.orden, publicada: this.publicada };
    const actual = this.editando();
    if (actual?.id) {
      await this.paginaService.update(actual.id, data);
    } else {
      await this.paginaService.create(data);
    }
    this.cancelarEdicion();
    this.cargar();
  }

  async eliminar(pagina: Pagina) {
    if (!confirm(`¿Eliminar la página "${pagina.titulo}"?`)) return;
    await this.paginaService.remove(pagina.id!);
    this.cargar();
  }
}
