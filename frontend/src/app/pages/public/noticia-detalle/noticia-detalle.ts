import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService, Noticia } from '../../../core/services/noticia.service';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticia-detalle.html',
})
export class NoticiaDetalle implements OnInit {
  noticia = signal<Noticia | null>(null);
  cargando = signal(true);
  error = signal(false);

  constructor(
    private route: ActivatedRoute,
    private noticiaService: NoticiaService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) return;
      this.cargando.set(true);
      this.error.set(false);
      this.noticiaService
        .getBySlug(slug)
        .then((res) => this.noticia.set(res.data))
        .catch(() => this.error.set(true))
        .finally(() => this.cargando.set(false));
    });
  }
}
