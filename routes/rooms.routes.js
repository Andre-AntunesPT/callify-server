const router = require("express").Router();
const Event = require("../models/Event.model");
const Room = require("../models/Room.model");

/* POST Single Room - Route so we can create an room */

/* POST Route so we can create a room */

router.post("/rooms", async (req, res, next) => {
  try {
    const { startDate, endDate, roomName, roomUrl, meetingId, eventId } =
      req.body;

    /* Create the room */
    /* Since the ROOM model has the field "event" and NOT "eventID", we need to rename it */
    const newRoom = await Room.create({
      startDate,
      endDate,
      roomName,
      roomUrl,
      meetingId,
      event: eventId,
    });

    /* Enviar o ID da room para o Event */
    await Event.findByIdAndUpdate(eventId, {
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

/* router.put("/room/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, roomName, roomUrl, meetingId, eventId } =
      req.body;

    const updatedRoom = await Event.findByIdAndUpdate(
      id,
      {
        startDate,
        endDate,
        roomName,
        roomUrl,
        meetingId,
        event: eventId,
      },
      { new: true }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
}); */

/* DELETE Single Project - Route */

router.delete("/rooms/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await Room.findByIdAndRemove(id);

    res
      .status(200)
      .json({ message: `The room with ID: ${id} was deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
