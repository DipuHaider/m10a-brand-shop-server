const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
// app.use(express.json());
// const corsConfig = {
//   origin: "*",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// };
// app.use(cors(corsConfig));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7lzpbmm.mongodb.net/?retryWrites=true&w=majority`;
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
    //await client.connect();

    const userCollection = client.db("automotiveDB").collection("user");
    const brandCollection = client.db("automotiveDB").collection("brand");
    const productCollection = client.db("automotiveDB").collection("product");
    const cartCollection = client.db("automotiveDB").collection("cart");

    //Cart related apis

    //Read cart
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Add to cart
    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });

    //Delete product from cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //Product related apis

    //Read product
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Read single product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //Create product
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    //Update product
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
        $set: {
          name: updatedProduct.name,
          image: updatedProduct.image,
          type: updatedProduct.type,
          price: updatedProduct.price,
          desc: updatedProduct.desc,
          rating: updatedProduct.rating,
        },
      };

      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    // brand related apis

    //Read brand
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //Read single Brand
    app.get("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    //Create Brand
    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    //Update Brand
    app.put("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBrand = req.body;

      const brand = {
        $set: {
          name: updatedBrand.name,
          logo: updatedBrand.logo,
          banner1: updatedBrand.banner1,
          banner2: updatedBrand.banner2,
          banner3: updatedBrand.banner3,
        },
      };

      const result = await brandCollection.updateOne(filter, brand, options);
      res.send(result);
    });

    //Delete Brand
    app.delete("/brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandCollection.deleteOne(query);
      res.send(result);
    });

    //user related apis

    //create user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Automotive Brand Shop Server is running");
});

app.listen(port, () => {
  console.log(`Automotive Brand Shop Server is listening on port ${port}`);
});
