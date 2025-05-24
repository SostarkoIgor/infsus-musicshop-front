
export class OrderUpdateCreateDto{
    user!: User;
    totalPrice!: number;
    creditCardNumber!: string;
    orderDate!: string;
    deliveryAddress!: string;
    orderItemsList: OrderItem[] = [];
}

class User{
    id!: number;
}

class OrderItem{
    id?: number;
    product!:{
        id: number;
    }
    quantity!: number;
    price!: number;
}