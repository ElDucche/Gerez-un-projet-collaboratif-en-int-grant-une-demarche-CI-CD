import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Joke } from './model/joke.model';
import { JokesService } from './services/jokes.service';

/**
 * BobApp - Main Application Component
 * 
 * CI/CD Pipeline Validation:
 * - Frontend CI: Linting + Tests + Coverage + Build
 * - SonarQube: Quality analysis with npm cache
 * - Docker Deploy: Multi-service smoke tests
 * 
 * @author OpenClassrooms P10
 * @version 1.0.0
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
