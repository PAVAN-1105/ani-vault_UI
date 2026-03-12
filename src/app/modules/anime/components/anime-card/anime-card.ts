import { Component, Input, Output, EventEmitter,ChangeDetectionStrategy } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { Anime } from '../../../../core/models/anime'; // ✅ All the way up to core models
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  imports: [RouterModule, UpperCasePipe],
  templateUrl: './anime-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeCard {
  @Input() animeInfo!: Anime; 

  // --- UPDATED: Both emitters now send the full Anime object ---
  
  @Output() deleteSelected = new EventEmitter<Anime>(); 

  onDeleteClick() {
    
    this.deleteSelected.emit(this.animeInfo);
  }
}