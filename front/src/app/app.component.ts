import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Joke } from './model/joke.model';
import { JokesService } from './services/jokes.service';

/**
 * Main application component
 * Test modification to trigger Frontend CI pipeline
 * This will test the complete CI/CD workflow with optimized pipelines
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public joke$: Observable<Joke | null> = this.jokesService.joke$();

  constructor(private jokesService: JokesService) {
  }

  // Initialize component and fetch first joke
  public ngOnInit(): void {
    this.getRandomJoke();
  }

  // Fetch a random joke from the service
  public getRandomJoke(): void {
    this.jokesService.getRandomJoke();
  }
}
