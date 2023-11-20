import fs from 'fs'


class ProductManager {
    // static products = [];
    // static code = 0;
    constructor(path) {
        this.products = [];
        this.path = path || "Products.json"
        this.code = 0; /**Digamos que con el mismo codigo un producto para multiples cantidades */

    }
    // ENTREGA 1 #####################################
    addProduct(product) { // /metodo para añadir el archivo 
        const data = fs.readFileSync(this.path, 'utf-8');
        const array = JSON.parse(data);
        //console.log("pin here0",data.length)
        if(data.length <= 2){this.code = 1}
        else{this.code = array[array.length-1].id +1;}
        
        const prod = {
            id: this.code,
            title: product.title,
            description: product.description,
            code:product.code,
            price: product.price,
            status:product.status || true,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail || "Not Provided" //pide que sea opcional
        };
        //console.log("OldData",array)
        array.push(prod);
        //console.log("newdata",array)
        //console.log(this.code)
        fs.writeFileSync(this.path, JSON.stringify(array), 'utf-8')

    }
    getProductFromFile() { // obtiene los archivos creados en el.json
        const data = fs.readFileSync(this.path, 'utf-8');
        if (data.length < 1) { // Lista vacia pero crea el archivo inicialmente
            fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8')
            const data = fs.readFileSync(this.path, 'utf-8');
            return console.log(`Data is empty:${
                JSON.parse(data)
            }`);
        } else {
            try {
                const data = fs.readFileSync(this.path, 'utf-8');
                const array = JSON.parse(data);
                //console.log("This are the items in the system.")
                /* //desactivado para que solo me devuelva los arrays
                for (let i = 0; i < array.length; i++) {
                    const currentProduct = array[i]
                    console.log(`Item ${
                        i + 1
                    }`)
                    for (const key in currentProduct) {
                        console.log(`   ${key}: ${
                            currentProduct[key]
                        }`)
                    }
                }*/
                return array;
            } catch (error) {
                return 'I cannot see the file '
            }
        }
    }
    getProductById(id) {
        const data = fs.readFileSync(this.path, 'utf-8');
        const prods = JSON.parse(data);
        const product_index = prods.findIndex(x => {
            return x.code === id
        });

        if (! product_index) {
            return console.log(`\nItem with id: ${id} not found`);
        } else {
            console.log(`\nItem with id: ${id}`);
            console.log(prods[product_index]);

        }
    }

    // ENTREGA 2 ######################################
    updateProductById(id, new_product) {
        const data = fs.readFileSync(this.path, 'utf-8');
        const prods = JSON.parse(data);
        const index = prods.findIndex(x => {
            return x.id === id
        });

        if (index < 0) {
            return console.log(`\nWe cant update id: ${id} \nItem was not found\n`)
        } else {
            const product = prods[index];
            // console.log("before",product)
            for (const new_key in new_product) {
                if (product[new_key] !== undefined) {
                    product[new_key] = new_product[new_key];
                } else {
                    console.log(`\nThe key : {${new_key}} is not part of the dictionary so we cant update its value`)
                }
            }
            // console.log("after",product);
            prods[index] = product;
            fs.writeFileSync(this.path, JSON.stringify(prods), 'utf-8');

        }
    }

    // ////////////////////
    deleteProductById(id) {
        const data = fs.readFileSync(this.path, 'utf-8');
        const prods = JSON.parse(data);
        const index = prods.findIndex(x => {
            return x.id === id
        });

        if (index < 0) {
            return console.log(`\nItem by id: ${id} was not found cannot delete\n`);
        } else {
            console.log("WARNING YOU ABOUT TO DELETE AN ITEM THIS CANNOT BE UNDONE");
            prods.splice(index, 1);

            fs.writeFileSync(this.path, JSON.stringify(prods), 'utf-8');
            // /Por ahora no se como usar un input sin instalar un npm externo
            console.log(". . . . * DELETED*");
        }
    }
}

