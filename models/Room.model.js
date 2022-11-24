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
  event: { type: Schema.Types.ObjectId, ref: "Event" },
});

const Room = model("Room", roomSchema);

module.exports = Room;
