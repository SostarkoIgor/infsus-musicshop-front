

class User{
    id!: number;
    firstName!: string;
    lastName!: string;
    username!: string;
    email!: string;
    phoneNumber!: string;
    role!: string;
}

class Category{
    id!: number;
    name!: string;
}
class Product{
    id!: number;
    name!: string;
    description!: string;
    image!: string;
    price!: number;
    times_visited!: number;
    category!: Category;
}

class OrderItem{
    id!: number;
    product!: Product;
    price!: number;
    quantity!: number;
}

export class OrderGetDto{
    id!: number;
    user!: User;
    totalPrice!: number;
    creditCardNumber!: string;
    orderItemsList!: OrderItem[];
    orderDate!: string;
    deliveryAddress!: string;
}

