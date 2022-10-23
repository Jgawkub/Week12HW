// •	Create a full CRUD application of your choice using either an API or local Array.
// •	Use an existing API with AJAX to interact with it.
// •	If you do not use an API, store the entities you will create, read, update, and delete in an array.
// •	Use a form to post new entities.
// •	Build a way for users to update or delete entities
// •	Use Bootstrap and CSS to style your project.

class List {
  constructor(listName,listDate) {
    // I decided to go with a list app, allows you to
    this.listName = listName;
    this.items = [];
    this.listDate=listDate
  }
  addItem(itemName) {
    this.items.push(new Item(itemName));
  }
}

class Item {
  constructor(itemName) {
    this.itemName = itemName;
    // this.id1 = Math.floor(Math.random() * 100) Was thinking here about assigning an id to each item seeing as the api doesnt make one. Abandoned this in favor of just using the names of my food items. 
  }
}

class ListService {
  // below are all of my requests to the api.
  static url = "https://6352caffd0bca53a8eb55114.mockapi.io/lists";

  static getAllLists() {
    return $.get(this.url);
  }
  static getList(id) {
    return $.get(this.url + `/${id}`);
  }
  static createList(list) {
    return $.post(this.url, list);
  }
  static updateList(list) {
    return $.ajax({
      url: this.url + `/${list.id}`,
      dataType: "json",
      data: JSON.stringify(list),
      contentType: "application/json",
      type: "PUT",
    });
  }
  static deleteList(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }



}
// and below is my Manager that handles all of the function of getting, updating, adding and deleting things. 
class Manager {
  static lists=[];

  static getAllLists() {
    ListService.getAllLists().then((lists) => this.render(lists));
  }

  static deleteList(id) {
    console.log(`deleting ${id}`);
    ListService.deleteList(id)
      .then(() => {
        return ListService.getAllLists();
      })
      .then((lists) => this.render(lists));
  }
  
  static createList(listName, listDate) {
    console.log("this is", listName);
    ListService.createList(new List(listName, listDate))
      .then(() => {
        return ListService.getAllLists();
      })
      .then((lists) => this.render(lists));
  }


  static addItem(id) {
    console.log("adding");
    for (let list of this.lists) {
      if (list.id == id) {
        list.items.push(new Item($(`#${list.id}-item-name`).val()));
        console.log($(`#${list.id}-item-name`).val());
      }
      ListService.updateList(list)
        .then(() => {
          return ListService.getAllLists();
        })
        .then((lists) => this.render(lists));
    }
  }

  static deleteItem(listId, itemName) {
    //  rather than using itemID here I am using itemName. As far as I cna work out, mock api assigns my large list an id but not the items inside, so to find out what to delete I simply check if the passed in item name is the same as item.itemName. It seems to work find even if I have two things named the same. As I imagine it's also reading the position in the array. 
    console.log("deleting");
    console.log(itemName);
    for (let list of this.lists) {
      if (list.id == listId) {
        console.log(list.id);
        for (let item of list.items) {
          if (item.itemName == itemName) {
            console.log(item.itemName);
            list.items.splice(list.items.indexOf(item), 1);
            ListService.updateList(list)
              .then(() => {
                ListService.getAllLists();
              })
              .then((lists) => this.render(lists));
          }
        }
      }
    }
  }
  //I am getting an error here that lists is not iterable. I have to reload the page to see the item deleted. I did not always have the error and can;t seem to figure it out.
  static render(lists) {
    this.lists = lists;
    $("#data").empty();
    for (let list of lists) {
      $("#data").prepend(
        `<div id="${list.id}" class="card">
                <div class = "card header"> 
                    <h3>${list.listName}</h3>  <h4 class='float-right'> ${list.listDate}</h4>
                    <button class="btn btn-danger" onclick="Manager.deleteList('${list.id}')">Delete List</button> 

                        </div>
                            <div class='card-body'>
                                <div class='row'>
                                    <div class='col-sm'>
                                        <input type="text" id="${list.id}-item-name" class="form-control" placeholder="Item">
                                    </div> 
                                    <br>
                                        </div>
                                        <br>
                                        <div class='row'>
                                        <button id="${list.id}-new-item" onclick="Manager.addItem(${list.id})" class= "btn btn-primary" form-control>Add</button>
                                        </div>
                                    <br>       
                                </div>
                            </div>
                        </div><br>`
      );
      for (let item of list.items) {
        console.log(`#${list.id}`); //
        $(`#${list.id}`)
          .find(".card-body")
          .append(
            `<p>
                <span id="name-${item.itemName}"><strong>Item:</strong>${item.itemName}</span>
                <button class= "btn btn-danger" onclick="Manager.deleteItem(${list.id}, '${item.itemName}')">Delete Item</button>
                `
          );
      }
    }
  }
}

$("#submit").on("click", () => {//this is the main submit button. 
  console.log($("#list-name").val());
  Manager.createList($("#list-name").val(),$("#list-date").val() );
  $("list-name").val("");
});



Manager.getAllLists() // calling the function to show all the lists.
