const express = require("express");
const fs = require('fs');
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

//Routes

//Render as HTML for browsers
// localhost:8000/users
app.get("/users", (req,res) => {
    const html = `
    <ul>
        ${users.map((user) =>  `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});


// Render as JSON for non browsers like Mobiles
// localhost:8000/api/users
app.get("/api/users", (req,res) =>{
    return res.json(users);
});



// Dynamic path parameters
// /api/users/:id
//app.get("/api/users/:id", (req,res) =>{
//    const id = Number(req.params.id);
//    const user = users.find((user) => user.id === id);
//    return res.json(user);
//});
//
//
//// Edit user with id
//app.post("/api/users", (req,res) => {
//    return res.json({ status : "pending"});
//});
//
//// Delete user with id
//app.delete("/api/users", (req,res) => {
//    return res.json({ status : "pending"});
//});


// Middleware (plugin)  -> urlencoded middleware will help posted data to insert into body
app.use(express.urlencoded({ extended: false }));

app.use((req,res,next) => {
    console.log("Middleware 2 for log.txt");
    fs.appendFile('log.txt',`\n${Date.now()}: ${req.method}: ${req.path}\n`,
        (err,data) => {
            next();
        }
    );
});

// Shortening redundant path routes
app .route("/api/users/:id")
    .get((req,res) =>{
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req,res) => {
        return res.json({ status : "pending"});
    })
    .delete((req,res) => {
        return res.json({ status : "pending"});
    });

    

app.post("/api/users", (req,res) => {
    const body = req.body;
    //console.log("Body",body);
    users.push({...body, id: users.length+1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
        return res.json({ status : "success", id: users.length});
    });
})


app.listen(PORT,() => console.log(`Server Started at Port : ${PORT}`))