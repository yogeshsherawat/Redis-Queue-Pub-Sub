import { createClient } from 'redis';
import express from 'express';
import bodyparser from 'body-parser';
const app = express();
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

app.use(bodyparser.urlencoded({extended:true}));
await client.set("user","me");

let value = await client.get("user");
console.log(value);

app.get('/',function(req,res){
    res.send("hey you");
});

app.get('/queue', async function(req,res){
    let item = await client.BRPOP('queue' , 0);
    res.json(item);
})

app.post('/event',async function(req,res){
    let {event_id} = req.body;
    let ids = event_id.trim().split(",");
    const PromiseArray = [];
    ids.forEach(id => {
        let promise = client.LPUSH('queue',id);
        PromiseArray.push(promise);
    });
    await Promise.all(PromiseArray);
    res.send("success");
})

// publising message code
app.post('/publish',async function(req,res){
    let {message} = req.body;
    client.publish('yogesh',message);
    res.send('Message Published');
})



// listening to publisher
const subscriber = client.duplicate();
await subscriber.connect();
await subscriber.subscribe('yogesh', (message) => {
    console.log(message); // 'message'
});



app.listen(4000);