const {Schema, model} = require('mongoose');

const roomSchema = new Schema({
    startDate: {
        type: String,
        requires: [true, 'A start date is required']
    },
    endDate: {
        type: String,
        requires: [true, 'An end date is required']
    },
    roomName: {
        type: String,
        requires: [true, 'Please, provide a name for this room']
    },
    roomUrl: String,
    meetingId: String
})


const Room = model("Room", roomSchema);

module.exports = Room;