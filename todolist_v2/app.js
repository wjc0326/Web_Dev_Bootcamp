const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Anita:305895659@cluster0.b9z2d57.mongodb.net/todolistDB");


// Build structure and create model
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({name: "Buy Food"});
const item2 = new Item({name: "Cook Food"});
const item3 = new Item({name: "Eat Food"});
const defaultItems = [item1, item2, item3];
const otherItem1 = new Item({name: "Welcome to the ToDoList system!"});
const otherItem2 = new Item({name: "Click + to add items"});
const otherItem3 = new Item({name: "Click the checkbox to delete item"});
const defaultListItems = [otherItem1, otherItem2, otherItem3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


// node.js part
app.get("/", function(req, res) {

  let day = date.getDate();

  Item.find({}, function(err, foundItems) {
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Success added");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("lists", {
        listTitle: day,
        newListItems: foundItems
      });
    }
  });
});


app.get("/:customeListName", function(req, res){
  const customeListName = _.capitalize(req.params.customeListName);

  List.findOne({name: customeListName}, function(err, results){
    if (!err){
      if (results){
        // Show an existing list
        res.render("lists", {
          listTitle: results.name,
          newListItems: results.items
        });
      }
      else{
        // Create a new list
        const list = new List({
          name: customeListName,
          items: defaultListItems
        });

        list.save();
        res.redirect("/" + customeListName);
      }
    }
  });
});


app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({name: itemName});

  let day = date.getDate();
  // Home Page
  if (listName === day){
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});


app.post("/delete", function(req, res){
  const deleteItemName = req.body.checkbox;
  const listName = req.body.listName;

  let day = date.getDate();

  if (listName === day) {
    Item.deleteOne({name: deleteItemName}, function(err){
      if (err){
        console.log(err);
      } else {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {name: deleteItemName}}},
      function(err, foundlist){
        if (!err){
          res.redirect("/" + listName);
        }
      }
    );
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server is running on port 3000");
});
