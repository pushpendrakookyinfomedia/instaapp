const express = require('express');
var app = express();
const router = express.Router();
const User = require('../models/user');
const Category = require('../models/category');
const multer = require('multer');
var imager = require('multer-imager');
var nodemailer = require('nodemailer');
const Image = require('../models/image');

const hash = require('../models/hashtag');
// let upload = multer({ storage: multer.memoryStorage() });
//var upload = multer({ dest: 'Images/' })
var img_name = '';
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Images/')
    },
    filename: function(req, file, cb) {
        img_name = file.fieldname + '-' + Date.now() + '-' + file.originalname;
        cb(null, img_name);
    }
})

var upload = multer({ storage: storage })

//Register New User


var storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Profile/')
    },
    filename: function(req, file, cb) {
        img_name = file.fieldname + '-' + Date.now() + '-' + file.originalname
        cb(null, img_name)
    }
})


var upload1 = multer({ storage: storage1 })




router.post('/signup', upload1.single('profileImg'), function(req, res) {
    var email = req.body.userEmail;

    var data = Array();
    var arr = []
    arr = Array();
    arr = { "name": req.body.name, "userEmail": req.body.userEmail, "profileImg": img_name }

    res.send
    var randomnumber = Math.floor(Math.random() * 90000) + 10000;
    //  console.log(randomnumber);

    data = { 'name': req.body.name, 'userEmail': email, 'otp': randomnumber };
    // var createTransport = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'pushpendrasngh672@gmail.com',
    //         pass: 'xxxxxxxxxx'
    //     }
    // });

    // var mailOptions = {
    //     from: 'pushpendrasngh672@gmail.com',
    //     to: 'kookyinfomedia@gmail.com',
    //     Subject: 'Test Node Mailer',
    //     text: "This Is Testing Mail Sent through nodeMailer"

    // }
    // createTransport.sendMail(mailOptions, function(err, res) {
    //         if (err) {
    //             throw err;
    //         } else {
    //             console.log(res.response);
    //         }

    //     })
    User.count({ userEmail: email }, function(err, count) {
        if (count == 0) {
            User.create(arr).then(function(user) {
                res.type('application/json');
                res.setHeader("Content-Type", "application/json");
                res.json({ response: 1, data: user, message: " Account Created" });

                //    res.send(user);
            });
        } else {
            res.type('application/json');
            res.setHeader("Content-Type", "application/json");
            res.json({ response: 0, data: 'user', message: " Account Already Created" });


        }
    })
});
//login id
router.post('/login', upload.single('img'), function(req, res) {
    User.count({ userEmail: req.body.userEmail, userPassword: req.body.userPassword }, function(err, count) {
        if (count == 1) {
            User.findOne({ userEmail: req.body.userEmail, userPassword: req.body.userPassword }, function(err, user) {
                res.type('application/json');
                res.setHeader("Content-Type", "application/json");
                res.json({ response: 1, data: user, message: " Account login" });
            })

        } else {
            res.type('application/json');
            res.setHeader("Content-Type", "application/json");
            res.json({ response: 0, data: "user", message: "Invalid login" });

        }
    });
})


//add Category
router.post('/addCategory', upload.single('img'), function(req, res) {
    // console.log(req.body);
    Category.create(req.body).then(function(category) {
        res.send(category);
    });
});

// Api for Fb Login
router.post('/fbLogin', upload.single('img'), function(req, res) {
    data = Array();
    if (req.body.userEmail != '' && req.body.name != '' && req.body.fbKey != '') {

        User.count({ userEmail: req.body.userEmail, fbKey: req.body.fbKey }, function(err, count) {
            if (count == 0) {
                data['response'] = 1;
                User.create(req.body).then(function(user) {
                    res.type('application/json');
                    res.setHeader("Content-Type", "application/json");
                    res.json({ response: 1, data: user, message: " Account Create" });
                });

            } else {
                User.findOne({ userEmail: req.body.userEmail, fbKey: req.body.fbKey }, function(err, user) {
                    res.type('application/json');
                    res.setHeader("Content-Type", "application/json");
                    res.json({ response: 1, data: user, message: " Account login" });
                })
            }
        })
    } else {
        res.json({ response: 0, data: [], message: " Data missing" });

    }

});

//Api for gplus
router.post('/gPlusLogin', upload.single('img'), function(req, res) {
    data = Array();
    if (req.body.userEmail != '' && req.body.name != '' && req.body.gPlusKey != '') {

        User.count({ userEmail: req.body.userEmail, gPlusKey: req.body.gPlusKey }, function(err, count) {
            if (count == 0) {
                data['response'] = 1;
                User.create(req.body).then(function(user) {
                    res.type('application/json');
                    res.setHeader("Content-Type", "application/json");
                    res.json({ response: 1, data: user, message: " Account Create" });
                });

            } else {
                User.findOne({ userEmail: req.body.userEmail, gPlusKey: req.body.gPlusKey }, function(err, user) {
                    res.type('application/json');
                    res.setHeader("Content-Type", "application/json");
                    res.json({ response: 1, data: user, message: " Account login" });
                })
            }
        })
    } else {
        res.json({ response: 0, data: [], message: " Data missing" });
    }
});


