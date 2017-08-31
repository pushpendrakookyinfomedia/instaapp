const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cateSchema = new Schema({
    cat_name: {
        type: String,
        required: [true, 'Category Name  Is Required']
    },
    cat_createdOn: {
        type: Date,
        default: Date.now
    },
    img_count: {
        type: Number,
        default: 0
    },
    share: {
        type: Number,
        default: 0
    }

});

const Category = mongoose.model('category', cateSchema);

module.exports = Category;

const Category_list = mongoose.model('categories', cateSchema);
const query = Category_list.find({});
module.exports.Category_list = Category.find({});


var catSchema = Schema({
    _id: Number,
    cat_name: String
})