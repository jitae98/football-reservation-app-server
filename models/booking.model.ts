import { Schema, model, Document, Types } from "mongoose";

interface IBooking extends Document {
  user: Types.ObjectId;
  field: Types.ObjectId;
  booking: Date;
}

const bookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  field: {
    type: Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  booking: {
    type: Date,
    required: true,
  },
});

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
