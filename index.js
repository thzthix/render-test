require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./mongo");
const app = express();
// TODO: add transforming json format,
// TODO:write all Mongoose-specific code into its own module
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
// morgan.token("type", function (req, res) {
//   return JSON.stringify(req.body);
// });
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      Object.keys(req.body).length > 0 && JSON.stringify(req.body),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
// app.use(morgan("tiny"));

// app.use(
//   morgan.token("default", function (req, res) {
//     return req.headers["content-type"];
//   })
// );
app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  console.log("getting");
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
  <br/>
  <h3>${date}</h3>`);
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id.toString() === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 300000);
  const person = request.body;
  const name = person.name;
  const number = person.number;
  if (!name || !number) {
    return response.status(404).json({
      error: "content missing",
    });
  } else if (persons.find((p) => p.name === person.name)) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }
  // person.id = id;
  // persons = persons.concat(person);
  const newPerson = new Person({
    name,
    number,
  });

  newPerson.save().then((result) => {
    console.log(
      `added ${newPerson.name} number ${newPerson.number} to phonebook`
    );
  });
  response.json(newPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT);

console.log(`Server running on port ${PORT}`);
