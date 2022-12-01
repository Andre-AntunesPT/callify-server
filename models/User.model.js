const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Name is required."],
    },
    company: String,
    imageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dnzgudw42/image/upload/v1669920870/ugysgl5tj0imamk8ddwq.png",
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
