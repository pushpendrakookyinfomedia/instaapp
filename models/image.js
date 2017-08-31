const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    user_id: {
        type: String,
        required: [true, "User Id Missing"]
    },
    img: {
        type: String,
        require: [true, "Upload Image"]
    },
    thumb_image: {
        type: String
    },
    category: {
        type: String
    },
    downloads: {
        type: Number,
        default: 0
    },
    share: {
        type: Number,
        default: 0
    },
    img_addedOn: {
        type: Date,
        default: Date.now
    }

});
var collectionName = 'image'
const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;