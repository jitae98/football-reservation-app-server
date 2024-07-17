import { Schema, model, Document } from "mongoose";

interface IField extends Document {
  ID: number;
  name: string;
  quantity: number;
  bookedQuantity: number;
}

const fieldSchema = new Schema<IField>({
  ID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  bookedQuantity: {
    type: Number,
    required: true,
  },
});

const Field = model<IField>("Field", fieldSchema);

export default Field;
