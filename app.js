var http = require('http');
var fs = require('fs');
var url = require('url');
var fileName = 'home.html';
var stream = fs.createWriteStream(fileName);
var mysql = require('mysql');
var formidable = require('formidable');
var util = require('util');
var nodemailer = require('nodemailer');
var mime = require('mime');
var path = require('path');
var attempts = 0;
var header = "";
var body = "";

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

function buildHeader() {
  header = '<style>.title {position: absolute;top: -20px;left: 110px;font-family: "Comic sans ms";font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 150px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}';
  body = '<a href="home.html"><img class="icon" src="icon.png"></a><h1 class="title">Beibei</h1><ul><li><a href="home.html">Home</a></li><li><a href="about">About us</a></li><li><a href="contact">Contact</a></li><li><a href="buildRegister">Register</a></li></ul>';
}

function loginHeader(username) {
  header = '<style>.title {position: absolute;top: -20px;left: 110px;font-family: "Comic sans ms";font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}';
  body = '<a href="home' + username + '.html"><img class="icon" src="icon.png"></a><h1 class="title">Beibei</h1><ul><li><a href="home' + username + '.html">Home</a></li><li><a href="about' + username + '.html">About us</a></li><li><a href="contact' + username + '.html">Contact</a></li></ul>';
}

buildHtml("", function(err, result) {
  buildHeader();
  body += '<form class="login" action="http://127.0.0.1:8080/login" method="post" enctype="multipart/form-data">Email:<input type="text" name="email" />&nbsp; Password:<input type="text" name="password" /> &nbsp; <input type="submit" value="Log in" /></form><a class="forgot" href="forgot.html"><p>Forgot password</p></a>';
  header += '.forgot{position: absolute;top: 80px;left: 1360px;}.data {position: absolute;top: 1500px;}th {background-color: #834200;color: #ffffff;padding-top: 10px;padding-bottom: 10px;font-size: 20px;}.slideshow {position: absolute;top: 500px;}.slide {display: none;}.news {position: absolute;top: 300px;}.prev {position: absolute;top: 50%;}.next {position: absolute;top: 50%;right: 0;}.prev:hover, .next:hover {background-color: rgba(0,0,0,0.8);}.blog {position: absolute;top: 1500px;left: 1250px;width: 290px;border: 1px solid black;padding: 10px;}img {width: 1000px;}.icon {width: 100px;position: absolute;}.menu {position: absolute; top: 200px;}.catalog {position: absolute;top: 300px;left: 1250px;overflow: scroll;  width: 300px;height: 800px;}.ourproducts {color: white;background-color: #834200;position: absolute;top: 210px;left: 1250px;padding-left: 70px;padding-right: 70px;padding-top: 10px;padding-bottom: 10px;font-size: 30px;}.dogblog {position: absolute;top: 1400px;left: 1250px;color: white;background-color: #834200;font-size: 30px;padding-left: 45px;padding-right: 45px;padding-top: 10px;padding-bottom: 10px;}.product {width: 200px;transform: rotate(90deg);}</style><script src="slide.js"></script><script src="reload.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
  var data = "<table class='data'><tr><th style='padding-left: 20px;padding-right: 20px;'>Owner</th><th style='padding-left: 20px;padding-right: 20px;'>Name</th><th style='padding-left: 10px;padding-right: 10px;'>Age</th><th style='padding-left: 20px;padding-right: 20px;'>Breed</th><th style='padding-left: 10px;padding-right: 10px;'>Color</th><th style='padding-left: 80px;padding-right: 80px;'>Address</th><th style='padding-left: 10px;padding-right: 10px;'>City</th><th style='padding-left: 10px;padding-right: 10px;'>State</th><th style='padding-left: 60px;padding-right: 60px;'>Email</th></tr>";
  var slideshow = "<div class='slideshow'>";
  for (var i = 0; i < result.length; i++) {
    data += "<tr><td>" + result[i].owner + "</td><td>" + result[i].name + "</td><td>" + result[i].age + "</td><td>" + result[i].breed + "</td><td>" + result[i].color + "</td><td>" + result[i].address + "</td><td>" + result[i].city + "</td><td>" + result[i].state + "</td><td>" + result[i].email + "</tr>";
    slideshow += "<div class='slide'><img src='" + result[i].image + "'></div>";
  };
  data += "</table>";
  slideshow += "<a class='prev' onclick='prevSlide()'>&#10094;</a><a class='next' onclick='nextSlide()'>&#10095;</a></div>";
  news("", header, data, slideshow, body, function(err, result) {
    body += "<div class='news'><p>" +  result[result.length - 1].msg + "</p></div>";
  blogs("", header, data, slideshow, body, function(err, result) {
    body += "<p class='dogblog'>Dog Owner Blogs</p><div class='blog'><p>" + result[result.length - 1].msg + "</p><p>" + result[result.length - 1].owner + "</p><p>" + result[result.length - 1].date + "</p><p>**************************</p><p>" + result[result.length - 2].msg + "</p><p>" + result[result.length - 2].owner + "</p><p>" + result[result.length - 2].date + "</p><p>**************************</p></div>";
  stock("", header, data, slideshow, body, function(err, result) {
    body += "<p class='ourproducts'>Our Products</p><div class='catalog'>";
    for (var i = 0; i < result.length; i++) {
    body += "<p><img class='product' src='" + result[i].image + "'></p><p>" + result[i].name + "</p><p>$" + result[i].price + "</p><p>Available: " + result[i].stock + "</p>";  
    };
    body += "</div>";
    var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + slideshow + data + '</body></html>';
  fs.writeFile('home.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  });
});
});

});
});

function buildAbout(cb) {
  buildHeader();
  header += '.about {position: absolute;top: 300px;}</style>'
  body += '<h1 class="about">This is a website where dog owners can upload information about their dogs.</h1>'

  var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  fs.writeFile('about.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, 'callback');
  });
}

