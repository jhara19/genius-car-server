const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle wares
app.use(express.json());
app.use(cors());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD)

//USERNAME: geniusDBUser
//PASSW: qXehJhv2DZjnAUtH

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g1jzu3w.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{
     const servicesCollection = client.db('geniusCar').collection('services');
     const ordersCollection = client.db('geniusCar').collection('orders');

     app.get('/services', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page,size);
       const query =  {};
       const cursor = servicesCollection.find(query);
       const services = await cursor.skip(page*size).limit(size).toArray();
       //PAGINATION
       const count = await servicesCollection.estimatedDocumentCount();
       //res.send(services);
        res.send({count, services});
     });

     app.get('/services/:id', async (req,res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.send(service);
     });



//ORDERS GET ALL
     app.get('/orders', async (req, res) => {
       let query = {};
      if(req.query.email){
        query = {
         email: req.query.email
        }
        const cursor = ordersCollection.find(query);
        const orders = cursor.toArray();
        res.send(orders);
     }
     });

     //DELETE FUNCTION
      app.delete('/orders/:id', async (req, res) => {
         const id = req.params.id;
         const query = {_id: ObjectId(id)};
         const result = await ordersCollection.deleteOne(query);
         res.send(result);
      })
 

//ORDERS CREATE CHECKOUT PAGE SHOW
app.post('/orders', async (req,res) => {
   const order = req.body;
   const result = await ordersCollection.insertOne(order);
   res.send(result);
})


  }
  finally{
 
  }
}
run().catch(err => console.error('somthing wrong', err))

app.get('/', (req, res) => {
   res.send('Genius server is running');
});

app.listen(port, () => {
    console.log(`Genius car is running on port ${port}`);
});