export {ProductManager};
/*
// Entrega1 #####################################

const productManager = new ProductManager();

//console.log("/////////////////////////RETURN THE EMPTYLIST//////////////////////")
console.log(productManager.getProductFromFile());

const item1 = {
    "title": "Leaf",
    "description": "This is a accesory item in the shape of a leaf",
    "code":"LEAF",
    "price": 100,
    "stock": 2,
    "category":"Clothing",//655ad7223a1cc5c2459344cd
    "thumbnail": "https://dodo.ac/np/images/a/af/Leaf_NH_Icon.png"
};
const item3 = {
    "title": "Acustic guitar",
    "description": "Decoration item, interactive",
    "code":"AGTR",
    "price": 3210,
    "stock": 1,
    "category":"Decoration",//655b805a1670771b144fdd88
    "thumbnail": "https://dodo.ac/np/images/4/42/Acoustic_Guitar_%28Natural%29_NH_Icon.png"
};

const item2 = {
    "title": "SoftServe Lamp",
    "description": "(Vanilla) Decoration item, interactive",
    "code":"SSL",
    "price": 3000,
    "stock": 1,
    "category":"Decoration",//655b805a1670771b144fdd88
    "thumbnail": "https://dodo.ac/np/images/7/78/Soft-Serve_Lamp_%28Vanilla%29_NH_Icon.png"
};

const item4 = {
    "title": "Moster statue",
    "description": "Decorative non specific kaiyu statue",
    "code":"MS",
    "price": 25000,
    "stock": 20,
    "category":"OutDoors Decour",//655b8093cee694d86c43a31a
    "thumbnail": "https://dodo.ac/np/images/d/d9/Monster_Statue_%28Brown%29_NH_Icon.png"
};

const item5 = {
    "title": "Antique Clock",
    "description": "Grand father clock, probably belonged to your aunt",
    "code":"AC",
    "price": 44000,
    "stock": 12,
    "category":"Decoration",655b805a1670771b144fdd88
    "thumbnail": "https://dodo.ac/np/images/b/b4/Antique_Clock_%28Brown%29_NH_Icon.png"
};
///////////////////////////////////////////////////////
const item6 = {
    "title": "Automatic washer",
    "description": "Revolutionary rotatory clothe cleaner, hard-ships begone",
    "code":"AW",
    "price": 4500,
    "stock": 5,
    "category":"Home Applience",//655b80b66c2c23d0e7344823
    "thumbnail": "https://dodo.ac/np/images/f/fd/Automatic_Washer_%28White%29_NH_Icon.png"
};
const item7 = {
    "title": "Academic painting",
    "description": "European exclusive",
    "code":"AAC",
    "price": 4980,
    "stock": 1,
    "category":"Home decoration,Museum object",//655b80d8f6a1dcde699a6d0e,655b80eac7eaf18b9c011295
    "thumbnail": "https://dodo.ac/np/images/f/f6/Academic_Painting_NH_Texture.png"
};

const item8 = {
    "title": "Bamboo grass",
    "description": "Smells like spring",
    "code":"OBG",
    "price": 3080,
    "stock": 1,
    "category":"OutDoors Decour",//655b8093cee694d86c43a31a
    "thumbnail": "https://dodo.ac/np/images/b/b7/Bamboo_Grass_NH_Icon.png"
};

const item9 = {
    "title": "Dynamic painting",
    "description": "Expensive and Harmonius",
    "code":"ADP",
    "price": 4980,
    "stock": 1,
    "category":"Home decoration,Museum object",//655b80d8f6a1dcde699a6d0e,655b80eac7eaf18b9c011295
    "thumbnail": "https://dodo.ac/np/images/7/78/Dynamic_Painting_NH_Texture.png"
};

const item10 = {
    "title": "Study chair",
    "description": "Tiny woden chair for studying ",
    "code":"FSC",
    "price": 1700,
    "stock": 1,
    "category":"Home forniture",//655b80d8f6a1dcde699a6d0e
    "thumbnail": "https://dodo.ac/np/images/5/58/Study_Chair_%28Natural_-_Yellow%29_NH_Icon.png"
};

/////////////////////////////////////////////////////////////////////////
productManager.addProduct(item1);
productManager.addProduct(item2);
productManager.addProduct(item3);
productManager.addProduct(item4);
productManager.addProduct(item5);
productManager.addProduct(item6);
productManager.addProduct(item7);
productManager.addProduct(item8);
productManager.addProduct(item9);
productManager.addProduct(item10);

console.log("/////////////////////////ITEM LIST//////////////////////")
console.log(productManager.getProductFromFile());
/*
console.log("/////////////////////////ITEM BY ID//////////////////////")
productManager.getProductById(3);

//ENTREGA2######################################

const item_update ={
    "underwear": "fresh",
    "value": 3100,
    "description": "Decoration item perfect for this summer season",
    "stock":24
}

console.log("/////////////////////////ITEM UPDATE//////////////////////")
productManager.updateProductById(2,item_update)
productManager.updateProductById(4,item_update)
productManager.getProductFromFile();
const item99 ={
    "title":"Dummy item", 
    "description":"NaN",
    "value": 99999,
    "thumbnail": "NaN", 
    "stock":9999};
console.log("/////////////////////////new item added//////////////////////")
productManager.addProduct(item99);
productManager.getProductFromFile();

console.log("/////////////////////////ITEM DELETION//////////////////////")
productManager.deleteProductById(5);
productManager.deleteProductById(3);


console.log(productManager.getProductFromFile());

*/