//display Category List
router.get('/categoryList', function(req, res) {

    Category.find(function(err, categoryList) {
        if (err) { throw err; } else {

            res.type('application/json');
            res.setHeader("Content-Type", "application/json");
            res.json({ response: 1, data: categoryList, message: " Account login" });

        }
    });
});
//Show All Uploads
router.get('/showUploads', upload.single('img'), function(req, res) {
    Image.find(function(err, img_list) {
        res.send(img_list);
    });
});
//get Category Count
router.get('/count', upload.single('img'), function(req, res) {
    var test = '';
    var nodeArr;
    var cat_arr = new Array();
    var cat_img_c = new Array();
    Category.find(function(e, cl) {
        for (var x in cl) {
            c_cal = cl[x];
            // Image.find({ "category": { "$regex": c_cal._id, "$options": "i" } }).count(function(err, img_list1) {
            //     console.log(c_cal._id + "to ==" + img_list1);
            //     test = test + ',' + img_list1;
            // });
            img_count(c_cal._id, function(res) {
                console.log(res);
                nodeArr = res;
            });
        }
    });
    console.log("-----------");
    console.log(test);


    var chk = [];
    Image.find(function(err, img_list) {
        for (var i in img_list) {
            val = img_list[i];
            //  console.log(val.category);
        }
        chk = img_list;
    });
});

function img_count(cid, callback) {
    Image.find({ "category": { "$regex": cid, "$options": "i" } }).count(function(err, img_list1) {


        var query = { "_id": cid };
        var update = { $inc: { img_count: img_list1 } }
        var options = { new: true };
        Category.findByIdAndUpdate(query, update, options, function(err, person) {
            if (err) {
                console.log('got an error');
            }
            //   console.log(person);
            // at this point person is null.
        });
        console.log(cid + "------------to ==" + img_list1);
    });

}
router.post('/imgUpload', upload.single('img'), function(req, res) {
    var resizeImage = require('resize-image');
    var fs = require('fs'),
        gm = require('gm');

    // Include ImageMagick
    var im = require('imagemagick');
    var thumb = require('node-thumbnail').thumb;
    thumb({
        source: 'Images/' + img_name, // could be a filename: dest/path/image.jpg
        destination: 'thumbnail/',
        suffix: '',
        concurrency: 4,
        width: 200,
    }).then(function(err, data) {
        console.log("success");
    }).catch(function(e) {
        console.log('Error', e.toString());
    });
    var arr;
    cat_id = req.body.category;
    arr = cat_id.split(",");
    // console.log(arr);

    var user;
    user_id = req.body.tag;
    user = user_id.split(",");

    for (var i = 0; i < arr.length; i++) {

        var query = { "_id": arr[i] };
        var update = { $inc: { img_count: 1 } }
        var options = { new: true };
        Category.findByIdAndUpdate(query, update, options, function(err, person) {
            //     console.log("Category_di = " + person);
        })
    }

    for (var x = 0; x < user.length; x++) {


        var query = { "_id": user[x] };
        var update = { $inc: { totalInvite: 1 } }
        var options = { new: true };
        User.findByIdAndUpdate(query, update, options, function(err, person) {
            //   console.log("user_id = " + res);
        })
    }
    //Get #tag
    // var tag = req.body.description.split('#')
    // console.log(req.body.description.split('#'));
    // for (var a = 0; a < tag.length; a++) {
    //     hash.count({ hash_name: tag[a] }, function(err, count) {
    //         if (count == 0) {
    //             hash.create(arr).then(function(user) {});
    //         }
    //     })
    // }


    Image.create(req.body).then(function(image) {
        res.type('application/json');
        res.setHeader("Content-Type", "application/json");
        res.json({ response: 1, data: req.body, message: " Image Upload Success" });

    })
})


// Show User Uploaded Image
router.post('/myUploads', upload.single('img'), function(req, res) {
    Image.find({ 'user_id': req.body.user_id }, function(err, img_list) {
        res.send(img_list);
    });
});
//Upload Image
router.post('/uploadImage', upload.single('img'), function(req, res) {
    let arr = {
        'user_id': req.body.user_id,
        'category': req.body.Category_id,
        'full_image': req.file.filename
    }
    Image.create(arr).then(function(image) {
        res.send(image);
    });
});


