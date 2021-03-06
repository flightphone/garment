var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')
var multer = require('multer');
var upload = multer();


var port = process.env.PORT || 4000;


const { Pool, Client } = require('pg');


var pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.POSTGRES_DB || 'uflights',
  password: process.env.POSTGRES_PASSWORD || 'aA12345678',
  port: process.env.PGPORT || 5432,
});

var SessA = new Map();

var pgadmin = require('./pgutils');
pgadmin.setDB(pool);
pgadmin.setSess(SessA);

var ustore = require('./ustore');
ustore.setDB(pool);
ustore.setSess(SessA);

/*
var print = require('./print');
print.setDB(pool);
*/


app.set('views', './views');
app.set('view engine', 'ejs');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret session id',
    saveUninitialized: true
  })
)





app.use(express.static('dist'));


app.post('/pg/gettables', pgadmin.gettables);
app.post('/pg/runsql', upload.fields([]), pgadmin.runSQL);
app.get('/pg/getid/:table_name', pgadmin.getid);
app.post('/pg/dump', upload.fields([]), pgadmin.dump);







app.get('/pg/proc/:table_name', pgadmin.proc);
app.post('/pg/csv', upload.fields([]), pgadmin.csvimport);


app.post('/ustore/gettree', ustore.gettree);
app.get('/ustore/tree.css', ustore.treecss)

app.get('/sesid', function (req, res) {
  res.send(req.sessionID);
});



app.listen(port, function () {
  console.log('Example app listening on port ' + port.toString());
});

// Launch the demo in the browser
const opn = require("opn");
opn("http://localhost:" + port);



