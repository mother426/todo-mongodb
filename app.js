//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistdDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todoList"
});

const item2 = new Item ({
  name: "Click + to add a new item"
});

const item3 = new Item ({
  name: "Check box to check an item off your list"
});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {
  
  Item.find({}, (err, foundItems) => {
    if(foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else (
          console.log("success, database seeded")
        )
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log("deleted the checked item")
    }
  })
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("http://localhost:3000");
});
