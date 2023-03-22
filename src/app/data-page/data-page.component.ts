import { Component, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Note } from '../models/note-model';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {

  //############################################################
  // JEST BARDZIEJ FIKUŚNY SPOSÓB NA OBSŁUGE BŁĘDÓW PRZY ASYNC PIPE
  // ZAPOZNAĆ SIĘ Z NIM POTEM

  // LINK: https://eliteionic.com/tutorials/handle-errors-reactively-when-using-async-pipe/
  //############################################################

  errorMessage: string;
  notes$: Observable<Note[]> = this.firebaseService.getNotes().pipe(catchError(response => {
    this.errorMessage = response.error.error;
    return throwError(() => response);
  }));

  constructor(
    protected firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    //this.firebaseService.seedDataBase();
  }
}
