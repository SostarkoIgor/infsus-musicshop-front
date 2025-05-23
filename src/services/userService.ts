import type { UserDto } from "../dto/user.dto";
import type { User } from "../types/user";
import api from "./api";

let path=import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8080/api/";

export const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get<UserDto[]>(path+`users/all`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch users");
    }
    const users: User[] = response.data.map((user) => ({
        id: user.id,
        username: user.username
    }));
    return users;
}