function buildContact(cb) {
  buildHeader();
  header += '.email {position: absolute;top: 300px;}</style>';
  body += '<div class="email"><a href="mailto:bensng@gmail.com?cc=bensng@gmail.com">Send email to dog owners</a><br><a href="mailto:bowenng2@gmail.com">Send email to website admin</a></div>';
  var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  fs.writeFile('contact.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, 'callback');
  });
}

function buildRegister(cb) {
  buildHeader();
  header += 'form {position: absolute;top: 300px;}</style>';
  body += '<form action="http://127.0.0.1:8080/register" method="post">Owner:<br><input type="text" id="owner" name="owner" /><br>Name:<br><input type="text" id="name" name="name" /><br>Age:<br><input type="text" id="age" name="age" /><br>Breed:<br><input type="text" id="breed" name="breed" /><br>Color:<br><input type="text" id="color" name="color" /><br>Address:<br><input type="text" id="address" name="address" /><br>City:<br><input type="text" id="city" name="city" /><br>State:<br><input type="text" id="state" name="state" /><br>Email:<br><input type="text" id="email" name="email" /><br>Password: <br><input type="text" id="password" name="password" /><br><input type="submit" value="Register" /></form>';
 var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  fs.writeFile('register.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, 'callback');
  });
}

function loginAbout(username, name) {
  var header = '<style>.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.title {position: absolute;top: -20px;left: 110px;font-family: "Comic sans ms";font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}';
  var body = '<a href="home' + username + '.html"><img class="icon" src="icon.png"></a><h1 class="title">Beibei</h1><ul><li><a href="home' + username + '.html">Home</a></li><li><a href="about' + username + '.html">About us</a></li><li><a href="contact' + username + '.html">Contact</a></li></ul>';
  header += '.about {position: absolute;top: 300px;}</style>'
  body += '<h1 class="about">This is a website where dog owners can upload information about their dogs.</h1>'
  body += '<a href="cart' + username + '.html"><img class="cart" src="cart.png"></a><p class="account">Welcome, ' + name + '</p><a href="profile' + username + '.html"><img class="avatar" src="dog.png"></a><form class="logout" action="logout" method="post" enctype="multipart/form-data"><input type="submit" value="Log out" /></form>';
  var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  fs.writeFile('about' + username + '.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  });
}

function loginContact(username, name) {
  var header = '<style>.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.title {position: absolute;top: -20px;left: 110px;font-family: "Comic sans ms";font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}';
  var body = '<a href="home' + username + '.html"><img class="icon" src="icon.png"></a><h1 class="title">Beibei</h1><ul><li><a href="home' + username + '.html">Home</a></li><li><a href="about' + username + '.html">About us</a></li><li><a href="contact' + username + '.html">Contact</a></li></ul>';
  header += '.email {position: absolute;top: 300px;}</style>';
  body += '<div class="email"><a href="mailto:bensng@gmail.com?cc=bensng@gmail.com">Send email to dog owners</a><br><a href="mailto:bowenng2@gmail.com">Send email to website admin</a></div>';
  body += '<a href="cart' + username + '.html"><img class="cart" src="cart.png"></a><p class="account">Welcome, ' + name + '</p><a href="profile' + username + '.html"><img class="avatar" src="dog.png"></a><form class="logout" action="logout" method="post" enctype="multipart/form-data"><input type="submit" value="Log out" /></form>';
  var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  fs.writeFile('contact' + username + '.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  });
}

/*
email(function(err, result) {
    var recipient = result[1].email;
for (var i = 2; i < result.length; i++) {
    recipient += ',' + result[i].email;
}

var header = '<style></style>';
  var body = '<a href="mailto:' + result[0].email + '?cc=' + recipient + '">Send email to dog owners</a><br><a href="mailto:bowenng2@gmail.com">Send email to website admin</a>' 
  var html = '<!DOCTYPE html>'
       + '<html><header>' + header + '</header><body>' + body + '</body></html>';

fs.writeFile('contact.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

});
*/

http.createServer(function (req, res) {
  if (req.url == '/about') {
    buildAbout(function(err, result) {
            var filename = "./about.html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
  }
  if (req.url == '/contact') {
    buildContact(function(err, result) {
      var filename = "./contact.html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
  }
  if (req.url == '/buildRegister') {
        buildRegister(function(err, result) {
      var filename = "./register.html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
  }
  if (req.url == '/register') {
    register(req, res);
  }
  if (req.url == '/update') {
    update(req);
    return res.end("Updated"); 
  }
  if (req.url == '/deletes') {
    deletes(req);
    return res.end("Deleted");
  }
  if (req.url == '/upload') {
    upload(req);
    return res.end("Uploaded");
  }
  if (req.url == '/admin') {
    admin(req);
    return res.end("Submitted");
  }
  if (req.url == '/blog') {
    blog(req);
    return res.end("Submitted");
  }
  if (req.url == '/catalog') {
    catalog(req);
    return res.end("Uploaded");
  }
  if (req.url == '/deleteCatalog') {
    deleteCatalog(req);
    return res.end("Deleted");
  }
  if (req.url == '/deleteCart') {
    deleteCart(req, function(err, result) {
      var filename = "./cart" + result + ".html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
  }
  if (req.url == '/home.html') {
    if (fs.existsSync('./home1.html')) {
    fs.unlink('home1.html');
  }
  }
  if (req.url == '/login') {
    login(req, res, function(err, result) {
  var filename = "./home" + result + ".html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
    
}
if (req.url == '/logout') {
   var sql = "UPDATE DogTables SET loginStatus = 'o' WHERE email = '" + username + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
  var d = new Date();
        var sql = "UPDATE DogTables SET lastLogoutDate = '" + d + "' WHERE email = '" + username + "'";
        con.query(sql, function (err, result) {
         if (err) throw err;
  });
    var filename = "./home.html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    
}
  if (req.url == '/buy') {
    buy(req, res, function(err, result) {
      var resul = result;
      buildCart(resul, function(err, result) {
 var bod = "<div class='carts'><p>Your cart</p>";
    for (i = 0; i < result.length; i++) {
      bod += "<p>" + result[i].name + ": " + result[i].quantity + "</p><form action='http://127.0.0.1:8080/deleteCart' method='post' enctype='multipart/form-data'><input type='text' class='radio' name='product' value='" + result[i].name + "' checked /><br><input type='text' class='radio' name='username' value='" + result[i].email + "' checked /><input type='submit' value='Remove'/></form>";
    }
    var results = result;
    prices(resul, results, bod, function(err, result) {
    var price = 0;
    for (i = 0; i < results.length; i++) {
      for (j = 0; j < result.length; j++) {
        if (results[i].name == result[j].name) {
          price += result[j].price * results[i].quantity;
        } 
      }
    }
    bod += "<p>$" + price + "</p><br><form action='http://127.0.0.1:8080/checkout' method='post' enctype='multipart/form-data'><input type='submit' value='Checkout'/></form></div>"
    CartHeader(resul, bod, function(err, result) {

    var head = "<style>.radio {display: none;}.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}.carts {position: absolute; top: 300px;}h1 {position: absolute;top: -20px;left: 110px;font-family: 'Comic sans ms';font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 145px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}</style>"
    bod += "<a href='profile.html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><a href='cart.html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><img class='icon' src='icon.png'><h1>Beibei</h1><ul><li><a href='about.html'>About us</a></li><li><a href='contact.html'>Contact</a></li><li><a href='register.html'>Register</a></li><li><a href='admin.html'>Admin</a></li></ul>"
    var html = '<!DOCTYPE html>' + '<html><header>' + head + '</header><body>' + bod + '</body></html>';
    console.log(result[0].owner);
  fs.writeFile('cart' + resul + '.html', html, function (err) {
  if (err) throw err;
  });
  });    
  });
});
    });
  }
  if (req.url == '/empty') {
      empty(username, req, res, function(err, result) {
  var filename = "./cart.html";
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });

  }
  if (req.url == '/email') {
  emails(req, res, function(err, result) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {  
  var transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'bowenng@hotmail.com',
    pass: 'mydt6pm4z2'
  }
  });

  var password = "";
  for (i = 0; i < result.length; i++) {
    if (result[i].email == fields.email) {
      password = result[i].password;
    }
  }

  var mailOptions = {
  from: 'bowenng@hotmail.com',
  to: fields.email,
  subject: 'Your password',
  text: password
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }

});
});  
});
  }
  if (req.url == '/checkout') {
    checkout(req, res, function(err, result) {
      for (i = 0; i < result.length; i++) {
        if (result[i].email == username) {
          var quantity1 = result[i].quantity;
          var name1 = result[i].name;
          catalogue(req, res, quantity1, name1, function(err, result) {
            for (i = 0; i < result.length; i++) {
              if (result[i].name == name1) {
                var quan = result[i].stock;
              }
            }
                empty(req, res, function(err, result) {
      var filename = "./cart.html";
      if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
    });
            var sql = "UPDATE Catalogs SET stock = '" + (quan - quantity1) + "' WHERE name = '" + name1 + "'";
            con.query(sql, function (err, result) {
            if (err) throw err;
            });
          });
        };
      };
    });
  }
  if (req.url == '/change') {
    change(req, function(err, result, fields) {
    if (fields.old == result[0].password) {
    if (fields.new == fields.new1) {
    var sql = "UPDATE DogTables SET password = '" + fields.new + "' WHERE email = '" + fields.email + "'";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Changed");
    });
  }
}
});
  }
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if (fs.existsSync(filename)) {
        var fileExtension = path.extname(filename);
        var mimeType = mime.getType(fileExtension);
        res.writeHead(200, {"Content-Type": mimeType});
        var data = fs.readFileSync(filename);
        res.end(data);
  }
}).listen(8080);

function deleteCart(req, cb) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "DELETE FROM Carts WHERE name = '" +  fields.product  + "' AND email = '" + fields.username + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  var username = fields.username;
   buildCart(username, function(err, result) {
 var bod = "<div class='carts'><p>Your cart</p>";
    for (i = 0; i < result.length; i++) {
      bod += "<p>" + result[i].name + ": " + result[i].quantity + "</p><form action='http://127.0.0.1:8080/deleteCart' method='post' enctype='multipart/form-data'><input type='radio' class='radio' name='product' value='" + result[i].name + "' checked /><br><input type='submit' value='Remove'/></form>";
    }
    var results = result;
    var user = username;
    prices(user, results, bod, function(err, result) {
    var price = 0;
    for (i = 0; i < results.length; i++) {
      for (j = 0; j < result.length; j++) {
        if (results[i].name == result[j].name) {
          price += result[j].price * results[i].quantity;
        } 
      }
    }
    var email = user;
    bod += "<p>$" + price + "</p><br><form action='http://127.0.0.1:8080/checkout' method='post' enctype='multipart/form-data'><input type='submit' value='Checkout'/></form></div>"
    CartHeader(email, bod, function(err, result) {
    var head = "<style>.radio {display: none;}.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}.carts {position: absolute; top: 300px;}h1 {position: absolute;top: -20px;left: 110px;font-family: 'Comic sans ms';font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 145px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}</style>"
    bod += "<a href='profile" + email + ".html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><a href='cart" + email + ".html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><a href='home" + email + ".html'><img class='icon' src='icon.png'></a><h1>Beibei</h1><ul><li><a href='home" + email + ".html'>Home</a></li><li><a href='about" + email + ".html'>About us</a></li><li><a href='contact" + email + ".html'>Contact</a></li><li><a href='register" + email + ".html'>Register</a></li></ul>"
    var html = '<!DOCTYPE html>' + '<html><header>' + head + '</header><body>' + bod + '</body></html>';
  fs.writeFile('cart' + email + '.html', html, function (err) {
  if (err) throw err;
  cb(null, email);
  });
  });    
  });
});      
  });
}

