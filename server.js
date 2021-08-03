'use strict'
const cors =require('cors');
const axios=require('axios');
const mongoose = require('mongoose');
const express=require('express');
const server =express();
require('dotenv').config();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT;

mongoose.connect('mongodb://Suad-Talafha:suad123456@cluster0-shard-00-00.gakox.mongodb.net:27017,cluster0-shard-00-01.gakox.mongodb.net:27017,cluster0-shard-00-02.gakox.mongodb.net:27017/Colors?ssl=true&replicaSet=atlas-119grk-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


const ColorsSchema = new mongoose.Schema({
    nameColor: String,
    imageUrl:String
  });

  const UsersSchema = new mongoose.Schema({
    email: String,
    colors:[ColorsSchema]
  });

  const ColorsModal = mongoose.model('Colors', UsersSchema);
 

 function SeedCollections(){
     const Suad= new ColorsModal(
         {
             email:'suadhusam0@gmail.com',
             Colors:[
                 {
                     name:'Black',
                     imageUrl:'http://www.colourlovers.com/img/000000/100/100/Black.png'
                 },
                 {
                    name:'Red',
                    imageUrl:'http://www.colourlovers.com/img/FF0000/100/100/Red.png'
                 }
             ]
         }

     )
     Suad.save()

     const Razan= new ColorsModal(
        {
            email:'suadhusam0@gmail.com',
            Colors:[
                {
                    nameColor:'Black',
                    imageUrl:'http://www.colourlovers.com/img/000000/100/100/Black.png'
                },
                {
                    nameColor:'Red',
                   imageUrl:'http://www.colourlovers.com/img/FF0000/100/100/Red.png'
                }
            ]
        }

    )
    Razan.save()
 }
 SeedCollections();


// server.get('/color',getUsercolor);

// function getUsercolor(req,res){
//     let userEmail=req.query.userEmail;
//     ColorsModal.find({email:userEmail},function(error,userColor){
//         if(error){
//             res.send('did not work')
//         }else{
//             res.send(userColor[0].Colors)
//         }
//     })
// }

class SelectedColors{
    constructor(nameColor,imageUrl){
        this.nameColor=nameColor,
        this.imageUrl=imageUrl

    }
}

let inMomary=[];
server.get('/color', async(req,res)=>{
if (inMomary.length !== 0){
    res.send(inMomary)
}else{
    let ApiData= await axios.get('https://ltuc-asac-api.herokuapp.com/allColorData/color');
    let dataFromApi=ApiData.data.map(color=>{
        return new SelectedColors(color.name ,color.imageUrl)
    })
    inMomary=dataFromApi;
    res.send(dataFromApi)
}
})
server.get('/addfav',addingToFav)
function addingToFav(req,res){
    let userEmail=req.params.userEmail;
    const {name,imageUrl}=req.body;
    ColorsModal.find({email:userEmail},(error,userColor)=>{
        if(error){
            res.send(error)
        }else{
            userColor[0].Colors.push(
              {
                nameColor:nameColor,
                  imageUrl:imageUrl
              }
            )
            userColor[0].save;
            res.send(userColor[0].Colors)
        }
    })
}


server.delete('/delete/:colorIndex',deleteColor);

function deleteColor(req,res){
    let reqEmail=req.query.reqEmail;
    let reqIndex=Number(req.params.colorIndex);
    ColorsModal.find({email:reqEmail},function(error,userColor){
        if (error){res.send('did not work')}
        else{
            let dataAfterDelete=userColor[0].Colors.filter((value,index)=>{
                if(index!==reqIndex){return value}
                else{
                    userColor[0].Colors=dataAfterDelete;
                    userColor[0].save();
                    res.send(userColor[0].Colors)
                }
            })
        }
    })
}
server.put('/update/:colorIndex',updateColor);
function updateColor(req,res){
    const {email,nameColor,imageUrl}=req.body;
    let index =req.params.colorIndex;
    ColorsModal.findOne({email:email},(error,userColor)=>{
        if (error){res.send('did not work')}
        else{
            userColor.Colors.splice(index,1,{
                nameColor:nameColor,
                imageUrl:imageUrl
            }) 
            userColor[0].save();
            res.send(userColor[0].Colors)
        }
    })
}

server.listen(PORT,()=>console.log(`listening on${PORT}`) )