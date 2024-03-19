import Express from "express";
import Joi from "joi";
import path from "node:path";
import process from "node:process";
import { randomUUID } from "node:crypto";

const app = Express();

app.use(Express.static(path.join(process.cwd(), "public")));
app.use(Express.json());

const PORT = 3000;

let users = [
  {
    id: randomUUID(),
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 25,
  },
  {
    id: randomUUID(),
    name: "Bob Smith",
    email: "bob.smith@example.com",
    age: 30,
  },
  {
    id: randomUUID(),
    name: "Carol Williams",
    email: "carol.williams@example.com",
    age: 28,
  },
  {
    id: randomUUID(),
    name: "David Brown",
    email: "david.brown@example.com",
    age: 35,
  },
  {
    id: randomUUID(),
    name: "Eve Davis",
    email: "eve.davis@example.com",
    age: 32,
  },
];

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json(users.find((user) => user.id === userId));
});

app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  users = users.filter((user) => user.id !== userId);

  res.json("User has been deleted");
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;

  const body = req.body;

  console.log({ body });

  users = users.map((user) => {
    if (user.id === userId) {
      return {
        ...user,
        ...(body.name ? { name: body.name } : {}),
        ...(body.age ? { age: Number(body.age) } : {}),
        ...(body.email ? { email: body.email } : {}),
      };

      //   const userToUpdate = user;

      //   if (body.name) {
      //     userToUpdate.name = body.name;
      //   }
      //   if (body.age) {
      //     userToUpdate.age = Number(body.age);
      //   }
      //   if (body.email) {
      //     userToUpdate.email = body.email;
      //   }

      //   return userToUpdate;
    }

    return user;
  });

  res.json("User has been updated");
});

const createUserValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(10).max(70).required(),
});

app.post("/users", (req, res) => {
  const body = createUserValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  const user = {
    id: randomUUID(),
    ...body.value,
  };

  if (!body.error) {
    users.push(user);
  }

  res.send(createListItem(JSON.stringify(user)));
});

const createListItem = (innerHTML) => {
  return `<li>${innerHTML}</li>`;
};

app.get("/users", (req, res) => {
  console.log("request received");
  res.send(users.map((user) => createListItem(JSON.stringify(user))).join(""));
});

app.listen(PORT, () => {
  console.log(`Server is listening http://localhost:${PORT}`);
});
