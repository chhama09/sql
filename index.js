const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express=require("express");
const app =express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"));

const connection =mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'server_node',
    password: '0911Ch@t'
  });

let getRandomUser =()=>{
    return [
       faker.string.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
     
]};

app.get("/",(req,res)=>{
    let q="SELECT count(*) FROM user";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            count=result[0]["count(*)"];
            res.render("home.ejs",{count});

        });  
    }catch(err){
        res.send("some error in db");
    }
})



//user page/ SHOW page
app.get("/user",(req,res)=>{
    let q="SELECT * FROM user";
    try{
        connection.query(q,(err,users)=>{
            if (err) throw err;
            // let data=result;
            // console.log(data);
            res.render("user.ejs",{users});
        })
    }catch(err){
        res.send("some error occured");
    }
});

//Edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            res.render("edit.ejs",{user});
        })
    }catch(err){
        res.send("some error occured");
    }
});

//Update route
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password: formPass, username:newUsername}=req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            if(formPass != user.password){
                res.send("WRONG PASSWORD");
            }
            else{
                let q2=`UPDATE user SET username= '${newUsername}' WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/user")
                })
            }
        
            

        })
    }catch(err){
        res.send("some error occured");
    }
})

app.listen("8080",()=>{
    console.log("server is listening to port");
})