function change(req, cb) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  con.query("SELECT * FROM DogTables WHERE email = '" + fields.email + "'", function(err, result) {
  cb(null, result, fields);
  });
});
}

function emails(req, res, cb) {
  con.query("SELECT * FROM DogTables", function (err, result, fields) {
  cb(null, result);
  });
};

function empty(username, req, res, cb) {
  var sql = "DELETE FROM Carts WHERE email = '" + username + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
   var bod = "";
    CartHeader(bod, function(err, result) {
    var head = "<style>.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}.carts {position: absolute; top: 300px;}h1 {position: absolute;top: -20px;left: 110px;font-family: 'Comic sans ms';font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 145px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}</style>"
    bod += "<a href='profile.html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><a href='cart.html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><div class='carts'><p>Your cart is empty</p><p>$0</p></div><img class='icon' src='icon.png'><h1>Beibei</h1><ul><li><a href='about.html'>About us</a></li><li><a href='contact.html'>Contact</a></li><li><a href='register.html'>Register</a></li><li><a href='admin.html'>Admin</a></li></ul>"
    var html = '<!DOCTYPE html>' + '<html><header>' + head + '</header><body>' + bod + '</body></html>';
  fs.writeFile('cart.html', html, function (err) {
  if (err) throw err;
  cb(null, result);
  });
});
};

