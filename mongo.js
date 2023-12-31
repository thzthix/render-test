const mongoose = require("mongoose")
require("dotenv").config()
// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }
// TODO: enable validation whle updating
const uri = process.env.MONGODB_URI

console.log(uri)
mongoose.set("strictQuery", false)

console.log("connecting to", uri)

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{6,}$/.test(v)
      },
      message: "this is not a valid number",
    },
    required: [true, "User phone number required"],
  },
})
phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
// const Persons = mongoose.model("Person", phoneSchema)

// if (process.argv.length > 3) {
//   const person = new Persons({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   person.save().then((result) => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// } else {
//   Persons.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person);
//     });
//     mongoose.connection.close();
//   });
// }
module.exports = mongoose.model("Person", phoneSchema)
