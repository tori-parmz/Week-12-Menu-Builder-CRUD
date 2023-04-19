//class for menu category
class MenuCategory {
    constructor(name) {
        this.name = name;
        this.menuItems = [];
        
    }
    addMenuItem(name, price) {
        this.menuItems.push(new MenuItem(name, price));
    }
}



//create classes for menu items

class MenuItem {
    static counter = 0; //calls on the class directly
    constructor(name, price) { //menu items will take a name, dollar amount price, and 1-2 sentence description
        this.name = name;
        this.price = price;
        this.id = MenuItem.counter++;//every time you create a subobject, it will increase the counter for each new object
        //
    }
}

//create class for menu service AJAX

class MenuService {
    static url = "https://64150cdae8fe5a3f3a143d74.mockapi.io/menuCategories";
    static getAllCategories() {
        return $.get(this.url);

    }

    static getCategory(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCategory(menuCategory) {
        return $.post(this.url, menuCategory);
    }

    static updateCategory(menuCategory) {

        return $.ajax({
            url: this.url + `/${menuCategory.id}`,
            dataType: "json",
            data: JSON.stringify(menuCategory),
            contentType: 'application/json',
            type: 'PUT'

        });
    }

    static deleteCategory(id) {
        return $.ajax({
        url: this.url + `/${id}`,
        type: 'DELETE'

        });
    }
}

//create class to clear out the DOM

class DOMManager {
    static menuCategories;

    static getAllCategories() {
        MenuService.getAllCategories().then(menuCategories => this.render(menuCategories));
    }

    static createCategory(name) {
        MenuService.createCategory(new MenuCategory(name))
            .then(() => {
                return MenuService.getAllCategories();
            })
            .then((menuCategories) => this.render(menuCategories));
    }

    static deleteCategory(id) {
        MenuService.deleteCategory(id)
        .then(() => {
            return MenuService.getAllCategories();
        })
        .then((menuCategories) => this.render(menuCategories));
    }

    static addMenuItem(id) {
        for(let menuCategory of this.menuCategories) {
            if (menuCategory.id == id) {
                console.log(menuCategory.menuItems);
                menuCategory.menuItems.push(new MenuItem($(`#${menuCategory.id}-item-name`).val(), $(`#${menuCategory.id}-item-price`).val(), $(`#${menuCategory.id}-item-descroption`).val()));
                MenuService.updateCategory(menuCategory)
                .then(() => {
                    return MenuService.getAllCategories();
                })
                .then((menuCategories) => this.render(menuCategories));
            }
        }
    }

    static deleteMenuItem(menuCategoryId, menuItemId) {
        for (let menuCategory of this.menuCategories) {
            if (menuCategory.id == menuCategoryId) {
                for (let menuItem of menuCategory.menuItems) {
                    if(menuItem.id == menuItemId) {
                        console.log(menuCategory.menuItems);
                        menuCategory.menuItems.splice(menuCategory.menuItems.indexOf(menuItem), 1);
                        MenuService.updateCategory(menuCategory)
                        .then(() => {
                            return MenuService.getAllCategories();
                        })
                        .then((menuCategories) => this.render(menuCategories));
                    }
                }
            }
        }
    }

    static render(menuCategories) {
        this.menuCategories = menuCategories;
        $('#app').empty();
        for (let menuCategory of menuCategories) {
            $('#app').prepend(
                `<div id="${menuCategory.id}" class="card mb-3">
                <div class="card-header">
                <h2>${menuCategory.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteCategory('${menuCategory.id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                    <div class="row">
                    <div class="col-sm">
                    <input type="text" id="${menuCategory.id}-item-name" class="form-control" Placeholder="Item Name">
                    </div>
                    <div class="col-sm">
                    <input type="text" id="${menuCategory.id}-item-price" class="form-control" Placeholder="Price ($0.00)">
                    </div><br><br>
                    </div>
                    <button id="${menuCategory.id}-new-item" onClick="DOMManager.addMenuItem('${menuCategory.id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
                </div>`

                );

            for (let menuItem of menuCategory.menuItems) {
                $(`#${menuCategory.id}`).find('.card-body').append(
                    `
                    <p>
                    <span id="name-${menuItem.id}">${menuItem.name}</span>
                    <span id="area-${menuItem.id}"><strong>Price: </strong> ${menuItem.price}</span>
                    <button class="btn btn-danger" onClick="DOMManager.deleteMenuItem('${menuCategory.id}', '${menuItem.id}')">Delete Item</button>
                    `
                    
                )
            }

            
        }

    }   
    
    

}

$('#create-new-category').on("click", () => {
    DOMManager.createCategory($('#new-category-name').val());
    console.log($('#new-category-name').val())
    $('#new-category-name').val('')
});

DOMManager.getAllCategories();
