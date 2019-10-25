const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(bodyParser.json());

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(1000));
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;
  const sameName = persons.find(person => person.name === body.name);
  if (!body.name) {
    res.status(400).json({
      error: "name missing"
    });
  } else if (!body.number) {
    res.status(400).json({
      error: "number missing"
    });
  } else if (sameName) {
    res.status(400).json({
      error: "duplicate name"
    });
  }

  const person = {
    id: generateId,
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  res.json(person);
});

app.get("/api/info", (req, res) => {
  const availablePersons = persons.length;
  const date = new Date();
  res.send(`
    <p>${availablePersons}</p>
    <p>${date}</p>
    `);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
