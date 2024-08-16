const mongoose = require("mongoose");


// name  - string
// maxcount -number
// Mobilenumber -number
// rent -number
// images -[]
// currentbookings -[]
// type -string
// desc -string

//SCHEMA __ --  schema defines the structure of the documents that will be stored in the collection
const roomSchema = mongoose.Schema(//creates a Mongoose schema 
  {
    name: { type: String, required: true },
    maxcount: {
      type: Number,
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    rentperday: {
      type: Number,
      required: true,
    },
    imageurls: [],
    currentbookings: [],
    type: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const roomModel = mongoose.model("rooms", roomSchema);
// creates a Mongoose model based on the defined schema
module.exports = roomModel;
