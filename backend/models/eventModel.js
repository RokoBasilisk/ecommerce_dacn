import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    eventTargetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    eventName: { type: String, required: true },
    eventContext: { type: String, required: true },
    aggregateData: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Event", eventSchema);

export default Category;
