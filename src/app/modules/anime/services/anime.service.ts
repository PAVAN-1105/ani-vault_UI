import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Anime } from '../../../core/models/anime'; // ✅ Updated path

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private dataUrl = 'https://ani-vault-backend.onrender.com/api/animes';
  //private dataUrl = 'http://localhost:3000/api/animes';

  // ✂️ Look! We completely deleted the getHeaders() helper method!

  getAnimes(): Observable<Anime[]> {
    // ✂️ No more { headers: this.getHeaders() } needed anywhere!
    return this.http.get<Anime[]>(this.dataUrl);
  }

  getAnimeById(id: number): Observable<Anime | undefined> {
    return this.http.get<Anime[]>(this.dataUrl).pipe(
      map(animes => animes.find(anime => anime.id === Number(id)))
    );
  }

  addAnime(newAnime: Anime): Observable<Anime> {
    return this.http.post<Anime>(this.dataUrl, newAnime);
  }

  updateAnime(anime: Anime): Observable<Anime> {
    return this.http.put<Anime>(`${this.dataUrl}/${anime.id}`, anime);
  }

  deleteAnime(id: number): Observable<any> {
    return this.http.delete(`${this.dataUrl}/${id}`);
  }
}