const express = require('express');
const mongoose = require('mongoose');
const server= express();
const itemModel = require('./schemaDB');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();


PORT = 3000;
server.use(express.json());

//mongodb connection
mongoose.connect("mongodb://localhost:27017/RESTfull")
    .then(() => {
        console.log('connected to MongoDB')
    }).catch((error) => {
    console.log(error)
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


server.use(bodyParser.json());
server.use(express.static(__dirname));
server.use('/',express.static('client'));


server.get('/', function(req, res){
    res.redirect(`http://localhost:${PORT}/index.html`);
});



//get data from database
server.get('/getItems', async(req, res) => {
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
server.post('/addItem', async(req, res) => {
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
server.put('/editItem/:id', async(req, res) => {
    try {
        const itemId = req.params.id;
        const items = await itemModel.findOneAndReplace({_id: itemId}, req.body.data, {new: true});
        res.json({items}); //res.status(200) треба ??
        console.log(items);
    }catch (error){
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


//delete item
server.delete('/deleteItem/:id', async(req, res) => {
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
server.post('/birthday', async(req, res) => {
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