export class ProductUpdateCreateDto {
    name!: string;
    description!: string;
    image!: string;
    price!: number;
    timesVisited!: number;
    category!:{
        id: number
    }
}