import { Component , EventEmitter, Output } from '@angular/core';


export type DatePresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'last90'
  | 'last180'
  | 'custom';

export interface DateRangeValue {
  start: Date;
  end: Date;
  preset: DatePresetKey;
}

interface DatePresetConfig {
  key: DatePresetKey;
  label: string;
}

@Component({
  selector: 'app-date-range-filter',
  standalone: false,
  templateUrl: './date-range-filter.component.html',
  styleUrl: './date-range-filter.component.scss'
})
export class DateRangeFilterComponent {
  @Output() dateRangeChange = new EventEmitter<DateRangeValue>();

  presets: DatePresetConfig[] = [
    { key: 'today', label: 'Hoy' },
    { key: 'yesterday', label: 'Ayer' },
    { key: 'last7', label: 'Últimos 7 días' },
    { key: 'last30', label: 'Últimos 30 días' },
    { key: 'last90', label: 'Últimos 3 meses' },
    { key: 'last180', label: 'Últimos 6 meses' },
    { key: 'custom', label: 'Otra fecha' },
  ];

  selectedPreset: DatePresetKey = 'today';

  // Fechas en modo custom (con mat-date-range-input)
  customStart?: Date;
  customEnd?: Date;

  constructor() {
    // Emitimos el rango "hoy" al iniciar
    const range = this.getRangeForPreset('today');
    this.dateRangeChange.emit(range);
  }
  onPresetChange(presetKey: DatePresetKey): void {
    this.selectedPreset = presetKey;

    if (presetKey === 'custom') {
      // Solo mostramos el date-range picker, emitimos cuando haya ambas fechas
      return;
    }

    const range = this.getRangeForPreset(presetKey);
    this.dateRangeChange.emit(range);
  }

  onCustomDateChange(): void {
    if (!this.customStart || !this.customEnd) {
      return;
    }

    const start = this.setStartOfDay(this.customStart);
    const end = this.setEndOfDay(this.customEnd);

    const range: DateRangeValue = {
      start,
      end,
      preset: 'custom',
    };

    this.dateRangeChange.emit(range);
  }

  // ================== LÓGICA DE RANGOS ==================

  private getRangeForPreset(preset: DatePresetKey): DateRangeValue {
    const now = new Date();

    let start: Date;
    let end: Date;

    switch (preset) {
      case 'today':
        start = this.setStartOfDay(now);
        end = this.setEndOfDay(now);
        break;

      case 'yesterday': {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        start = this.setStartOfDay(y);
        end = this.setEndOfDay(y);
        break;
      }

      case 'last7': {
        const startDate = new Date(now);
        // Últimos 7 días (incluye hoy) -> hoy - 6
        startDate.setDate(startDate.getDate() - 6);
        start = this.setStartOfDay(startDate);
        end = this.setEndOfDay(now);
        break;
      }

      case 'last30': {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 29);
        start = this.setStartOfDay(startDate);
        end = this.setEndOfDay(now);
        break;
      }

      case 'last90': {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 89);
        start = this.setStartOfDay(startDate);
        end = this.setEndOfDay(now);
        break;
      }

      case 'last180': {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 179);
        start = this.setStartOfDay(startDate);
        end = this.setEndOfDay(now);
        break;
      }

      case 'custom':
      default:
        start = this.setStartOfDay(now);
        end = this.setEndOfDay(now);
        break;
    }

    return { start, end, preset };
  }

  private setStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private setEndOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
