import api from "./api";
import { OrderItemDto } from "../dto/orderItem.dto";

export const deleteOrderItem = async (orderItem: OrderItemDto): Promise<void> => {
    const response = await api.delete(`order/orderItem`, {
        data: orderItem
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete order item");
    }
}

export const createOrUpdateOrderItem = async (orderItem: OrderItemDto): Promise<OrderItemDto> => {
    const response = await api.post<OrderItemDto>(`order/orderItem`, orderItem);
    if (response.status !== 200) {
        throw new Error("Failed to create order item");
    }
    return response.data;
}


