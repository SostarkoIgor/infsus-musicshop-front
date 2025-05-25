
export class Order{
    id!: number;
    user_id!: number;
    total_price!: number;
    credit_card_number!: string;
    order_date: string = new Date().toISOString().split("T")[0];
    delivery_address!: string;
    order_items: Item[] = []
}

class Item{
    id?: number;
    product_id!: number;
    quantity!: number;
    price!: number;
}