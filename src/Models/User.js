const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema(
  {
email:{
    type: "string",
        required: true,
  },
  username:{
    type: "string",
        required: true,
  },
  password:{
    type: "string",
        required: true,
  },
},
  { timestamps: true },
);

module.exports= mongoose.model("users", DataSchema);