const express = require("express");
const router = express.Router();

const Room = require("../models/room");
// this express router is used for handling get requests  by(/getallrooms) url

// /getallrooms is an api endpoint

router.get("/getallrooms", async (req, res) => {
  try {
    //try catch is used to avoid errors in async await
    const rooms = await Room.find({});
    // find is a mongodb function used to search for anything in rooms model
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getroombyid", async (req, res) => {
  try {
    const roomid = req.body.roomid;
    const room = await Room.findOne({ _id: roomid });
    res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});


router.post("/addroom", async (req, res) => {
  try {
    const newRoom = req.body;
    console.log(req.body);
    const room = new Room();
    room.name = newRoom.name;
    room.maxcount = newRoom.maxcount;
    room.phonenumber = newRoom.phonenumber;
    room.rentperday = newRoom.rentperday;
    room.type = newRoom.type;
    room.description = newRoom.description;
    room.currentbookings = [];
    if (newRoom.imageurl1 && newRoom.imageurl1.length > 0) {
      room.imageurls.push(newRoom.imageurl1);
    }
    if (newRoom.imageurl2 && newRoom.imageurl2.length > 0) {
      room.imageurls.push(newRoom.imageurl2);
    }
    if (newRoom.imageurl3 && newRoom.imageurl3.length > 0) {
      room.imageurls.push(newRoom.imageurl3);
    }

    const result = await room.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
