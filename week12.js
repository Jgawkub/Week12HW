class List{constructor(listName){
this.listName=listName
this.items=[]
}
addItem(itemName){
    this.items.push(new Item(itemName));

}
}  


class Item{constructor(itemName){
    this.itemName=itemName
}
}

class ListService{
    static url = "https://6352caffd0bca53a8eb55114.mockapi.io/lists";

    static getAllLists(){
        return $.get(this.url);
    }
    static getList(id){
        return $.get(this.url+`/${id}`);
    }
    static createList(list){
        return $.post(this.url, list);
    }
    static updateList(list){
        return $.ajax({
            url:this.url + `/${list.id}`,
            dataType:'json',
            data: JSON.stringify(list),
            contentType:'application/json',
            type:'PUT'

        })
    }
    static deleteList(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type:'DELETE'
        })
    }


    // static updateItem(item){
            
    //         return $.ajax({
    //         url:this.url + `/${item.id}`,
    //         dataType:'json',
    //         data: JSON.stringify(item),
    //         contentType:'application/json',
    //         type:'PUT'

    //     })
    // }

    // static createItem(item){
    //     return $.post(this.url, item)
    // }

    
    
}


class Manager{
    static lists;

    static getAllLists(){
        ListService.getAllLists().then(lists=>this.render(lists));
    }

    static deleteList(id){
        console.log(`deleting ${id}`)
        ListService.deleteList(id).then(()=> {
            return ListService.getAllLists();
        })
        .then((lists)=>this.render(lists));
    }
    static createList(listName){
        console.log("this is",listName)
        ListService.createList(new List(listName))
        .then(()=>{
            return ListService.getAllLists();

        })
        .then((lists) => this.render(lists));
    }


    // static addItem(){
    //     list.items.push(new Item($(`#${list.id}-item-name`.val()))))
    // console.log((`#${list.id}-item-name`.val()))
    // }


   

    static addItem(id){
        
        for(let list of this.lists){
            if(list.id==id){
                list.items.push(new Item($(`#${list.id}-item-name`).val()))
                console.log($(`#${list.id}-item-name`).val())
        }
            ListService.updateList(list)
            .then(()=>{
                return ListService.getAllLists()
            })
            .then((lists)=>this.render(lists));
            }
            
    }

    static deleteItem(listId,itemId){
        console.log('deleting');
        for( let list of this.lists){
            if(list.id==listId){
                for(let item of list.items){
                    if(item.id==itemId){
                        list.items.splice(list.items.indexOf(item),1)
                        
                        ListService.updateList(list)
                        .then(()=>{ListService.getAllLists();
                        })
                        .then((lists)=>this.render(lists));
                    }
                }
            }
        }
    }


static render(lists){
    this.lists=lists
    $('#data').empty();
    for(let list of lists){
        $('#data').prepend(
            `<div id="${list.id}" class="card">
                <div class = "card header"> 
                    <h3>${list.listName}</h3>
                    <button class="btn btn-danger" onclick="Manager.deleteList('${list.id}')">Delete List</button> 

                        </div>
                            <div class='card-body'>
                                <div class='card'>
                                <input type="text" id="${list.id}-item-name class="form-control" placeholder="Item">
                                <button id="${list.id}-new-item" onclick="Manager.addItem('${list.id}')" class= "btn btn-primary" form-control>Add</button>
                                </div>
                                </div>
                        </div>
            `
        );
        for (let item of list.items){
            $(`#${list.id}`).find('.card-body').append(
                `<p>
                <span id="name-${item.id}">Name:${'(#{list.id}-item-name)'}.val()</span>
                <button class= "btn btn-danger" onclick="Manager.deleteItem('${list.id}', '${item.id}')">Delete Item</button>
                
                `
            );
        }
    }
}
}

$('#submit').on('click',()=>{
    console.log($('#list-name').val())
Manager.createList($('#list-name').val())
$('list-name').val('');

});

Manager.getAllLists()

