import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- Make sure this is imported!
import { Anime } from './anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private dataUrl =  'https://anime-tracker-api-2a57.onrender.com';

  constructor(private http: HttpClient) { }

  getAnimes(): Observable<Anime[]> {
    return this.http.get<Anime[]>(this.dataUrl);
  }

  // Make sure this exact function is inside the class!
  getAnimeById(id: number): Observable<Anime | undefined> {
    return this.http.get<Anime[]>(this.dataUrl).pipe(
      map(animes => animes.find(anime => anime.id === id))
    );
  }
  addAnime(newAnime: Anime): Observable<Anime> {
    // We send the newAnime object as the "body" of the request
    return this.http.post<Anime>(this.dataUrl, newAnime);
  }
  deleteAnime(id: number): Observable<any> {
    // We append the ID to the end of the URL (e.g., http://localhost:3000/api/animes/2)
    return this.http.delete(`${this.dataUrl}/${id}`);
  }
}