// find image According To the Category

router.post('/getImage', upload.single('img'), function(req, res) {
    Image.find({ "category": { "$regex": req.body.Category_id, "$options": "i" } }, function(err, img_list) {
        res.send(img_list);
    });
});
//
//Download Image
router.post('/downloadImage', upload.single('img'), function(req, res) {


    var query = { "_id": req.body.img_id };
    var update = { $inc: { downloads: 1 } }
    var options = { new: true };
    Image.findByIdAndUpdate(query, update, options, function(err, person) {
        if (err) {

            res.json({ response: 0, data: "fail", message: " Image Downloadding" });
        } else {

            res.json({ response: 1, data: req.body, message: " Image Download Success" });
        }
    })
})

router.post('/shareImage', upload.single('img'), function(req, res) {


    var query = { "_id": req.body.img_id };
    var update = { $inc: { share: 1 } }
    var options = { new: true };
    Image.findByIdAndUpdate(query, update, options, function(err, person) {
        if (err) {

            res.json({ response: 0, data: "fail", message: " Image Downloadding" });
        } else {

            res.json({ response: 1, data: req.body, message: " Image Download Success" });
        }
    })
});



router.post('/OtpVerify', upload.single('img'), function(req, res) {

    email = req.body.userEmail;

    otp = req.body.otp;
    res.type('application/json');
    res.setHeader("Content-Type", "application/json");

    User.findOne({ userEmail: email, otp: otp }, function(err, found) {
        if (!found) {
            res.json({ response: 1, data: "user", message: " Invalid Data" });

        } else {

            User.findOne({ userEmail: email }, function(err, user) {
                    //     res.send(user._id);
                    User.findByIdAndUpdate({ "_id": user._id }, { $set: { otp: 0 }, $set: { isOtpVerify: true } }, { new: true }, function(err, person) {
                        if (err) {

                            res.json({ response: 0, data: "fail", message: " Otp Not Verify" });
                        } else {
                            res.send(person);

                            //res.json({ response: 1, data: req.body, message: " OTP Verify Success" });
                        }
                    })

                })
                // var query = { "userEmail": email };
                // var update = { $set: { otp: 0 }, $set: { isOtpVerify: true } }
                // var options = { new: true };



            // Image.findOneAndUpdate({ "userEmail": email }, { $set: { otp: 0 }, $set: { isOtpVerify: true } }, { new: true }, function(err, person) {
            //     if (err) {

            //         res.json({ response: 0, data: "fail", message: " Otp Not Verify" });
            //     } else {
            //         res.send(person);

            //         //res.json({ response: 1, data: req.body, message: " OTP Verify Success" });
            //     }
            // })
        }
        // if (count == 1) {

        //     var query = { "userEmail": email };
        //     var update = { $set: { otp: 0, isOtpVerify: true } }
        //     var options = { new: true };

        //     Image.findByIdAndUpdate(query, update, options, function(err, person) {
        //         if (err) {

        //             res.json({ response: 0, data: "fail", message: " Otp Not Verify" });
        //         } else {

        //             res.json({ response: 1, data: req.body, message: " OTP Verify Success" });
        //         }
        //     })

        // } else {

        //     res.type('application/json');
        //     res.setHeader("Content-Type", "application/json");
        //     res.json({ response: 1, data: "user", message: " Invalid Data" });
        // }
    })


    // var query = { "_id": req.body.img_id };
    // var update = { $inc: { share: 1 } }
    // var options = { new: true };
});

router.post('/resetPassword', upload.single('img'), function(req, res) {

    var query = { "_id": req.body.user_id };
    var update = { $set: { userPassword: req.body.userPassword } }
    var options = { new: true };

    User.findByIdAndUpdate(query, update, options, function(err, person) {
        if (err) {

            res.json({ response: 0, data: "fail", message: " Password Not Chaange" });
        } else {

            res.json({ response: 1, data: req.body, message: " Password Verify Change" });
        }
    })


})



var storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Profile1/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})


var upload2 = multer({ storage: storage2 })

router.post('/editProfile', upload1.single('profileImg'), function(req, res) {
    arr = Array();
    arr = { "name": req.body.name, "profileImg": img_name }
    console.log(img_name);
    var query = { "_id": req.body.user_id };
    var update = { $set: { "name": req.body.name, profileImg: img_name } }
    var options = { new: true };
    User.findByIdAndUpdate(query, update, options, function(err, person) {
        if (err) {
            console.log('got an error');
        } else {
            console.log(person);
        }
        //   console.log(person);
        // at this point person is null.
    });
    res.send(arr);

});

router.post('/hes')







router.post('imgLike', upload.single('img'), function(req, res) {



})


//module.exports = router;

module.exports = router;