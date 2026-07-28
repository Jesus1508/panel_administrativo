import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginaService, Pagina } from '../../../core/services/pagina.service';

@Component({
  selector: 'app-pagina-detalle',
  standalone: true,
  templateUrl: './pagina-detalle.html',
})
export class PaginaDetalle implements OnInit {
  pagina = signal<Pagina | null>(null);
  cargando = signal(true);
  error = signal(false);

  constructor(
    private route: ActivatedRoute,
    private paginaService: PaginaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;
      this.cargando.set(true);
      this.error.set(false);
      this.paginaService
        .getBySlug(slug)
        .then((res) => this.pagina.set(res.data))
        .catch(() => this.error.set(true))
        .finally(() => this.cargando.set(false));
    });
  }
}