function catalogue(req, res, quantity1, name1, cb) {
  con.query("SELECT * FROM Catalogs", function (err, result, fields) {
  cb(null, result);
  });
};

function checkout(req, res, cb) {
  con.query("SELECT * FROM Carts", function (err, result, fields) {
  cb(null, result);
  });
};

function buy(req, res, cb) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "INSERT INTO Carts (email, name, quantity) VALUES ('" + fields.username + "', '" + fields.product + "', '" + fields.quantity + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    cb(null, fields.username);
    console.log("1 record inserted");
  });
  });
}

function login(req, res, cb) {
   if (attempts > 2) {
buildHtml("", function(err, result) {
  buildHeader(result);
  header += '.data {position: absolute;top: 1500px;}th {background-color: #834200;color: #ffffff;padding-top: 10px;padding-bottom: 10px;font-size: 20px;}.slideshow {position: absolute;top: 500px;}.slide {display: none;}.news {position: absolute;top: 300px;}.prev {position: absolute;top: 50%;}.next {position: absolute;top: 50%;right: 0;}.prev:hover, .next:hover {background-color: rgba(0,0,0,0.8);}.blog {position: absolute;top: 1500px;left: 1250px;width: 290px;border: 1px solid black;padding: 10px;}img {width: 1000px;}.icon {width: 100px;position: absolute;}.menu {position: absolute; top: 200px;}.catalog {position: absolute;top: 300px;left: 1250px;overflow: scroll;width: 300px;height: 800px;}.ourproducts {color: white;background-color: #834200;position: absolute;top: 210px;left: 1250px;padding-left: 70px;padding-right: 70px;padding-top: 10px;padding-bottom: 10px;font-size: 30px;}.dogblog {position: absolute;top: 1400px;left: 1250px;color: white;background-color: #834200;font-size: 30px;padding-left: 45px;padding-right: 45px;padding-top: 10px;padding-bottom: 10px;}.product {width: 200px;transform: rotate(90deg);}.wrong {position: absolute; top: 80px;left: 1400px;}</style><script src="slide.js"></script>';
  body += '<form class="login" action="http://127.0.0.1:8080/login" method="post" enctype="multipart/form-data">Email:<input type="text" name="email" />&nbsp; Password:<input type="text" name="password" /> &nbsp; <input type="submit" value="Log in" /></form>';
  var data = "<table class='data'><tr><th style='padding-left: 20px;padding-right: 20px;'>Owner</th><th style='padding-left: 20px;padding-right: 20px;'>Name</th><th style='padding-left: 10px;padding-right: 10px;'>Age</th><th style='padding-left: 20px;padding-right: 20px;'>Breed</th><th style='padding-left: 10px;padding-right: 10px;'>Color</th><th style='padding-left: 80px;padding-right: 80px;'>Address</th><th style='padding-left: 10px;padding-right: 10px;'>City</th><th style='padding-left: 10px;padding-right: 10px;'>State</th><th style='padding-left: 60px;padding-right: 60px;'>Email</th></tr>";
  var slideshow = "<div class='slideshow'>";
  for (var i = 0; i < result.length; i++) {
    data += "<tr><td>" + result[i].owner + "</td><td>" + result[i].name + "</td><td>" + result[i].age + "</td><td>" + result[i].breed + "</td><td>" + result[i].color + "</td><td>" + result[i].address + "</td><td>" + result[i].city + "</td><td>" + result[i].state + "</td><td>" + result[i].email + "</tr>";
    slideshow += "<div class='slide'><img src='" + result[i].image + "'></div>";
  };
  data += "</table>";
  slideshow += "<a class='prev' onclick='prevSlide()'>&#10094;</a><a class='next' onclick='nextSlide()'>&#10095;</a></div>";
  body += '<p class = "wrong">Maximum login attempts exceeded</p>';
  news("", header, data, slideshow, body, function(err, result) {
    body += "<div class='news'><p>" +  result[result.length - 1].msg + "</p></div>";
  blogs("", header, data, slideshow, body, function(err, result) {
    body += "<p class='dogblog'>Dog Owner Blogs</p><div class='blog'><p>" + result[result.length - 1].msg + "</p><p>" + result[result.length - 1].owner + "</p><p>" + result[result.length - 1].date + "</p><p>**************************</p><p>" + result[result.length - 2].msg + "</p><p>" + result[result.length - 2].owner + "</p><p>" + result[result.length - 2].date + "</p><p>**************************</p></div>";
  stock("", header, data, slideshow, body, function(err, result) {
    body += "<p class='ourproducts'>Our Products</p><div class='catalog'>";
    for (var i = 0; i < result.length; i++) {
    body += "<p><img class='product' src='" + result[i].image + "'></p><p>" + result[i].name + "</p><p>$" + result[i].price + "</p><p>Available: " + result[i].stock + "</p>";  
    };
    body += "</div>";
    var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + slideshow + data + '</body></html>';
  fs.writeFile('home1.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, "callback");
  });
});
});

});  

});
  } else {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    con.query("SELECT * FROM DogTables WHERE email = '" + fields.email + "'", function (err, result) {
      if(err) throw err;
      if (result[0].password == fields.password) {
        var username = fields.email;
         
buildHtml(username, function(err, result) {
  loginHeader(username);

  header += '.radio {display: none;}.data {position: absolute;top: 1500px;}th {background-color: #834200;color: #ffffff;padding-top: 10px;padding-bottom: 10px;font-size: 20px;}.slideshow {position: absolute;top: 500px;}.slide {display: none;}.news {position: absolute;top: 300px;}.prev {position: absolute;top: 50%;}.next {position: absolute;top: 50%;right: 0;}.prev:hover, .next:hover {background-color: rgba(0,0,0,0.8);}.blog {position: absolute;top: 1500px;left: 1250px;width: 290px;border: 1px solid black;padding: 10px;}img {width: 1000px;}.icon {width: 100px;position: absolute;}.menu {position: absolute; top: 200px;}.catalog {position: absolute;top: 300px;left: 1250px;overflow: scroll;width: 300px;height: 800px;}.ourproducts {color: white;background-color: #834200;position: absolute;top: 210px;left: 1250px;padding-left: 70px;padding-right: 70px;padding-top: 10px;padding-bottom: 10px;font-size: 30px;}.dogblog {position: absolute;top: 1400px;left: 1250px;color: white;background-color: #834200;font-size: 30px;padding-left: 45px;padding-right: 45px;padding-top: 10px;padding-bottom: 10px;}.product {width: 200px;transform: rotate(90deg);}.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 50px;left: 1200px;}</style><script src="slide.js"></script>';
  var data = "<table class='data'><tr><th style='padding-left: 20px;padding-right: 20px;'>Owner</th><th style='padding-left: 20px;padding-right: 20px;'>Name</th><th style='padding-left: 10px;padding-right: 10px;'>Age</th><th style='padding-left: 20px;padding-right: 20px;'>Breed</th><th style='padding-left: 10px;padding-right: 10px;'>Color</th><th style='padding-left: 80px;padding-right: 80px;'>Address</th><th style='padding-left: 10px;padding-right: 10px;'>City</th><th style='padding-left: 10px;padding-right: 10px;'>State</th><th style='padding-left: 60px;padding-right: 60px;'>Email</th></tr>";
  var slideshow = "<div class='slideshow'>";

  for (var i = 0; i < result.length; i++) {
    data += "<tr><td>" + result[i].owner + "</td><td>" + result[i].name + "</td><td>" + result[i].age + "</td><td>" + result[i].breed + "</td><td>" + result[i].color + "</td><td>" + result[i].address + "</td><td>" + result[i].city + "</td><td>" + result[i].state + "</td><td>" + result[i].email + "</tr>";
    slideshow += "<div class='slide'><img src='" + result[i].image + "'></div>";
    if (result[i].email == username) {
      var name = result[i].owner;
    }
  };
  loginAbout(username, name);
  loginContact(username, name);
  data += "</table>";
  slideshow += "<a class='prev' onclick='prevSlide()'>&#10094;</a><a class='next' onclick='nextSlide()'>&#10095;</a></div>";
  body += '<a href="cart' + username + '.html"><img class="cart" src="cart.png"></a><p class="account">Welcome, ' + name + '</p><a href="profile' + username + '.html"><img class="avatar" src="dog.png"></a><form class="logout" action="logout" method="post" enctype="multipart/form-data"><input type="submit" value="Log out" /></form>';
  news(username, header, data, slideshow, body, function(err, result) {
    body += "<div class='news'><p>" +  result[result.length - 1].msg + "</p></div>";
  blogs(username, header, data, slideshow, body, function(err, result) {
    body += "<p class='dogblog'>Dog Owner Blogs</p><div class='blog'><p>" + result[result.length - 1].msg + "</p><p>" + result[result.length - 1].owner + "</p><p>" + result[result.length - 1].date + "</p><p>**************************</p><p>" + result[result.length - 2].msg + "</p><p>" + result[result.length - 2].owner + "</p><p>" + result[result.length - 2].date + "</p><p>**************************</p></div>";
  stock(username, header, data, slideshow, body, function(err, result) {
    body += "<p class='ourproducts'>Our Products</p><div class='catalog'>";
    for (var i = 0; i < result.length; i++) {
    body += "<p><img class='product' src='" + result[i].image + "'></p><p>" + result[i].name + "</p><p>$" + result[i].price + "</p><p>Available: " + result[i].stock + "</p><form action='http://127.0.0.1:8080/buy' method='post' enctype='multipart/form-data'><input type='text' class='radio' name='product' value='" + result[i].name + "' /><br><input type='text' class='radio' name='username' value='" + username + "' /><input type='text' name='quantity' /><input type='submit' value='Add to cart'/></form>";
    };
    body += "</div>";
    var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + slideshow + data + '</body></html>';
  fs.writeFile('home' + username + '.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, username);
  });
});
});

});
  

});

buildCart(username, function(err, result) {
  if (result.length == 0) {
    var bod = "";
    CartHeader(username, bod, function(err, result) {
    var head = "<style>.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}.carts {position: absolute; top: 300px;}h1 {position: absolute;top: -20px;left: 110px;font-family: 'Comic sans ms';font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}</style>"
    bod += "<a href='profile" + username + ".html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><a href='cart" + username + ".html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><div class='carts'><p>Your cart is empty</p><p>$0</p></div><a href='home" + username + ".html'><img class='icon' src='icon.png'></a><h1>Beibei</h1><ul><li><a href='home" + username + ".html'>Home</a></li><li><a href='about" + username + ".html'>About us</a></li><li><a href='contact" + username + ".html'>Contact</a></li></ul>"
    var html = '<!DOCTYPE html>' + '<html><header>' + head + '</header><body>' + bod + '</body></html>';
  fs.writeFile('cart' + username + '.html', html, function (err) {
  if (err) throw err;
  });
  });
  } else {
    var bod = "<div class='carts'><p>Your cart</p>";
    for (i = 0; i < result.length; i++) {
      bod += "<p>" + result[i].name + ": " + result[i].quantity + "</p><form action='http://127.0.0.1:8080/deleteCart' method='post' enctype='multipart/form-data'><input type='text' class='radio' name='product' value='" + result[i].name + "' /><br><input type='text' class='radio' name='username' value='" + result[i].email + "' /><br><input type='submit' value='Remove'/></form>";
    }
    var results = result;
    prices(username, results, bod, function(err, result) {
    var price = 0;
    for (i = 0; i < results.length; i++) {
      for (j = 0; j < result.length; j++) {
        if (results[i].name == result[j].name) {
          price += result[j].price * results[i].quantity;
        } 
      }
    }
    bod += "<p>$" + price + "</p><br><form action='http://127.0.0.1:8080/checkout' method='post' enctype='multipart/form-data'><input type='submit' value='Checkout'/></form></div>"
    CartHeader(username, bod, function(err, result) {
    var head = "<style>.radio {display: none;}.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}.carts {position: absolute; top: 300px;}h1 {position: absolute;top: -20px;left: 110px;font-family: 'Comic sans ms';font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}</style>"
    bod += "<a href='profile" + username + ".html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><a href='cart" + username + ".html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><a href='home" + username + ".html'><img class='icon' src='icon.png'></a><h1>Beibei</h1><ul><li><a href='home" + username + ".html'>Home</a></li><li><a href='about" + username + ".html'>About us</a></li><li><a href='contact" + username + ".html'>Contact</a></li></ul>"
       
    
    var html = '<!DOCTYPE html>' + '<html><header>' + head + '</header><body>' + bod + '</body></html>';
  fs.writeFile('cart' + username + '.html', html, function (err) {
  if (err) throw err;
  });
  });    
  });
  }
        
});

 buildProfile(username, function(err, result) {
  var h = '<style>h1 {position: absolute;top: -20px;left: 110px;font-family: "Comic sans ms";font-size: 60px;}ul {list-style-type: none;margin: 0;padding: 0;overflow: hidden;background-color: #834200;position: absolute; top: 130px;}li {float: left;}li a {display: block;color: white;text-align: center;padding: 20px 200px;text-decoration: none;font-size: 30px;}.login {position: absolute;top: 50px;left: 1100px;}.logout {position: absolute; top: 80px;left: 1500px;}';
  var b = '<a href="home' + username + '.html"><img class="icon" src="icon.png"></a><h1>Beibei</h1><ul><li><a href="home' + username + '.html">Home</a></li><li><a href="about' + username + '.html">About us</a></li><li><a href="contact' + username + '.html">Contact</a></li></ul>';
  h += '.toggle {position: absolute; top: 900px;left: 600px;}.password {display: none;position: absolute;top: 1000px;left: 600px;}.change {position: absolute;top: 500px;left: 600px;}.video {position: absolute;top: 300px;left: 1000px;}#map {position: absolute;top: 500px;height: 500px;width: 500px;}img {width: 1000px;}.temp {position: absolute; left: 1000px; top: 900px;}.minutely {position: absolute; left: 1000px; top: 1000px;}#address {position: absolute;top: 200px;}.cart {position: absolute;top: 60px;left: 1000px;width: 50px;}.avatar {position: absolute;top: 60px;left: 1100px;width: 60px;}.account {position: absolute;top: 60px;left: 1200px;}.icon {width: 100px;position: absolute;}</style>';
  b += "<button class='toggle' onclick='myFunction()''>Change password</button><form id='password' class='password' action='http://127.0.0.1:8080/change' method='post'><input type='text' name='email' value='" + result[0].email + "' /><br>Current password:<br><input type='text' name='old' /><br>New password:<br><input type='text' name='new' /><br>New password again:<br><input type='text' name='new1' /><br><input type='submit' value='Update' /><br></form><form class='change' action='http://127.0.0.1:8080/update' method='post'>Name:<br><input type='text' id='name' name='name' /><br>Age:<br><input type='text' id='age' name='age' /><br>Breed:<br><input type='text' id='breed' name='breed' /><br>Color:<br><input type='text' id='color' name='color' /><br>Address:<br><input type='text' id='address1' name='address' /><br>City:<br><input type='text' id='city' name='city' /><br>State:<br><input type='text' id='state' name='state' /><br>Email:<br><input type='text' id='email' name='email' /><br><input type='submit' value='Update' /></form><a href='cart" + username + ".html'><img class='cart' src='cart.png'></a><p class='account'>Welcome, " + result[0].owner + "</p><a href='profile" + username + ".html'><img class='avatar' src='dog.png'></a><form class='logout' action='http://127.0.0.1:8080/home.html' method='post' enctype='multipart/form-data'><input type='submit' value='Log out' /></form><img src='" + result[0].image + "'><div class='video'><video controls><source src='" + result[0].audio + "' type='video/mp4'></video><video controls><source src='" + result[0].video + "' type='video/mp4'></video></div><p id='address'>" + result[0].address + " " + result[0].city + " " + result[0].state + "</p><div id='map'></div><h2><div id='temp' class='temp'></div><div id='minutely' class='minutely'></div></h2><h2><div id='location'></div></h2><script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyCf635uOCPtspM22RTSuEaTfogel4vfZ4c&callback=initMap'></script><script src='geocoder.js'></script><script src='https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'></script><script src='toggle.js'></script>";
  var html = '<!DOCTYPE html>'
       + '<html><header>' + h + '</header><body>' + b + '</body></html>';

fs.writeFile('profile' + username + '.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
});

});
var sql = "UPDATE DogTables SET loginStatus = 'i' WHERE email = '" + username + "'";
        con.query(sql, function (err, result) {
         if (err) throw err;
        });
var d = new Date();
        var sql = "UPDATE DogTables SET lastLoginDate = '" + d + "' WHERE email = '" + username + "'";
        con.query(sql, function (err, result) {
         if (err) throw err;
        });
      } else {
  attempts++;
        buildHtml("", function(err, result) {
  buildHeader(result);
  header += '.forgot{position: absolute;top: 80px;left: 1360px;}.data {position: absolute;top: 1500px;}th {background-color: #834200;color: #ffffff;padding-top: 10px;padding-bottom: 10px;font-size: 20px;}.slideshow {position: absolute;top: 500px;}.slide {display: none;}.news {position: absolute;top: 300px;}.prev {position: absolute;top: 50%;}.next {position: absolute;top: 50%;right: 0;}.prev:hover, .next:hover {background-color: rgba(0,0,0,0.8);}.blog {position: absolute;top: 1500px;left: 1250px;width: 290px;border: 1px solid black;padding: 10px;}img {width: 1000px;}.icon {width: 100px;position: absolute;}.menu {position: absolute; top: 200px;}.catalog {position: absolute;top: 300px;left: 1250px;overflow: scroll;width: 300px;height: 800px;}.ourproducts {color: white;background-color: #834200;position: absolute;top: 210px;left: 1250px;padding-left: 70px;padding-right: 70px;padding-top: 10px;padding-bottom: 10px;font-size: 30px;}.dogblog {position: absolute;top: 1400px;left: 1250px;color: white;background-color: #834200;font-size: 30px;padding-left: 45px;padding-right: 45px;padding-top: 10px;padding-bottom: 10px;}.product {width: 200px;transform: rotate(90deg);}.wrong {position: absolute; top: 60px;left: 1360px;}</style><script src="slide.js"></script>';
  body += '<form class="login" action="http://127.0.0.1:8080/login" method="post" enctype="multipart/form-data">Email:<input type="text" name="email" />&nbsp; Password:<input type="text" name="password" /> &nbsp; <input type="submit" value="Log in" /></form>';
  var data = "<table class='data'><tr><th style='padding-left: 20px;padding-right: 20px;'>Owner</th><th style='padding-left: 20px;padding-right: 20px;'>Name</th><th style='padding-left: 10px;padding-right: 10px;'>Age</th><th style='padding-left: 20px;padding-right: 20px;'>Breed</th><th style='padding-left: 10px;padding-right: 10px;'>Color</th><th style='padding-left: 80px;padding-right: 80px;'>Address</th><th style='padding-left: 10px;padding-right: 10px;'>City</th><th style='padding-left: 10px;padding-right: 10px;'>State</th><th style='padding-left: 60px;padding-right: 60px;'>Email</th></tr>";
  var slideshow = "<div class='slideshow'>";
  for (var i = 0; i < result.length; i++) {
    data += "<tr><td>" + result[i].owner + "</td><td>" + result[i].name + "</td><td>" + result[i].age + "</td><td>" + result[i].breed + "</td><td>" + result[i].color + "</td><td>" + result[i].address + "</td><td>" + result[i].city + "</td><td>" + result[i].state + "</td><td>" + result[i].email + "</tr>";
    slideshow += "<div class='slide'><img src='" + result[i].image + "'></div>";
  };
  data += "</table>";
  slideshow += "<a class='prev' onclick='prevSlide()'>&#10094;</a><a class='next' onclick='nextSlide()'>&#10095;</a></div>";
  body += '<a class="forgot" href="forgot.html"><p>Forgot password</p></a><p class = "wrong">Wrong password</p>';
  news("", header, data, slideshow, body, function(err, result) {
    body += "<div class='news'><p>" +  result[result.length - 1].msg + "</p></div>";
  blogs("", header, data, slideshow, body, function(err, result) {
    body += "<p class='dogblog'>Dog Owner Blogs</p><div class='blog'><p>" + result[result.length - 1].msg + "</p><p>" + result[result.length - 1].owner + "</p><p>" + result[result.length - 1].date + "</p><p>**************************</p><p>" + result[result.length - 2].msg + "</p><p>" + result[result.length - 2].owner + "</p><p>" + result[result.length - 2].date + "</p><p>**************************</p></div>";
  stock("", header, data, slideshow, body, function(err, result) {
    body += "<p class='ourproducts'>Our Products</p><div class='catalog'>";
    for (var i = 0; i < result.length; i++) {
    body += "<p><img class='product' src='" + result[i].image + "'></p><p>" + result[i].name + "</p><p>$" + result[i].price + "</p><p>Available: " + result[i].stock + "</p>";  
    };
    body += "</div>";
    var html = '<!DOCTYPE html>' + '<html><header>' + header + '</header><body>' + body + slideshow + data + '</body></html>';
  fs.writeFile('home1.html', html, function (err) {
  if (err) throw err;
  console.log('Saved!');
  cb(null, "callback");
  });
});
});

});
  

});
      }
    });



  });
   } 
};

