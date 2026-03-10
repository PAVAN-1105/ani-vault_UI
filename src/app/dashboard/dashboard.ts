import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AnimeCard } from '../anime-card/anime-card';
import { AnimeService } from '../anime.service';
import { AuthService } from '../auth'; // Adjust path if necessary
import { Anime } from '../anime';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AnimeCard, FormsModule], 
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private animeService = inject(AnimeService);
  public authService = inject(AuthService);
  
  animes = signal<Anime[]>([]);
  searchTerm = signal('');
  newTitle = signal('');
  newEpisodes = signal<number | null>(null);
  
  // --- NEW: Signal for Filtering by Status ---
  filterStatus = signal<'All' | 'Watching' | 'Completed' | 'Plan to Watch'>('All');

  // --- Signal for Watching Status (Adding New Anime) ---
  newStatus = signal<'Watching' | 'Completed' | 'Plan to Watch'>('Watching');

  // --- Track the anime targeted for deletion for the Custom Modal ---
  animeToDelete = signal<Anime | null>(null);

  // --- Statistics Calculations ---
  totalAnimes = computed(() => this.animes().length);
  totalEpisodes = computed(() => 
    this.animes().reduce((sum, anime) => sum + (anime.episodes || 0), 0)
  );

  // --- UPDATED: Now filters by BOTH search term and status dropdown ---
  filteredAnimes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.filterStatus();

    return this.animes().filter(anime => {
      // 1. Check if title matches search term
      const matchesSearch = anime.title.toLowerCase().includes(term);
      // 2. Check if status matches dropdown (or if 'All' is selected)
      const matchesStatus = status === 'All' || anime.status === status;
      
      // 3. Keep anime only if it passes both checks
      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit(): void {
    this.loadAnimes();
  }

  loadAnimes() {
    this.animeService.getAnimes().subscribe({
      next: (data) => this.animes.set(data),
      error: () => this.authService.showToast("Failed to load vault", true)
    });
  }

  createNewAnime() {
    if (!this.newTitle() || !this.newEpisodes()) {
      this.authService.showToast("Missing title or episodes!", true);
      return;
    }

    const newAnime: Anime = {
      id: Date.now(),
      title: this.newTitle(),
      episodes: this.newEpisodes()!,
      status: this.newStatus(), // Uses the selected status
      imageUrl: `https://placehold.co/400x600/purple/white?text=${this.newTitle().replace(/ /g, '+')}`
    };

    this.animeService.addAnime(newAnime).subscribe({
      next: (savedAnime) => {
        this.authService.showToast(`🚀 ${savedAnime.title} added to ${savedAnime.status}!`);
        this.newTitle.set('');
        this.newEpisodes.set(null);
        this.newStatus.set('Watching'); // Reset to default
        this.loadAnimes();
      },
      error: () => this.authService.showToast("Error saving anime", true)
    });
  }

  // --- CUSTOM MODAL FLOW ---
  handleDelete(anime: Anime) {
    this.animeToDelete.set(anime);
  }

  closeModal() {
    this.animeToDelete.set(null);
  }

  confirmDelete() {
    const anime = this.animeToDelete();
    if (anime) {
      this.animeService.deleteAnime(anime.id).subscribe({
        next: () => {
          this.loadAnimes(); 
          this.authService.showToast(`${anime.title} removed from vault.`, false);
          this.closeModal();
        },
        error: () => {
          this.authService.showToast("Delete failed!", true);
          this.closeModal();
        }
      });
    }
  }
}