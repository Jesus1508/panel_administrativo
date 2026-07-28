import { Component, OnInit, signal } from '@angular/core';
import { RecursoService, Recurso } from '../../../core/services/recurso.service';

@Component({
  selector: 'app-recursos',
  standalone: true,
  templateUrl: './recursos.html',
})
export class Recursos implements OnInit {
  recursos = signal<Recurso[]>([]);
  cargando = signal(true);

  constructor(private recursoService: RecursoService) {}

  ngOnInit() {
    this.recursoService
      .listPublicos()
      .then((res) => this.recursos.set(res.data))
      .finally(() => this.cargando.set(false));
  }
}
