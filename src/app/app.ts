import { Component, signal, inject } from '@angular/core'; // Added inject here
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth'; // Ensure this matches your filename

@Component({
  selector: 'app-root',
  standalone: true, // Ensure standalone is true if you aren't using Modules
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Anime Vault');
  
  // Use 'public' so your HTML template can see authService.currentUserSignal()
  public authService = inject(AuthService); 
}