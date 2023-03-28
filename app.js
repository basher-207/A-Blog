const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

function Chapter(title, content){
    this.title = title;
    this.content = content;
}

let testChapter = new Chapter("Test Title", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id neque aliquam vestibulum morbi. Convallis convallis tellus id interdum velit laoreet id. Bibendum ut tristique et egestas quis ipsum suspendisse. Auctor elit sed vulputate mi sit amet mauris. Interdum posuere lorem ipsum dolor. Ornare quam viverra orci sagittis eu volutpat. Posuere ac ut consequat semper viverra nam. Dignissim diam quis enim lobortis scelerisque. Nibh praesent tristique magna sit amet. Risus ultricies tristique nulla aliquet enim tortor. Integer feugiat scelerisque varius morbi enim nunc faucibus. Eu sem integer vitae justo eget magna. Risus nec feugiat in fermentum posuere. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget.");

let chaptersArr = [testChapter];

// MAIN PAGE
app.get("/", (req, res)=>{
    res.render("main", {arr:  chaptersArr});
});

//CHAPTER PAGE
app.get("/posts/:arrElementNumber/:title", (req, res)=>{
    const index = req.params.arrElementNumber;
    res.render("chapter", {title: chaptersArr[index].title, content: chaptersArr[index].content, index: index});
});

app.post("/posts/settings/:editOrDelete", (req, res)=>{

    switch (req.params.editOrDelete) {
        case "Edit":
            res.render("edit", {title: chaptersArr[req.body.index].title, content: chaptersArr[req.body.index].content, index: req.body.index});
            break;
        case "Delete":
            chaptersArr.splice(req.body.index, 1);
            res.redirect("/");
            break;
    
        default:
            console.log("Path is incorrect. Current rout: " + req.params.editOrDelete);
            break;
    }
});

app.post("/editing", (req, res)=>{
    const Index = req.body.currentIndex;
    const NewTitle = req.body.titleInput;
    const NewContent = req.body.contentInput;

    chaptersArr[Index].title = NewTitle;
    chaptersArr[Index].content = NewContent;
    res.redirect("/");
});


// COMPOSE PAGE
app.get("/compose", (req, res)=>{
    if(chaptersArr.length >= 3){
        chaptersArr.length = Math.min(chaptersArr.length, 3);
        res.render("compose-not");
    }else{
        res.render("compose");
    }
});

app.post("/compose", (req, res)=>{
    const chapter = new Chapter(req.body.titleInput, req.body.contentInput);
    chaptersArr.push(chapter);
    res.redirect("/");
});

//CONTACT PAGE
app.get("/contact", (req, res)=>{
    res.render("contact");
});

// STARTING THE SERVER
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server is runing on port: " + PORT + "...");
});