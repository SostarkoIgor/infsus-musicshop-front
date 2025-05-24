class Category{
    id!: number;
    name!: string;
}
export class ProductGetDto {
    id!: number;
    name!: string;
    description!: string;
    image!: string;
    price!: number;
    timesVisited!: number;
    category!: Category;
}