const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const {loadContacts, findContact, addContact} = require('./utilities/contacts')

const app = express();
const port = 3000

// pake ejs
app.set('view engine', 'ejs');

// Third-party middleware
app.use(expressLayouts);

// build-in middleware
app.use(express.static('public'));
app.use(express.urlencoded());

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

  res.render('contact', {title : 'Halaman Contact', layout : 'layouts/main-layout.ejs', contacts});
});

// Router tambah contact
// Harus ditulis sebelum route detail biar kebaca
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {title : 'Form Tambah Contact', layout : 'layouts/main-layout.ejs'});
});


// Proses Tambah data contact
app.post('/contact', (req, res) => {
  addContact(req.body);

  // kembali ke route get contact
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