import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../models/note-model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  protected URL_NOTES: string = 'https://auth-test-d6cae-default-rtdb.europe-west1.firebasedatabase.app/notes.json';

  constructor(protected http: HttpClient) { }

  // potrzebna tylko na początku, ponieważ nie istnieje (chyba) sposób na wstrzyknięcie danych do bazy firebase manualnie - z poziomu użytkownika/administratora
  seedDataBase() {
    const notes: Note[] = [
      new Note('Pójść do fryzjera', 'Trzeba pójść do fryzjera. Znaleźć jakiegoś w Warszawie.'),
      new Note('Pogadać z Kostkiem', 'To mój najlepszy kumpel, muszę z nim pogadać od czasy do czasu o pierdołach.'),
      new Note('Wypić piwo', 'Trzeba wypić bo bardzo je lubię.'),
      new Note('Zrobić szpagat', 'Na butli albo na komisariacie.'),
    ];

    this.http.put(this.URL_NOTES, notes).subscribe(response => {
      console.log(response);
    });
  }

  getNotes() {
    return this.http.get<Note[]>(this.URL_NOTES);
  }
}
