const mongoose = require('mongoose')
const bodyParser = require("body-parser");
const express = require("express");

const itemSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "no name entered"]
        },
        surname: {
            type: String,
            required: [true, "no surname entered"]
        },
        email:{
            type: String,
            required: [true, "NO EMAIL entered"]
        },
        date: {
            type: Date,
            required: [true, "no date of birth entered"]
        }

    },
    {
        timestamps: true
    }
)


const itemModel = mongoose.model('certificates', itemSchema);

module.exports = itemModel;