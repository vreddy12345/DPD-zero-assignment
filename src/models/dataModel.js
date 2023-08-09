const db = require('../database/db');

const storeData = (key, value, callback) => {
  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    if (row) {
      return callback({ code: 'KEY_EXISTS' });
    }

    db.run('INSERT INTO data (key, value) VALUES (?, ?)', [key, value], function (insertErr) {
      if (insertErr) {
        console.error(insertErr);
        return callback(insertErr);
      }

      return callback(null);
    });
  });
};

const getDataByKey = (key, callback) => {
  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    return callback(null, row);
  });
};

const updateData = (key, value, callback) => {
  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    if (!row) {
      return callback({ code: 'KEY_NOT_FOUND' });
    }

    db.run('UPDATE data SET value = ? WHERE key = ?', [value, key], function (updateErr) {
      if (updateErr) {
        console.error(updateErr);
        return callback(updateErr);
      }

      return callback(null);
    });
  });
};

const deleteData = (key, callback) => {
  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return callback(err);
    }

    if (!row) {
      return callback({ code: 'KEY_NOT_FOUND' });
    }

    db.run('DELETE FROM data WHERE key = ?', [key], function (deleteErr) {
      if (deleteErr) {
        console.error(deleteErr);
        return callback(deleteErr);
      }

      return callback(null);
    });
  });
};

module.exports = { storeData, getDataByKey, updateData, deleteData };
