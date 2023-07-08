const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000

// pake ejs
app.set('view engine', 'ejs');

// Third-party middleware
app.use(expressLayouts);

// build-in middleware
app.use(express.static('public'));


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
})

app.get('/about', (req, res) => {
  res.render('about', {title : 'Halaman About', layout : 'layouts/main-layout.ejs'});
})

app.get('/contact', (req, res) => {
  res.render('contact', {title : 'Halaman Contact', layout : 'layouts/main-layout.ejs'});
})


// kalo halaman ga ada
app.use('/', (req, res) => {
  res.status(404)
  res.send(`<h1>Error : 404 Halaman Tidak Ada.</h1>`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})