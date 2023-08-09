const db = require('../database/db');

const createUser = (userData, callback) => {
  const { username, email, password, full_name, age, gender } = userData;

  db.run(
    'INSERT INTO users (username, email, password, full_name, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password, full_name, age, gender],
    function (err) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      
      return callback(null, {
        user_id: this.lastID,
        username,
        email,
        full_name,
        age,
        gender,
      });
    }
  );
};

const getUserByUsername = (username, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, user);
  });
};

module.exports = { createUser, getUserByUsername };
