const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {loadContacts, findContact, addContact, cekDuplikat, deleteContact} = require('./utilities/contacts');
const {body, validationResult, check} = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000

// pake ejs
app.set('view engine', 'ejs');

// Third-party middleware
app.use(expressLayouts);

// build-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: {maxAge:  6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Route root / halaman Home
app.get('/', (req, res) => {
  const member = [
    {
      nama : 'Bruce',
      email : 'bruce@gmail.com'
    },
    {
      nama : 'Dick',
      email : 'dick@gmail.com'
    },
    {
      nama : 'Damian',
      email : 'damian@gmail.com'
    },
  ];

  res.render('index', {
    nama : 'John Doe',
    title : 'Halaman Utama',
    member : member,
    layout : 'layouts/main-layout.ejs'});
});

// Route Halaman About
app.get('/about', (req, res) => {
  res.render('about', {title : 'Halaman About', layout : 'layouts/main-layout.ejs'});
});

// Route Halaman Contact
app.get('/contact', (req, res) => {
  const contacts = loadContacts();

  res.render('contact', 
  {
    title : 'Halaman Contact', 
    layout : 'layouts/main-layout.ejs', 
    contacts, 
    msg : req.flash('msg')});
});

// Router tambah contact
// Harus ditulis sebelum route detail biar kebaca
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {title : 'Form Tambah Contact', layout : 'layouts/main-layout.ejs'});
});


// Proses Tambah data contact
// Kalo mau custom pesannya, pake check bukan body
app.post('/contact', 
[
  body('nama').custom(value => {
    const duplikat = cekDuplikat(value);
    if(duplikat){
      throw new Error('Nama sudah ada');
    }
    return true;
  }),
  check('email', 'Email Tidak Valid').isEmail(), 
  check('nomorHp', 'Nomor HP Tidak Valid').isMobilePhone('id-ID')
] ,(req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // ini defaultnya
    // return res.status(400).json({errors: errors.array()});

    res.render('add-contact', 
    {
      title   : 'Form Tambah Contact', 
      layout  : 'layouts/main-layout.ejs',
      errors  : errors.array()
    });
  } else {
    addContact(req.body);

    // kirim flash message
    req.flash('msg', 'Data berhasil ditambahkan');

    // kembali ke route get contact
    res.redirect('/contact');
  };
});

// proses hapus contact
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  if(!contact){
    res.status(404);
    res.send('<h1>404</h1>');
  }else deleteContact(req.params.nama);

  req.flash('msg', 'Data berhasil dihapus');
  res.redirect('/contact');
});


// Route Detail Contact
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('detail', {title : 'Halaman Detail Contact', layout : 'layouts/main-layout.ejs', contact});
});


// Route kalo halaman ga ada
app.use('/', (req, res) => {
  res.status(404)
  res.send(`<h1>Error : 404 Halaman Tidak Ada.</h1>`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})