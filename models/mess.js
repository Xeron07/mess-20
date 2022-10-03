const mongoose = require("mongoose");

const MessSchema = new mongoose.Schema({
  id: { type: Number, default: 200361 },
  name: { type: String, default: "14-14" },
  token: { type: String, default: "" },
  members: [
    {
      id: { type: String },
      name: { type: String },
      username: { type: String },
      avatar: {
        type: String,
        default:
          "https://res.cloudinary.com/emerging-it/image/upload/v1579328480/img/output-onlinepngtools_ntsoe1.png",
      },
      phoneNumber: { type: String, default: "01XXXXXXXXX" },
      password: { type: String, default: "" },
      data: { type: Object, default: {} },
    },
  ],
});

//// data type ///
/**
 * {
          [Symbol]: {
            meal: [
              {
                id: { type: String },
                amount: { type: Number, default: 1 },
                date: { type: Date, default: Date.now },
              },
            ],
            shop: [
              {
                id: { type: String },
                amount: { type: Number, default: 0 },
                description: { type: String, default: "" },
                date: { type: Date, default: Date.now },
              },
            ],
          },
        },
 */

const MessModel = mongoose.model("Mess", MessSchema);
module.exports = { MessModel };