function CartHeader(username, body, cb) {
    con.query("SELECT * FROM DogTables WHERE email = '" + username + "'", function(err, result, fields) {
    cb(null, result);
    console.log(username);
    console.log(result);
    });
}

function prices(username, results, body, cb) {
    con.query("SELECT * FROM Catalogs", function (err, result, fields) {
    cb(null, result);
    });
}

function buildCart(username, cb) {
    con.query("SELECT * FROM Carts WHERE email = '" + username + "'", function (err, result, fields) {
    cb(null, result);
    });
};

function deleteCatalog(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var sql = "DELETE FROM Catalogs WHERE name = '" + fields.name + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});
};

function catalog(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "INSERT INTO Catalogs (image, name, price, stock) VALUES ('" + files.image.name + "', '" + fields.name + "', '" + fields.price + "', '" + fields.stock + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
    var oldpath = files.image.path;
      var newpath = files.image.name;
      fs.rename(oldpath, newpath, function (err) {
      });

  });

};

function stock(username, header, data, slideshow, body, cb) {
  con.query("SELECT * FROM Catalogs", function (err, result, fields) {
    cb(null, result);
  });
};

function news(username, header, data, slideshow, body, cb) {
   con.query("SELECT * FROM News", function (err, result, fields) {
    cb(null, result);
  });
};

