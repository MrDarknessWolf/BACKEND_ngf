import mongoose from "mongoose"

const { Schema, model } = mongoose;
const productSchema = new Schema({
  title: { type: String, required: true },
  description:{type:String},
  code:{type:String,required:true},
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  thumbnail:{type:String},
  visible: { type: Boolean, default: true},
});

const Product = model('Product', productSchema);

export default Product;