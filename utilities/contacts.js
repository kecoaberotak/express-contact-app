const fs = require("node:fs");

// check directory dan membuat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// check dan membuat file contact.json
const filePath = "./data/contacts.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// ambil data dari file JSON
const loadContacts = () => {
  const fileBuffer = fs.readFileSync("./data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// cari kontak
const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find(contact => contact.nama === nama);
  return contact
};

// menimpa file contacts.json dengan data baru
const saveContacts = contacts => fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));

// menambahkan data contact
const addContact = contact => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

// Cek Duplikat Nama
const cekDuplikat = nama => {
  const contacts = loadContacts();
  return contacts.find(contact => contact.nama.toLowerCase() === nama.toLowerCase());
};

// Delete Contact
const deleteContact = nama => {
  const contacts = loadContacts();
  const contactsFilter = contacts.filter(contact => contact.nama != nama);
  saveContacts(contactsFilter);
};

// Edit / update contact
const updateContact = contactBaru => {
  const contacts = loadContacts();

  // hilangkan kontak lama 
  const contactsFilter = contacts.filter(contact => contact.nama != contactBaru.oldNama);
  
  // hapus properti old nama
  delete contactBaru.oldNama;

  // masukin ke json
  contactsFilter.push(contactBaru);
  saveContacts(contactsFilter);

};

module.exports = { loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContact };