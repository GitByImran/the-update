const mongoose = require("mongoose");
const moment = require("moment");

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
    default: moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
});

const ReportModel = mongoose.model("Reports", reportSchema);

export default ReportModel;
