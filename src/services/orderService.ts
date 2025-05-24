import api from "./api";
import { Order } from "../types/order";
import type { OrderGetDto } from "../dto/orderGet.dto";
import type { OrderUpdateCreateDto } from "../dto/orderUpdateCreate.dto";

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await api.get<OrderGetDto>(`order/${id}`);
    console.log(response.data);
    if (response.status !== 200) {
        throw new Error("Failed to fetch order");
    }
    let order: Order = {
        id: response.data.id,
        user_id: response.data.user.id,
        total_price: response.data.totalPrice,
        credit_card_number: response.data.creditCardNumber,
        order_date: response.data.orderDate,
        delivery_address: response.data.deliveryAddress,
        order_items: response.data.orderItemsList.map(item => ({
            id: item.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.price
        }))
    }
    return order;
}

export const deleteOrder = async (id: number): Promise<void> => {
    await api.delete(`order/${id}`);
}

export const createOrder = async (order: Order): Promise<Order> => {
    const orderDto: OrderUpdateCreateDto = {
        user: {
            id: order.user_id
        },
        totalPrice: order.total_price,
        creditCardNumber: order.credit_card_number,
        orderDate: order.order_date,
        deliveryAddress: order.delivery_address,
        orderItemsList: []
    }
    const response = await api.post<OrderGetDto>(`order`, orderDto);
    if (response.status !== 200) {
        throw new Error("Failed to create order");
    }
    const createdOrder: Order = {
        id: response.data.id,
        user_id: response.data.user.id,
        total_price: response.data.totalPrice,
        credit_card_number: response.data.creditCardNumber,
        order_date: response.data.orderDate,
        delivery_address: response.data.deliveryAddress,
        order_items: response.data.orderItemsList.map(item => ({
            id: item.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.price
        }))
    }
    return createdOrder;
}

export const updateOrder = async (order: Order): Promise<Order> => {
    const orderDto: OrderUpdateCreateDto = {
        user: {
            id: order.user_id
        },
        totalPrice: order.total_price,
        creditCardNumber: order.credit_card_number,
        orderDate: order.order_date,
        deliveryAddress: order.delivery_address,
        orderItemsList: order.order_items.map(item => ({
            id: item.id,
            product: {
                id: item.product_id
            },
            quantity: item.quantity,
            price: item.price
        }))
    }
    console.log(orderDto);
    const response = await api.put<OrderGetDto>(`order/${order.id}`, orderDto);
    if (response.status !== 200) {
        throw new Error("Failed to update order");
    }
    const updatedOrder: Order = {
        id: response.data.id,
        user_id: response.data.user.id,
        total_price: response.data.totalPrice,
        credit_card_number: response.data.creditCardNumber,
        order_date: response.data.orderDate,
        delivery_address: response.data.deliveryAddress,
        order_items: response.data.orderItemsList.map(item => ({
            id: item.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.price
        }))
    }
    return updatedOrder;
}