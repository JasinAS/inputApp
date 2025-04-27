import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NumericInputComponent } from './numeric-input/numeric-input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, NumericInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Input App';
  months = 0;
  months2 = 0;
  term = 0;
  term2 = 0;
  term3 = 0;
  term4 = 0;
  constructor() {}

  ngOnInit() {}

  onTermChange(event: number) {
    if (this.term && this.term2 && this.term3 && this.term4) {
      console.log(
        'Months:',
        this.months,
        'Input #1:',
        this.term,
        'Input #2:',
        this.term2,
        'Input #3:',
        this.term3,
        'Input #4:',
        this.term4
      );

      /* do something with the value
           append to the form, pass as a reference, etc... */
    }
  }
}
