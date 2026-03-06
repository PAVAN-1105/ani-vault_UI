import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // ActivatedRoute reads the URL
import { AnimeService } from '../anime.service';
import { Anime } from '../anime';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [RouterModule], 
  templateUrl: './anime-detail.html'
})
export class AnimeDetail implements OnInit {
  // 1. MODERN INJECTION
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService);

  // 2. MODERN REACTIVITY (SIGNALS)
  // This signal holds a single Anime object, but it starts as 'undefined' until the data arrives.
  anime = signal<Anime | undefined>(undefined);

  ngOnInit(): void {
    // 3. READ THE URL
    // Grab the ID from the URL (e.g., from /detail/2, it extracts the string "2")
    const idParam = this.route.snapshot.paramMap.get('id');
    
    // Convert the string "2" into a Number
    const id = Number(idParam);

    // 4. FETCH THE DATA
    if (id) {
      this.animeService.getAnimeById(id).subscribe({
        next: (data: Anime | undefined) => {
          // Update the signal with the specific anime's data
          this.anime.set(data);
        },
        error: (err: Error) => {
          console.error("Failed to load anime details:", err);
        }
      });
    }
  }
}