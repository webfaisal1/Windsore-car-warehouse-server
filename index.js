const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dh4fn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("WindsorCar").collection("items");
    app.get("/", (req, res) => {
      res.send("Windsor Car Warehouse is Running");
    });

    //  load data
    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // single items
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.send(result);
    });

    // items put
    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const updateStock = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: updateStock };
      const result = await itemsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // post items
    app.post("/items", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      console.log(newItem);
      const result = await itemsCollection.insertOne(newItem);
      res.send(result);
    });

    //  delete items
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    // my items
    app.get("/myItems", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = itemsCollection.find(query);
      const result = await cursor.toArray(cursor);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("This server is listening", port);
});
