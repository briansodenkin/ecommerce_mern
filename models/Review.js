const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      requried: [true, "Please provide rating"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      requried: [true, "Please provide title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      requried: [true, "Please provide comment"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.post("save", async function () {
  console.log("posted");
});

ReviewSchema.post("remove", async function () {
  console.log("removeds");
});

module.exports = mongoose.model("Review", ReviewSchema);
