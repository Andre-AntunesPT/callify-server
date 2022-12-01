const router = require("express").Router();
const axios = require("axios");

const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Room = require("../models/Room.model");

/* POST Single Room - Route so we can create an room */

/* POST Route so we can create a room */

router.post("/rooms", async (req, res, next) => {
  try {
    const { userRoomName, eventId, userId, palette } = req.body;

    //CREATE ROOM
    const data = {
      endDate: "2099-02-18T14:23:00.000Z",
      fields: ["hostRoomUrl"],
    };

    const body = JSON.stringify(data);

    const creatingRoom = await axios.post(
      "https://api.whereby.dev/v1/meetings",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_WHEREBY}`,
          "Content-Type": "application/json",
        },
      }
    );

    //SET ROOM COLOR
    const dataStyle = {
      palette: palette,
      theme: "default"
    };

    const bodyStyle = JSON.stringify(dataStyle);


    const stylingRoom = await axios.put(
      `https://api.whereby.dev/v1/rooms/${creatingRoom.data.roomName}/theme/room-background`,
      bodyStyle,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_WHEREBY}`,
          "Content-Type": "application/json",
        },
      }
    );

console.log(stylingRoom.data)

    const newRoom = await Room.create({
      startDate: creatingRoom.data.startDate,
      endDate: creatingRoom.data.endDate,
      roomName: creatingRoom.data.roomName,
      roomUrl: creatingRoom.data.roomUrl,
      meetingId: creatingRoom.data.meetingId,
      event: eventId,
      user: userId,
      userRoomName,
      palette,
    });

    /* Create the room */

    /* Since the ROOM model has the field "event" and NOT "eventID", we need to rename it */
    /* Enviar o ID da room para o Event */
    await Event.findByIdAndUpdate(eventId, {
      $push: { rooms: newRoom._id },
    });

    /* Since the ROOM model has the field "user" and NOT "userID", we need to rename it */
    /* Enviar o ID da room para o User */
    await User.findByIdAndUpdate(userId, {
      $push: { rooms: newRoom._id },
    });

    /* Now that we don't have a render (because we don't have views), we use res.json to send a json object */
    /* 201 means Created */
    res.status(201).json(newRoom);
  } catch (error) {
    /*  This res.json acts more like a console.log, not mandatory */
    res.json(error);
    next(error);
  }
});

/* GET All Rooms - Route */

router.get("/rooms", async (req, res, next) => {
  try {
    /* After creating the ROOM Route we populate them after find() */
    //const allRooms = await Room.find().populate("events");
    const allRooms = await Room.find();
    /* the name of the variable (allProjects) doesn't matter for the client */
    res.status(200).json(allRooms);
  } catch (error) {
    next(error);
  }
});

/* GET Single Room - Route */

router.get("/rooms/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    /* After creating the ROOM Route we populate them after findById() */
    //const singleRoom = await Room.findById(id).populate("events");
    const singleRoom = await Room.findById(id);
    res.status(200).json(singleRoom);
  } catch (error) {
    next(error);
  }
});

/* EDIT / PUT Single Room - Route */

router.put("/rooms/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userRoomName } = req.body;
    const { palette } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        userRoomName,
        palette,
      },
      { new: true }
    );

    const dataStyle = {
      palette: palette,
      theme: "default"
    };

    const bodyStyle = JSON.stringify(dataStyle);


    const stylingRoom = await axios.put(
      `https://api.whereby.dev/v1/rooms/${updatedRoom.roomName}/theme/room-background`,
      bodyStyle,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_WHEREBY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
});

/* DELETE Single Project - Route */

router.delete("/rooms/:id/:userId/:eventId", async (req, res, next) => {
  try {
    const { id, eventId, userId } = req.params;

    const removedRoom = await Room.findByIdAndRemove(id);

    /* Retirar o ID da room para o Event */
    await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { rooms: removedRoom._id },
      },
      { new: true }
    );

    /* Retirar o ID da room para o User */
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { rooms: removedRoom._id },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: `The room with ID: ${id} was deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
