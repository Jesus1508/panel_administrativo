import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoticiaService, Noticia } from '../../../core/services/noticia.service';

@Component({
  selector: 'app-noticias-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './noticias-admin.html',
})
export class NoticiasAdmin implements OnInit {
  noticias = signal<Noticia[]>([]);
  cargando = signal(true);
  editando = signal<Noticia | null>(null);
  guardando = signal(false);

  titulo = '';
  resumen = '';
  contenido = '';
  publicada = false;
  archivoImagen: File | null = null;

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.noticiaService
      .listAdmin()
      .then((res) => this.noticias.set(res.data))
      .finally(() => this.cargando.set(false));
  }

  editar(noticia: Noticia) {
    this.editando.set(noticia);
    this.titulo = noticia.titulo;
    this.resumen = noticia.resumen;
    this.contenido = noticia.contenido;
    this.publicada = noticia.publicada;
    this.archivoImagen = null;
  }

  cancelarEdicion() {
    this.editando.set(null);
    this.titulo = '';
    this.resumen = '';
    this.contenido = '';
    this.publicada = false;
    this.archivoImagen = null;
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivoImagen = input.files?.[0] ?? null;
  }

  async guardar() {
    this.guardando.set(true);
    try {
      const formData = new FormData();
      formData.append('titulo', this.titulo);
      formData.append('resumen', this.resumen);
      formData.append('contenido', this.contenido);
      formData.append('publicada', String(this.publicada));
      if (this.archivoImagen) formData.append('imagen', this.archivoImagen);

      const actual = this.editando();
      if (actual?.id) {
        await this.noticiaService.update(actual.id, formData);
      } else {
        await this.noticiaService.create(formData);
      }
      this.cancelarEdicion();
      this.cargar();
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(noticia: Noticia) {
    if (!confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) return;
    await this.noticiaService.remove(noticia.id!);
    this.cargar();
  }
}
