const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
