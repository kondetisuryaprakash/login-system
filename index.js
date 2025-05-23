const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const usersFile = path.join(__dirname, 'users.json');

// REGISTER endpoint
app.post('/register', (req, res) => {
  const { fullname, phone, email, password } = req.body;
  let users = [];

  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).send('User already exists');

  users.push({ fullname, phone, email, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send('Registration successful');
});

// LOGIN endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!fs.existsSync(usersFile)) return res.status(400).send('No users registered');

  const users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

