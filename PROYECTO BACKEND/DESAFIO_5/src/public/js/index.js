const socket = io();

console.log("connected")

let id_item =document.getElementById('iD')

//////////////////evento de agregar item //////////////////

let add_Button=document.getElementById('add_Button')
add_Button.addEventListener('click',(e)=>{
    e.preventDefault();
    ////////////////////////////items para ingreso
let title_item=document.getElementById('title').value
let desc_item=document.getElementById('description').value
let code_item=document.getElementById('code').value
let price_item=document.getElementById('price').value
let stock_item=document.getElementById('stock').value
let cat_item=document.getElementById('category').value
let img_item =document.getElementById("IMG").value
    let item_new={
        "title": title_item,
        "description":desc_item,
        "code":code_item,
        "price": price_item,
        "stock": stock_item,
        "category":cat_item,
        "thumbnail":img_item
    };
////////////////////////////////////////////////// check if empty field
    if(title_item.length===0 || desc_item.length ===0 || code_item.length ===0 || 
       price_item.length===0 || stock_item.length===0 || cat_item.length===0){
        Swal.fire({
            html:"<b>Please fill all the info</b>",
            toast:true,
            showConfirmButton: false,
            position:'top-right',
            timer:3000,
            timerProgressBar:true,
            color:"white",
            background:"red"
        })    
       }
////////////////////////////////////if fields are filled //////////
    else{
        socket.emit('add_item',item_new)
    }

})

socket.on("confirm_add",data=>{
    //console.log(data)
    if(data[0]===false){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `It seems there's already an item with the code ${data[1].code}`,
          });}
    else{
        console.log("Last id is",data[2])
        const lastItemElement = document.getElementById(data[2]);
        
        const newElement = document.createElement('ul');
        let new_item =data[3]
        console.log(new_item)
        newElement.id=new_item.id
        newElement.innerHTML = `
        <h2>ID:${new_item._id} Name: ${new_item.title}</h2>
        <img src="${new_item.thumbnail}" style="width:150px; border:1px solid black; "alt="https://dodo.ac/np/images/a/af/Leaf_NH_Icon.png">
        <li>Description: ${new_item.description}</li>
        <li>Code: ${new_item.code}</li>
        <li>Price: ${new_item.price} Bells</li>
        <li>category:${new_item.category}</li>
      `;
        lastItemElement.insertAdjacentElement('afterend', newElement)
    }
});

////////////////////////evento de borrrar
let delete_button=document.getElementById('delete_Button')
delete_button.addEventListener('click',()=>{
if(id_item.value.length<=0){
    Swal.fire({
        html:"<b>Some fields are empty</b>",
        toast:true,
        showConfirmButton: false,
        position:'top-right',
        timer:3000,
        timerProgressBar:true,
        color:"white",
        background:"red"
    })
}
else{
let select=document.getElementById(String(id_item.value))
console.log(select === null)
if(select === null){
    Swal.fire({
        html:`<b>item by ID ${id_item.value} is not in the list</b>`,
        toast:true,
        showConfirmButton: false,
        position:'top-right',
        timer:3000,
        timerProgressBar:true,
        color:"white",
        background:"red"
    })
}else{
Swal.fire({
    title: 'Are you sure?',
    text: `This will delete item with ID ${id_item.value} the file permanently.`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
        socket.emit('delete',id_item.value)
    } else {
      // Handle the cancel event here
    }
  });
}}
});
        
socket.on('confirm_delete',data=>{
    if(data[0]){//select.remove
        let select=document.getElementById(String(data[1]))
        select.remove()
    }
})
////////////////////////////////////////////
/*
id_item.addEventListener('keyup',evt=>{
    if(evt.key === 'Enter'){
        let select=document.getElementById(String(id_item.value))
        //select.remove();
        console.log("calling upon",select)
        socket.emit('mesagge',select)
    }
})
*/