import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-numeric-input',
  standalone: true,
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss'],
  imports: [CommonModule],
  /* Treat the component as a form control, since it will be used in forms  */
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInputComponent),
      multi: true,
    },
    DecimalPipe,
  ],
})
export class NumericInputComponent implements ControlValueAccessor, OnInit {
  /* Dynamic Background */
  @Input() background = '#fff';
  /* Dynamic Minimum Input Value */
  @Input() min = 1;
  /* Dynamic Maximum Input Value */
  @Input() max = 9999999;
  /* Dynamic Step Value */
  @Input() step = 1;
  /* Dynamic Default Input Value */
  @Input() defaultValue = 1000;
  /* Dynamic Input Text */
  @Input() placeholder = '';
  /* Output the value back to the parent component */
  @Output() valueChange = new EventEmitter<number>();

  /* Main Wrapper Element Reference */
  @ViewChild('wrapper', { static: false })
  wrapper!: ElementRef<HTMLDivElement>;

  /* Input Element Reference */
  @ViewChild('inputField', { static: false })
  inputField!: ElementRef<HTMLInputElement>;

  /* Actual numerical value, helper */
  value!: number;
  /* Formated string value */
  formattedValue = '';
  /* Last Valid Value reference */
  lastValidValue!: number;

  /* Input State flags */
  isFocused = false;
  isHovered = false;
  isError = false;
  isSuccess = false;

  /* On change and blur captures */
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  /* After error we need to show the last valid value, since we always have it we need to make sure to remove the error state and return to the focused state */
  private errorTimer: any = null;

  constructor(private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.resetToDefault();
  }

  /* Main Input Method for handling the comma separator for thousands */
  onInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;

    const cleaned = raw.replace(/,/g, '');
    if (/^\d+$/.test(cleaned)) {
      const parsed = parseInt(cleaned, 10);
      this.formattedValue = this.decimalPipe.transform(parsed, '1.0-0')!;
    } else {
      this.formattedValue = raw;
    }
  }

  /* On focus method for toggling the states, clearing the error timer and focusing in on the input */
  onFocus() {
    this.clearErrorTimer();
    this.isFocused = true;
    this.isError = false;
    this.isSuccess = false;
    this.formatValue();
  }

  /* Main blur method */
  onBlur(event: FocusEvent) {
    /* If wrapper elements are clicked make sure we keep the focus in the input */
    const related = event.relatedTarget as HTMLElement | null;
    if (related && this.wrapper.nativeElement.contains(related)) {
      this.inputField.nativeElement.focus();
      return;
    }

    this.isFocused = false;
    const raw = this.formattedValue.replace(/,/g, '');

    /* If a non numeric value is entered revert to last valid */
    if (!/^\d+$/.test(raw)) {
      this.handleNonNumbericValue();
      this.onTouched();
      return;
    }

    const num = this.parseNumber(raw);
    if (num < this.min) {
      this.handleMinMaxRangeError(this.min);
    } else if (num > this.max) {
      this.handleMinMaxRangeError(this.max);
    } else {
      this.setValue(num, true);
    }
    this.onTouched();
  }

  /* Step Button Methods */
  increment() {
    if (this.value >= this.max) {
      return;
    }
    this.adjustValue(this.value + this.step);
  }
  decrement() {
    if (this.value <= this.min) {
      return;
    }
    this.adjustValue(this.value - this.step);
  }
  adjustValue(newValue: number) {
    /* Handle Step Button */
    if (newValue < this.min) {
      this.handleMinMaxRangeError(this.min);
    } else if (newValue > this.max) {
      this.handleMinMaxRangeError(this.max);
    } else {
      this.setValue(newValue, true);
    }
  }
  /* Step Button Methods */

  /* focus in on input field on wrapper element click - except reset button*/
  onWrapperClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.btn-reset')) {
      this.inputField.nativeElement.focus();
    }
  }

  /* Set Value if no faulty statements, valid number entered */
  setValue(val: number, clearError = true) {
    this.value = Math.max(this.min, Math.min(val, this.max));
    /* Convert the number to properly formated string */
    this.formatValue();
    this.lastValidValue = this.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);

    if (clearError) {
      this.clearErrorTimer();
      this.isError = false;
      this.isSuccess = true;
    } else {
      this.isSuccess = false;
    }
  }

  /* use the Last Valid Value */
  revert() {
    this.setValue(this.lastValidValue, false);
  }

  /* Reset Button Method, pull the iniital default value  */
  resetToDefault() {
    this.clearErrorTimer();
    this.isError = false;
    this.isSuccess = false;
    const init = Math.max(this.min, Math.min(this.defaultValue, this.max));
    this.setValue(init, true);
  }

  /* Format the number into a comma separated string */
  formatValue() {
    this.formattedValue = this.decimalPipe.transform(this.value, '1.0-0')!;
  }

  /* get the numeric value back */
  parseNumber(val: any): number {
    if (typeof val === 'number') return val;
    const str = String(val || '').replace(/,/g, '');
    return /^\d+$/.test(str) ? parseInt(str, 10) : NaN;
  }

  handleErrorState() {
    this.isError = true;
    this.isSuccess = false;
  }

  handleNonNumbericValue() {
    this.handleErrorState();
    this.revert();
    this.startErrorElement();
  }

  handleMinMaxRangeError(minMax: number) {
    this.handleErrorState();
    this.setValue(minMax, false);
    this.startErrorElement();
  }

  /* Start showing "Invalid" message */
  startErrorElement() {
    this.clearErrorTimer();
    this.errorTimer = setTimeout(() => {
      this.isError = false;
      this.isFocused = true; // return to the focus state
      this.formatValue();
      this.inputField.nativeElement.focus();
      this.errorTimer = null;
    }, 1000);
  }

  /* Clear Error */
  clearErrorTimer() {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = null;
    }
  }

  /* ControlValueAccessor writeValue, updatesthe view with the new value */
  writeValue(obj: any): void {
    const num = this.parseNumber(obj);
    /* Only accept values inside of the min/max range */
    if (!isNaN(num) && num >= this.min && num <= this.max) {
      this.setValue(num, true);
    } else {
      this.resetToDefault();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
