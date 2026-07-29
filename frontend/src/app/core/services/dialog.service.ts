import { Injectable, signal } from '@angular/core';
import { DialogType, type ConfirmationDialogConfig, type DialogResult } from '@shared/models/dialog.model';

/**
 * Servicio centralizado para gestión de diálogos
 * 
 * Principios SOLID:
 * - SRP: Solo gestiona la lógica de diálogos
 * - OCP: Extensible para nuevos tipos de diálogos
 * - DIP: Depende de abstracciones (interfaces)
 * 
 * Uso:
 * ```typescript
 * const result = await this.dialogService.confirm({
 *   title: 'Eliminar producto',
 *   message: '¿Estás seguro?',
 *   type: DialogType.DANGER
 * });
 * 
 * if (result.confirmed) {
 *   // Acción confirmada
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  // Estado del diálogo
  private readonly configSignal = signal<ConfirmationDialogConfig | null>(null);
  private readonly showSignal = signal<boolean>(false);
  
  // Resolver de la promesa
  private resolver: ((value: DialogResult) => void) | null = null;

  // Getters públicos (readonly)
  readonly config = this.configSignal.asReadonly();
  readonly show = this.showSignal.asReadonly();

  /**
   * Muestra un diálogo de confirmación y retorna una promesa
   * con el resultado de la acción del usuario
   */
  confirm(config: ConfirmationDialogConfig): Promise<DialogResult> {
    return new Promise<DialogResult>((resolve) => {
      this.resolver = resolve;
      this.configSignal.set(config);
      this.showSignal.set(true);
    });
  }

  /**
   * Maneja el resultado del diálogo
   */
  handleResult(result: DialogResult): void {
    this.showSignal.set(false);
    
    if (this.resolver) {
      this.resolver(result);
      this.resolver = null;
    }

    // Limpiar config después de un pequeño delay (para animación de salida)
    setTimeout(() => {
      this.configSignal.set(null);
    }, 300);
  }

  /**
   * Cierra el diálogo sin confirmación
   */
  close(): void {
    this.handleResult({ confirmed: false });
  }

  // ============================================
  // Métodos de conveniencia para tipos comunes
  // ============================================

  /**
   * Diálogo de confirmación de eliminación/archivo
   */
  confirmDelete(itemName: string, itemType: string = 'elemento'): Promise<DialogResult> {
    return this.confirm({
      title: `Archivar ${itemType}`,
      message: `¿Deseas archivar "${itemName}"?`,
      type: DialogType.WARNING,
      details: [
        'Removido del inventario visible',
        'Ocultado del catálogo para clientes',
        'Conservado en la base de datos para historial'
      ],
      note: 'Puedes restaurarlo posteriormente si es necesario.',
      confirmText: `Archivar ${itemType}`,
      cancelText: 'Cancelar'
    });
  }

  /**
   * Diálogo de confirmación de acción destructiva permanente
   */
  confirmDestructive(itemName: string, action: string): Promise<DialogResult> {
    return this.confirm({
      title: `${action}`,
      message: `¿Estás seguro de ${action.toLowerCase()} "${itemName}"?`,
      type: DialogType.DANGER,
      details: [
        'Esta acción no se puede deshacer',
        'Se perderán todos los datos asociados',
        'No podrás recuperar esta información'
      ],
      confirmText: action,
      cancelText: 'Cancelar'
    });
  }

  /**
   * Diálogo informativo simple
   */
  info(title: string, message: string): Promise<DialogResult> {
    return this.confirm({
      title,
      message,
      type: DialogType.INFO,
      confirmText: 'Entendido',
      cancelText: 'Cerrar'
    });
  }

  /**
   * Diálogo de éxito
   */
  success(title: string, message: string): Promise<DialogResult> {
    return this.confirm({
      title,
      message,
      type: DialogType.SUCCESS,
      confirmText: 'Aceptar',
      cancelText: 'Cerrar'
    });
  }
}
