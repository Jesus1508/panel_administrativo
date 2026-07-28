import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecursoService, Recurso } from '../../../core/services/recurso.service';

@Component({
  selector: 'app-recursos-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recursos-admin.html',
})
export class RecursosAdmin implements OnInit {
  recursos = signal<Recurso[]>([]);
  cargando = signal(true);
  guardando = signal(false);

  titulo = '';
  descripcion = '';
  categoria = 'General';
  archivo: File | null = null;

  constructor(private recursoService: RecursoService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.recursoService
      .listPublicos()
      .then((res) => this.recursos.set(res.data))
      .finally(() => this.cargando.set(false));
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
  }

  async guardar() {
    if (!this.archivo) return;
    this.guardando.set(true);
    try {
      const formData = new FormData();
      formData.append('titulo', this.titulo);
      formData.append('descripcion', this.descripcion);
      formData.append('categoria', this.categoria);
      formData.append('archivo', this.archivo);
      await this.recursoService.create(formData);
      this.titulo = '';
      this.descripcion = '';
      this.categoria = 'General';
      this.archivo = null;
      this.cargar();
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(recurso: Recurso) {
    if (!confirm(`¿Eliminar el recurso "${recurso.titulo}"?`)) return;
    await this.recursoService.remove(recurso.id!);
    this.cargar();
  }
}
