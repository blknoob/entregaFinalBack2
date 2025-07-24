import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
