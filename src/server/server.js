var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var path = require('path');

const port = 4200

var posts = path.join(__dirname + '/static', 'data.json');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/categories', (req, res) => {
  console.log(req.query);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "categories": [
      {
        "id": 0,
        "name": "All"
      },
      {
        "id": 1,
        "name": "Animals"
      },
      {
        "id": 2,
        "name": "Cities"
      },
      {
        "id": 3,
        "name": "Landscapes"
      }
    ]
  }));
})

app.get('/posts', (req, res) => {
  console.log(req.query);
  res.setHeader('Content-Type', 'application/json');
  //var readable = fs.createReadStream(posts);
  //readable.pipe(res);  
  setTimeout(function () {
    res.end(JSON.stringify({
      "posts": [
        {
          "id": 1,
          "type": "video",
          "index": 1,
          "category": "landscapes",
          "title": "Richard Nolan",
          "src": "https://images.unsplash.com/photo-1478033394151-c931d5a4bdd6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&s=3c74d594a86e26c5a319f4e17b36146e",
          "ts": 1554286531
        },
        {
          "id": 2,
          "type": "audio",
          "index": 2,
          "category": "animals",
          "title": "Wexor Tmg",
          "src": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&s=11ff283143c782980861a442a957da8e",
          "ts": 1554200131
        },
        {
          "id": 3,
          "type": "image",
          "index": 3,
          "category": "cities",
          "title": "Denys Nevozhai",
          "src": "https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&s=ea06c0f0700ec469fdcb32e0d4c2928e",
          "ts": 1554113731
        },
        {
          "id": 4,
          "type": "video",
          "index": 4,
          "category": "animals",
          "title": "Sticker Mule",
          "src": "https://images.unsplash.com/photo-1484244233201-29892afe6a2c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&s=14d236624576109b51e85bd5d7ebfbfc",
          "ts": 1553076931
        },
        {
          "id": 5,
          "type": "audio",
          "index": 5,
          "category": "cities",
          "title": "Roman Logov",
          "src": "https://images.unsplash.com/photo-1465414829459-d228b58caf6e?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&s=7a7080fc0699869b1921cb1e7047c5b3",
          "ts": 1552644931
        }
      ],
      "ts": Date.now()
    }));
  }, 1000);
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
