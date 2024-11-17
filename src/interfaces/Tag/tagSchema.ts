export interface ITag extends Document {
  name: string; // Tag name
  description?: string; // Optional tag description
  createdAt: Date;
  updatedAt: Date;
}
