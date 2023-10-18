const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//assignment10
//eeGGHTF39jIOTaBb

const uri =
  "mongodb+srv://assignment10:eeGGHTF39jIOTaBb@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority";

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

    const productsCollection = client.db("technologyDB").collection("products");
    const cartsCollection = client.db("technologyDB").collection("carts");

    //post single
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);

      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //get all
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    // get one
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // update one
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;

      console.log("update id : ", id);

      const filter = { _id: new ObjectId(id) };

      const options = { upsert: true };

      const updatedProduct = req.body;

      // const newProduct = { UserName, userEmail, productName, bandName, bandName, price, shortDescription, rating }

      const product = {
        $set: {
          UserName: updatedProduct.UserName,
          userEmail: updatedProduct.userEmail,
          userEmail: updatedProduct.userEmail,
          productName: updatedProduct.productName,
          bandName: updatedProduct.bandName,
          price: updatedProduct.price,
          shortDescription: updatedProduct.shortDescription,
          rating: updatedProduct.rating,
        },
      };

      const result = await productsCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    //my post single
    app.post("/carts", async (req, res) => {
      const myNewProduct = req.body;
      console.log(myNewProduct);

      const result = await cartsCollection.insertOne(myNewProduct);
      res.send(result);
    });

    //my cart get all
    app.get("/carts", async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    //delete

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

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

app.get("/", (req, res) => {
  res.send(" technology server is running");
});

app.listen(port, () => {
  console.log(`technology server is running on port : ${port}`);
});
