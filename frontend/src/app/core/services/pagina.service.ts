import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../config';

export interface Pagina {
  id?: number;
  titulo: string;
  slug?: string;
  contenido: string;
  orden: number;
  publicada: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PaginaService {
  constructor(private http: HttpClient) {}

  listPublicas() {
    return firstValueFrom(this.http.get<ApiResponse<Pagina[]>>(`${API_URL}/paginas`));
  }

  getBySlug(slug: string) {
    return firstValueFrom(this.http.get<ApiResponse<Pagina>>(`${API_URL}/paginas/${slug}`));
  }

  listAdmin() {
    return firstValueFrom(this.http.get<ApiResponse<Pagina[]>>(`${API_URL}/paginas/admin/todas`));
  }

  create(data: Partial<Pagina>) {
    return firstValueFrom(this.http.post<ApiResponse<Pagina>>(`${API_URL}/paginas/admin`, data));
  }

  update(id: number, data: Partial<Pagina>) {
    return firstValueFrom(this.http.put<ApiResponse<Pagina>>(`${API_URL}/paginas/admin/${id}`, data));
  }

  remove(id: number) {
    return firstValueFrom(this.http.delete<ApiResponse<null>>(`${API_URL}/paginas/admin/${id}`));
  }
}
