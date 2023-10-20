import fs from 'fs'


class ProductManager {
    // static products = [];
    // static code = 0;
    constructor() {
        this.products = [];
        this.path = "Products.json"
        this.code = 0; /**Digamos que con el mismo codigo un producto para multiples cantidades */

    }
    // ENTREGA 1 #####################################
    addProduct(product) { // /metodo para añadir el archivo
        this.code ++
        const prod = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            value: product.value,
            code: this.code,
            stock: product.stock
        };
        this.products.push(prod);
        fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8')

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
            return x.code === id
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
            this.products[index] = product;
            fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8');

        }
    }

    // ////////////////////
    deleteProductById(id) {
        const data = fs.readFileSync(this.path, 'utf-8');
        const prods = JSON.parse(data);
        const index = prods.findIndex(x => {
            return x.code === id
        });

        if (index < 0) {
            return console.log(`\nItem by id: ${id} was not found cannot delete\n`);
        } else {
            console.log("WARNING YOU ABOUT TO DELETE AN ITEM THIS CANNOT BE UNDONE");
            this.products.splice(index, 1);

            fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8');
            // /Por ahora no se como usar un input sin instalar un npm externo
            console.log(". . . . * DELETED*");
        }
    }
}

export default ProductManager;

// Entrega1 #####################################
const productManager = new ProductManager();
/*
//console.log("/////////////////////////RETURN THE EMPTYLIST//////////////////////")
console.log(productManager.getProductFromFile());

const item1 = {
    "title": "Leaf",
    "description": "This is a accesory item in the shape of a leaf",
    "value": 100,
    "thumbnail": "https://dodo.ac/np/images/a/af/Leaf_NH_Icon.png",
    "stock": 2
};
const item3 = {
    "title": "Acustic guitar",
    "description": "Decoration item, interactive",
    "value": 3210,
    "thumbnail": "https://dodo.ac/np/images/4/42/Acoustic_Guitar_%28Natural%29_NH_Icon.png",
    "stock": 1
};

const item2 = {
    "title": "SoftServe Lamp",
    "description": "(Vanilla) Decoration item, interactive",
    "value": 3000,
    "thumbnail": "https://dodo.ac/np/images/7/78/Soft-Serve_Lamp_%28Vanilla%29_NH_Icon.png",
    "stock": 1
};

const item4 = {
    "title": "Moster statue",
    "description": "Decorative non specific kaiyu statue",
    "value": 25000,
    "thumbnail": "https://dodo.ac/np/images/d/d9/Monster_Statue_%28Brown%29_NH_Icon.png",
    "stock": 20
};

const item5 = {
    "title": "Antique Clock",
    "description": "Grand father clock, probably belonged to your aunt",
    "value": 44000,
    "thumbnail": "https://dodo.ac/np/images/b/b4/Antique_Clock_%28Brown%29_NH_Icon.png",
    "stock": 12
};
///////////////////////////////////////////////////////
const item6 = {
    "title": "Automatic washer",
    "description": "Revolutionary rotatory clothe cleaner, hard-ships begone",
    "value": 4500,
    "thumbnail": "https://dodo.ac/np/images/f/fd/Automatic_Washer_%28White%29_NH_Icon.png",
    "stock": 5
};
const item7 = {
    "title": "Academic painting",
    "description": "European exclusive",
    "value": 4980,
    "thumbnail": "https://dodo.ac/np/images/f/f6/Academic_Painting_NH_Texture.png",
    "stock": 1
};

const item8 = {
    "title": "Bamboo grass",
    "description": "Smells like spring",
    "value": 3080,
    "thumbnail": "https://dodo.ac/np/images/b/b7/Bamboo_Grass_NH_Icon.png",
    "stock": 1
};

const item9 = {
    "title": "Dynamic painting",
    "description": "Expensive and Harmonius",
    "value": 4980,
    "thumbnail": "https://dodo.ac/np/images/7/78/Dynamic_Painting_NH_Texture.png",
    "stock": 1
};

const item10 = {
    "title": "Study chair",
    "description": "Tiny woden chair for studying ",
    "value": 1700,
    "thumbnail": "https://dodo.ac/np/images/5/58/Study_Chair_%28Natural_-_Yellow%29_NH_Icon.png",
    "stock": 1
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
// //////////////////////////////////////////////////// Entrega 3
