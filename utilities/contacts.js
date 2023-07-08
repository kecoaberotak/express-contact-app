const fs = require("node:fs");

// check directory dan membuat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// check dan membuat file contact.json
const filePath = "./data/contact.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// ambil data dari file JSON
const loadContacts = () => {
  const fileBuffer = fs.readFileSync("./data/contact.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// cari kontak
const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find(contact => contact.nama === nama);
  return contact
};

module.exports = { loadContacts, findContact };