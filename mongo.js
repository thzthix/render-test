const mongoose = require("mongoose");
// password:yyGCtIvJ6VGBznEo
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://seohas0428:${password}@cluster0.zwxjgwr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
// const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Persons = mongoose.model("Person", phoneSchema);

if (process.argv.length > 3) {
  const person = new Persons({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Persons.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}
module.exports = mongoose.model("Persons", phoneSchema);
