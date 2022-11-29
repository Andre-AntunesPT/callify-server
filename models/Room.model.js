const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  startDate: {
    type: String,
    required: [true, "A start date is required"],
  },
  endDate: {
    type: String,
    required: [true, "An end date is required"],
  },
  roomName: {
    type: String,
    required: [true, "Please, provide a name for this room"],
  },
  roomUrl: String,
  meetingId: String,
  userRoomName: String,
  
  roomColor: {
    type: String,
    enum: ["default", "grey", "purple", "burgund"]
  },
  
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Room = model("Room", roomSchema);

module.exports = Room;
