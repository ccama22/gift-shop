import { OrderDomain } from '../../../../domain';

export interface IOrderRepository {
  findById(id: string): Promise<OrderDomain | null>;
  findByUserId(userId: string): Promise<OrderDomain[]>;
  save(order: OrderDomain): Promise<OrderDomain>;
}
