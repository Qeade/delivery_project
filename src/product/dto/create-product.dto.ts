export class CreateProductDto {
  readonly name: string;
  readonly price: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly created_at: Date;
}
