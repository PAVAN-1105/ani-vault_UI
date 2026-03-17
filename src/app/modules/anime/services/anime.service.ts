import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anime } from '../../../core/models/anime'; 

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private dataUrl = 'https://ani-vault-backend.onrender.com/api/animes';

  getAnimes(): Observable<Anime[]> {
    return this.http.get<Anime[]>(this.dataUrl);
  }

  getAnimeById(id: string): Observable<Anime | undefined> {
    return this.http.get<Anime[]>(this.dataUrl).pipe(
      // ✅ FIX: String(anime.id) happens FIRST, then it compares to id!
      map(animes => animes.find(anime => String(anime.id) === id || (anime as any)._id === id))
    );
  }

  addAnime(newAnime: Anime): Observable<Anime> {
    return this.http.post<Anime>(this.dataUrl, newAnime);
  }

  updateAnime(anime: Anime): Observable<Anime> {
    return this.http.put<Anime>(`${this.dataUrl}/${anime.id}`, anime);
  }

  // Note: If you eventually delete animes by MongoDB string ID, 
  // you might need to change this parameter to `id: string` later too!
  deleteAnime(id: number): Observable<any> {
    return this.http.delete(`${this.dataUrl}/${id}`);
  }
}