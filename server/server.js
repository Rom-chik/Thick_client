const express = require('express');
const mongoose = require('mongoose');
const itemModel = require('./schemaDB');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const socketIo = require('socket.io');
//const http = require('http');

const app= express();
//const server = http.createServer(app);
//const io = socketIo(server);

PORT = 3000;
app.use(express.json());

//mongodb connection
mongoose.connect("mongodb://localhost:27017/RESTfull")
    .then(() => {
        console.log('connected to MongoDB')
    }).catch((error) => {
    console.log(error)
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/',express.static('client'));


app.get('/', function(req, res){
    res.redirect(`http://localhost:${PORT}/index.html`);
});


// Socket.IO connection handler
/*io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});*/


//get data from database
app.get('/getItems', async(req, res) => {
    try {
        const items = await itemModel.find({});
        res.status(200).json(items)
        ifBirthday(items);
        //console.log(`items log: ${items}`) //console log our database objects
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
});


//send data to database
app.post('/addItem', async(req, res) => {
    try {
        console.log(req.body);
        //console.log(req.body.data);
        const items = await itemModel.create(req.body.data);
        res.status(200).json(items);
        console.log(items);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


//edit item data
app.put('/editItem/:id', async(req, res) => {
    try {
        const itemId = req.params.id;
        const updatedItem = await itemModel.findOneAndReplace({_id: itemId}, req.body.data, {new: true});
        res.json({updatedItem}); //res.status(200) треба ??
        // Emit an update
        io.emit('itemUpdated', updatedItem);
        console.log(updatedItem);
    }catch (error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


//delete item
app.delete('/deleteItem/:id', async(req, res) => {
    try {
        const itemID = req.params.id;
        await itemModel.deleteOne({_id: itemID});
        /* res.json({deletedCount: result.deletedCount});*/
        res.json("successfully deleted");
    } catch(error) {
        res.status(500).json({error: "DelEtE ErroR"});
    }
});


// Business function (checks if its client's birthday)
const ifBirthday = (items) => {
    /*console.log(items);*/
    //--today date generator--
    const todayDate = new Date().toLocaleDateString('en-us', { year:"numeric", month:"short", day: "numeric"})

    for (let i = 0; i <= items.length - 1; ++i) {
        //--current date from database looped obj--
        const currentDateOfBirth = new Date(items[i].date).toLocaleDateString('en-us', { year:"numeric", month:"short", day: "numeric"});
        if(todayDate === currentDateOfBirth) {
            console.log(`it's ${items[i].name} ${items[i].surname} Birthday today!`);
        }
    }
};


//send congratulation message via email
app.post('/birthday', async(req, res) => {
    console.log(req.body.data);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,//testEmailAccount.user,
            pass: process.env.EMAIL_PASSWORD//testEmailAccount.pass
        }
    });
    //message  data
    let result = req.body.data;

    transporter.sendMail(result).then((info) => {
        return res.status(201).json({message: "Message was sent, your app is working great",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    }).catch(error => {
        return res.status(500).json({error})
    })

});