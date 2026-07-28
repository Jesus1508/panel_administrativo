import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

export interface Recurso {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  archivoUrl: string;
  archivoNombre: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class RecursoService {
  constructor(private http: HttpClient) {}

  listPublicos() {
    return firstValueFrom(this.http.get<ApiResponse<Recurso[]>>(`${API_URL}/recursos`));
  }

  create(formData: FormData) {
    return firstValueFrom(this.http.post<ApiResponse<Recurso>>(`${API_URL}/recursos/admin`, formData));
  }

  remove(id: number) {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${API_URL}/recursos/admin/${id}`));
  }
}
