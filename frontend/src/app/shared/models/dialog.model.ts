/**
 * Tipos de diálogos de confirmación
 */
export enum DialogType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}

/**
 * Configuración del diálogo de confirmación
 */
export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  type?: DialogType;
  details?: string[];
  note?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

/**
 * Resultado del diálogo
 */
export interface DialogResult {
  confirmed: boolean;
}
