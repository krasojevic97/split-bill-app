const express = require('express');
const app = express();
const fs = require("fs");
const path = require('path');
const cors = require('cors');
const port  = 5000;

const friendsFilePath = path.join(__dirname, 'src', 'friends.json');
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

app.get('/api/friends', (req, res) => {
    fs.readFile(friendsFilePath,'utf8',(err,data)=>{
        if(err){
            return res.status(500).send("Error reading file");
        }
        res.json(JSON.parse(data));
    })});

app.post('/api/friends', (req, res) => {
    // 
    const newFriend = req.body;
    // Read the file
    fs.readFile(friendsFilePath,'utf8',(err,data)=>{
        if(err){
            return res.status(500).send("Error reading file");
        }
        // Parse the file
        const friends = JSON.parse(data);
        // Add the new friend
        friends.push(newFriend);
        console.log(friends);
        // Write to the file
        fs.writeFile(friendsFilePath,JSON.stringify(friends,null,2),()=>{
            if (err) {
                return res.status(500).json({ error: 'Failed to save new friend' });
              } 
            res.json(newFriend);
        })    
    });
});

app.delete('/api/friends/:id', (req, res) => {
    const friendId = req.params.id;
    fs.readFile(friendsFilePath,'utf8',(err,data)=>{
        if(err){
            return res.status(500).json({ error: 'Failed to delete friend' });
        }
        let friends = JSON.parse(data);
        friends = friends.filter(f=>f.id!==friendId);
        fs.writeFile(friendsFilePath,JSON.stringify(friends,null,2),()=>{
            if (err) {
                return res.status(500).json({ error: 'Failed to delete friend' });
              } 
            res.status(204).end();
        })    
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});