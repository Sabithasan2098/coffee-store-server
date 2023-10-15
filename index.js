const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// ----------
// middleware
app.use(cors());
app.use(express.json());

// ---------------

// mongodb-connection-server

// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.wgolkq8.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgolkq8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeColection = client.db("coffeeDB").collection("coffee");
    // -----------__________--------------
    // mongodb te data set korar system
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeColection.insertOne(newCoffee);
      res.send(result);
    });

    // ---------------------------
    // mongodb theke data localhost api te nia aser system

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeColection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // ----------------------
    // delete korar system

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeColection.deleteOne(query);
      res.send(result);
    });

    // --------------------
    // specifiq id khuje ber korer jonno

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeColection.findOne(query);
      res.send(result);
    });

    // specifiq ke khuje ber korer por hbe update

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quentity: updateCoffee.quentity,
          suplier: updateCoffee.suplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
        },
      };
      const result = await coffeeColection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // -----------------------------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ---------------
app.get("/", (req, res) => {
  res.send("Coffee store server is running");
});

// ---------------
app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
