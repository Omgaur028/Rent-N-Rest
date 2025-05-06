const mongoose = require("mongoose");
const initdata = require("./init.js");
const list = require("../database/model.js");

const mongo_url = "mongodb://localhost:27017/SekendHand";

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initdb = async () => {
  await list.deleteMany({});
  await list.insertMany(initdata.data);
  console.log("data been initialsed");
};

initdb();
