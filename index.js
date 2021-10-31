const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toook.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    const database = client.db("nobarunTour");
    const pakagesCollection = database.collection("pakages");
    const usersCollection = database.collection("users");
   
    // GET Pakage API
    app.get('/pakages', async (req, res) => {
        const cursor = pakagesCollection.find({});
        const pakages = await cursor.toArray();
        res.send(pakages);
        
    })

    // GET Single Pakage
    app.get('/pakages/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const pakage = await pakagesCollection.findOne(query);
        res.json(pakage);
    })

    // POST Pakage API
    app.post('/pakages', async (req, res) => {
        const pakage = req.body;
        const result = await pakagesCollection.insertOne(pakage);
        res.json(result);
    })

    // GET Users API
    app.get('/users', async (req, res) => {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
        
    })

    // POST Users API
     app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Nobarun Tour Server');
});

app.listen(port, ()=> {
    console.log('Listening from port:', port);
} )
