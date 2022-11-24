const router = require("express").Router();
const Event = require("../models/Event.model");

/* POST Single Event - Route so we can create an event */

router.post("/events", async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const newEvent = await Event.create({ title, description });

    /* Now that we don't have a render (because we don't have views), we use res.json to send a json object */
    /* 201 means Created */
    res.status(201).json(newEvent);
  } catch (error) {
    /*  This res.json acts more like a console.log, not mandatory */
    res.json(error);
    next(error);
  }
});

/* GET All Events - Route */

router.get("/events", async (req, res, next) => {
  try {
    /* After creating the ROOM Route we populate them after find() */
    const allEvents = await Event.find().populate("rooms");
    /* the name of the variable (allProjects) doesn't matter for the client */
    res.status(200).json(allEvents);
  } catch (error) {
    next(error);
  }
});

/* GET Single Event - Route */

router.get("/event/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    /* After creating the ROOM Route we populate them after findById() */
    const singleEvent = await Event.findById(id).populate("rooms");
    res.status(200).json(singleEvent);
  } catch (error) {
    next(error);
  }
});

/* EDIT / PUT Single Event - Route */

router.put("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      /* "new: true" gives us back the updated object instead of the old version */
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

/* DELETE Single Project - Route */

router.delete("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndRemove(id);

    res
      .status(200)
      .json({ message: `The event with ID: ${id} was deleted successfully` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
