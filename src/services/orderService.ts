import api from "./api";
import { Order } from "../types/order";
import type { OrderGetDto } from "../dto/orderGet.dto";
import type { OrderUpdateCreateDto } from "../dto/orderUpdateCreate.dto";

let path=import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8080/api/";

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await api.get<OrderGetDto>(path+`orders/order/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch order");
    }
    const order: Order = {
        id: response.data.id,
        user_id: response.data.user_id,
        total_price: response.data.total_price,
        credit_card_number: response.data.credit_card_number,
        order_date: response.data.order_date,
        delivery_address: response.data.delivery_address
    }
    return order;
}

export const deleteOrder = async (id: number): Promise<void> => {
    await api.delete(path+`orders/order/${id}`);
}

export const createOrder = async (order: Order): Promise<Order> => {
    const orderDto: OrderUpdateCreateDto = {
        user_id: order.user_id,
        total_price: order.total_price,
        credit_card_number: order.credit_card_number,
        order_date: order.order_date,
        delivery_address: order.delivery_address
    }
    const response = await api.post<OrderGetDto>(path+`orders/order`, orderDto);
    if (response.status !== 200) {
        throw new Error("Failed to create order");
    }
    const createdOrder: Order = {
        id: response.data.id,
        user_id: response.data.user_id,
        total_price: response.data.total_price,
        credit_card_number: response.data.credit_card_number,
        order_date: response.data.order_date,
        delivery_address: response.data.delivery_address
    }
    return createdOrder;
}

export const updateOrder = async (order: Order): Promise<Order> => {
    const orderDto: OrderUpdateCreateDto = {
        user_id: order.user_id,
        total_price: order.total_price,
        credit_card_number: order.credit_card_number,
        order_date: order.order_date,
        delivery_address: order.delivery_address
    }
    const response = await api.put<OrderGetDto>(path+`orders/order/${order.id}`, orderDto);
    if (response.status !== 200) {
        throw new Error("Failed to update order");
    }
    const updatedOrder: Order = {
        id: response.data.id,
        user_id: response.data.user_id,
        total_price: response.data.total_price,
        credit_card_number: response.data.credit_card_number,
        order_date: response.data.order_date,
        delivery_address: response.data.delivery_address
    }
    return updatedOrder;
}