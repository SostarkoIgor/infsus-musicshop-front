import api from "./api";
import { Product } from "../types/product";
import { ProductUpdateCreateDto } from "../dto/productUpdateCreate.dto";
import { ProductGetDto } from "../dto/productGet.dto";

export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get<ProductGetDto>(`product/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch product");
    }
    const product: Product = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: response.data.image,
        price: response.data.price,
        times_visited: response.data.timesVisited,
        category_id: response.data.category.id
    }
    return product;
}

export const updateProduct = async (product: Product): Promise<Product> => {
    const productUpdateCreateDto: ProductUpdateCreateDto = {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        timesVisited: product.times_visited,
        category: {
            id: product.category_id
        }
    }
    const response = await api.put<ProductGetDto>(`product/${product.id}`, productUpdateCreateDto);
    if (response.status !== 200) {
        throw new Error("Failed to update product");
    }
    const updatedProduct: Product = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: response.data.image,
        price: response.data.price,
        times_visited: response.data.timesVisited,
        category_id: response.data.category.id
    }
    return updatedProduct;
}

export const createProduct = async (product: Product): Promise<Product> => {
    const productUpdateCreateDto: ProductUpdateCreateDto = {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        timesVisited: product.times_visited,
        category: {
            id: product.category_id
        }
    }
    const response = await api.post<ProductGetDto>(`product`, productUpdateCreateDto);
    if (response.status !== 200) {
        throw new Error("Failed to update product");
    }
    const updatedProduct: Product = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: response.data.image,
        price: response.data.price,
        times_visited: response.data.timesVisited,
        category_id: response.data.category.id
    }
    return updatedProduct;
}

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`product/${id}`);
}

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await api.get<ProductGetDto[]>(`product/all`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch products");
    }
    const products: Product[] = response.data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        times_visited: product.timesVisited,
        category_id: product.category.id
    }));
    return products;
}
