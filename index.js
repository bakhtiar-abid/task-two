const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

//MongoDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xztta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();
      const database = client.db("taskTwo");
      const minionCollection = database.collection("Minion");
      console.log("Mongo Database is connected");

      //Create Minion
      app.post("/addMinion", async (req, res) => {
         const minionData = req.body;
         const result = await minionCollection.insertOne(minionData);
         console.log(result);
         res.json(result);
      });

      // View List of Minion

      app.get("/getMinion", async (req, res) => {
         const get = minionCollection.find({});
         const result = await get.toArray();
         res.json(result);
      });

      //Update a minion

      //UPDATE API
      app.put("/updateMinion/:id", async (req, res) => {
         const id = req.params.id;
         const updatedMinionName = req.body.name;
         const updatedMinionAge = req.body.age;
         const updatedMinionColor = req.body.color;
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               name: updatedMinionName,
               age: updatedMinionAge,
               color: updatedMinionColor,
            },
         };
         const result = await minionCollection.updateOne(
            filter,
            updateDoc,
            options
         );
         console.log("updating", id);
         res.json(result);
      });

      //delete a minion

      app.delete("/deleteMinion/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await minionCollection.deleteOne(query);
         res.json(result);
      });
   } finally {
   }
}

run().catch(console.dir);

app.get("/server", (req, res) => {
   res.send("Task-2 server");
});

app.listen(port, () => {
   console.log(`listening at ${port}`);
});
