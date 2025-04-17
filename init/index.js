const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
 async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
    }

    main().then(()=>{
        console.log("Connection is successfull to  DB");
    });

    const initDB = async ()=>{
        await Listing.deleteMany({});
       initData.data =  initData.data.map((obj)=> ({...obj,owner:"67f8aaae582b4e8463ea722f"}));
        await Listing.insertMany(initData.data);
        console.log("data inserted successfully");
    }
    initDB();
