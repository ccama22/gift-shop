import { Component, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogType, type ConfirmationDialogConfig, type DialogResult } from '@shared/models/dialog.model';

/**
 * Componente de diálogo de confirmación reutilizable
 * 
 * Principios aplicados:
 * - SRP: Solo se encarga de mostrar un diálogo de confirmación
 * - OCP: Extensible mediante configuración, cerrado a modificación
 * - DIP: Depende de abstracciones (interfaces)
 * 
 * Uso:
 * ```typescript
 * <app-confirmation-dialog
 *   [config]="dialogConfig()"
 *   [show]="showDialog()"
 *   (result)="onDialogResult($event)"
 * />
 * ```
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  // Inputs (Angular 18+ signal inputs)
  config = input<ConfirmationDialogConfig>({
    title: 'Confirmar acción',
    message: '¿Estás seguro?',
    type: DialogType.WARNING,
    confirmText: 'Aceptar',
    cancelText: 'Cancelar'
  });
  
  show = input<boolean>(false);

  // Events (outputs)
  result = output<DialogResult>();

  // Enum expuesto para el template
  readonly DialogType = DialogType;

  /**
   * Maneja la confirmación
   */
  onConfirm(): void {
    this.result.emit({ confirmed: true });
  }

  /**
   * Maneja la cancelación
   */
  onCancel(): void {
    this.result.emit({ confirmed: false });
  }

  /**
   * Cierra el modal al hacer click en el backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  /**
   * Obtiene el icono según el tipo de diálogo
   */
  getIcon(): string {
    const cfg = this.config();
    if (cfg?.icon) {
      return cfg.icon;
    }

    switch (cfg?.type) {
      case DialogType.SUCCESS:
        return '✓';
      case DialogType.DANGER:
        return '⚠';
      case DialogType.WARNING:
        return '⚠';
      case DialogType.INFO:
        return 'ℹ';
      default:
        return '?';
    }
  }
}
