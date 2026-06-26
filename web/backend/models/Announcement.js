import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Announcement text is required"],
      trim: true,
      maxlength: [500, "Announcement text cannot exceed 500 characters"],
    },
    shopDomain: {
      type: String,
      required: [true, "Shop domain is required"],
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ shopDomain: 1, isActive: 1 });

announcementSchema.pre("save", async function (next) {
  if (this.isActive == true && this.isNew == true) {
    console.log("deactivating old ones");
    await mongoose.model("Announcement").updateMany(
      { shopDomain: this.shopDomain, isActive: true, _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
