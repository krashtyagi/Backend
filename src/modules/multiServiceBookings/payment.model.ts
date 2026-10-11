import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IGenericPaymentMetadata {
  serviceType?: string;
  bookingReference?: string;
  extra?: Record<string, any>;
}

export interface IGenericPayment extends Document {
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  gateway: "razorpay";
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  paymentMethod: "card" | "upi" | "netbanking" | "wallet" | "unknown";
  isVerified: boolean;
  refundAmount: number;
  refundStatus: "none" | "pending" | "processed" | "failed";
  refundedAt?: Date;
  metadata?: IGenericPaymentMetadata;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IGenericPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    gatewayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    gatewayPaymentId: {
      type: String,
      index: true,
    },

    gatewaySignature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "unknown"],
      default: "unknown",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none",
    },

    refundedAt: Date,
    metadata: {
      serviceType: String,
      bookingReference: String,
      extra: {
        type: Object,
        default: {},
      },
    },
    expiresAt: {
      type: Date,
      index: { expires: "0s" },
    },
  },
  { timestamps: true },
);

paymentSchema.index({ bookingId: 1, status: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

const GenericPayment: Model<IGenericPayment> = mongoose.model<IGenericPayment>("GenericPayment", paymentSchema);

export default GenericPayment;
export { GenericPayment };

