const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  title: String,
  description: String,
  type: { type: String, enum: [elearning, webinar, eventThree] },
  /* room: { type: Schema.Types.ObjectId, ref: "Room" }, */
});

const Event = model("Event", eventSchema);

module.exports = Event;
