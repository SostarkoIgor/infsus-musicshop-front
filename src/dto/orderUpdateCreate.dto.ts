
export class OrderUpdateCreateDto{
    user_id!: number;
    total_price!: number;
    credit_card_number!: string;
    order_date!: string;
    delivery_address!: string;
}