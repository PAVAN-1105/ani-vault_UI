// 1. Import computed from core, and FormsModule from forms
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AnimeCard } from '../anime-card/anime-card';
import { AnimeService } from '../anime.service';
import { Anime } from '../anime';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. Add FormsModule to imports
  imports: [AnimeCard, FormsModule], 
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private animeService = inject(AnimeService);
  
  // Our master list of animes from the database
  animes = signal<Anime[]>([]);

  // 3. A signal to hold whatever the user types into the search box
  searchTerm = signal('');

  // --- NEW: Signals to hold the new form data ---
  newTitle = signal('');
  newEpisodes = signal<number | null>(null);

  // 4. A Computed Signal! 
  // This automatically watches 'searchTerm' and 'animes'. 
  // If either one changes, it instantly recalculates the filtered list.
  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.animes().filter(anime => 
      anime.title.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadAnimes();
  }

  // --- NEW: Helper function to fetch data so we can reuse it! ---
  loadAnimes() {
    this.animeService.getAnimes().subscribe({
      next: (data) => this.animes.set(data),
      error: (err) => console.error("Error fetching data:", err)
    });
  }

  // --- NEW: The function that runs when you click "Add Anime" ---
  createNewAnime() {
    // Make sure the fields aren't empty
    if (!this.newTitle() || !this.newEpisodes()) return;

    // Package the data into an Anime object
    const newAnimeData: Anime = {
      id: Date.now(), // Generate a random ID for the route
      title: this.newTitle(),
      episodes: this.newEpisodes()!,
      status: "Ongoing",
      // Generates a placeholder image with the anime's title
      imageUrl: `https://placehold.co/400x600/purple/white?text=${this.newTitle().replace(/ /g, '+')}`
    };

    // Send it to the backend!
    this.animeService.addAnime(newAnimeData).subscribe({
      next: (savedAnime) => {
        console.log("Successfully saved to database:", savedAnime);
        
        // Clear the form boxes
        this.newTitle.set('');
        this.newEpisodes.set(null);
        
        // Refresh the list to show the new anime instantly!
        this.loadAnimes();
      },
      error: (err) => console.error("Error saving anime:", err)
    });
  }

  handleFavorite(selectedAnime: Anime) {
    alert(`Added to Favorites: ${selectedAnime.title}!`);
  }
  // NEW: Handle the delete event
  handleDelete(id: number) {
    // Add a quick confirmation so you don't accidentally click it
    if (confirm("Are you sure you want to delete this anime?")) {
      this.animeService.deleteAnime(id).subscribe({
        next: () => {
          console.log(`Anime ${id} deleted!`);
          // Refresh the data instantly!
          this.loadAnimes(); 
        },
        error: (err) => console.error("Error deleting anime:", err)
      });
    }
  }
}
