/**
 * Puerto de entrada: Caso de uso para eliminar producto
 */
export interface IDeleteProductUseCase {
  execute(productId: string): Promise<void>;
}