function blogs(username, header, data, slideshow, body, cb) {
    con.query("SELECT * FROM Blogs", function (err, result, fields) {
    cb(null, result);
  });
};

function admin(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "INSERT INTO News (msg) VALUES ('" + fields.news + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  });

};

function blog(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "INSERT INTO Blogs (owner, msg, date) VALUES ('" + fields.owner + "', '" + fields.msg + "', '" + fields.date + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  });

};

function email(cb) {
  con.query("SELECT * FROM DogTables", function (err, result, fields) {
    cb(null, result);
  });
};

function buildHtml(username, cb) {
  con.query("SELECT * FROM DogTables", function (err, result, fields) {
    cb(null, result);
  });
};

function buildProfile(username, cb) {
  con.query("SELECT * FROM DogTables WHERE email = '" + username + "'", function (err, result) {
    if (err) throw err; 
    cb(null, result);
  });
};

function register(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  if (fields.password.length < 8) {
    return res.end("Password is less than 8 characters");
  }
  else {
  var sql = "INSERT INTO DogTables (owner, name, age, breed, color, address, city, state, email, password) VALUES ('" + fields.owner + "', '" + fields.name + "', '" + fields.age + "', '" + fields.breed + "', '" + fields.color + "', '" + fields.address + "', '" + fields.city + "', '" + fields.state + "', '" + fields.email + "', '" + fields.password + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  }
 }); 

};

function update(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  var sql = "UPDATE DogTables SET name = '" + fields.name + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET age = '" + fields.age + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET breed = '" + fields.breed + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET color = '" + fields.color + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET address = '" + fields.address + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET city = '" + fields.city + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
    var sql = "UPDATE DogTables SET state = '" + fields.state + "' WHERE email = '" + fields.email + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records updated: " + result.affectedRows);
  });
});

};

function deletes(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var sql = "DELETE FROM DogTables WHERE email = '" + username + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
});

};

function upload(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var sql = "UPDATE DogTables SET image = '" + files.image.name + "'," + " audio = '" + files.audio.name + "', " + " video = '" + files.video.name + "' WHERE email = '" + username + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
  var oldpath = files.image.path;
      var newpath = files.image.name;
      fs.rename(oldpath, newpath, function (err) {
      });
    var oldpath = files.audio.path;
      var newpath = files.audio.name;
      fs.rename(oldpath, newpath, function (err) {
      });
    var oldpath = files.video.path;
      var newpath = files.video.name;
      fs.rename(oldpath, newpath, function (err) {
      });

  });

};