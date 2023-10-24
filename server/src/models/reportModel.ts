const mongoose = require("mongoose");
const moment = require("moment-timezone");

const reportSchema = new mongoose.Schema({
  news: {
    image: String,
    category: String,
    header: String,
    body: String,
    tags: [String],
  },
  reporter: {
    image: String,
    name: String,
    position: String,
  },
  reportTime: {
    type: String,
    default: moment().tz("Asia/Dhaka").format("MMMM Do YYYY, h:mm:ss a"),
  },
  comments: [
    {
      user: {
        email: String,
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ReportModel = mongoose.model("Reports", reportSchema);

export default ReportModel;
