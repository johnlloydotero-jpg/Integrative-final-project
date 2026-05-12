const fs = require("fs");

const filePath = "./db.json";

function getUsers() {
  const data = JSON.parse(fs.readFileSync(filePath));
  return data.users || [];
}

function addUser(user) {
  const data = JSON.parse(fs.readFileSync(filePath));

  user.id = Date.now().toString();

  data.users.push(user);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return user;
}

module.exports = { getUsers, addUser };

