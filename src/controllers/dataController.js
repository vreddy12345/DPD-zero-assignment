const db = require('../database/db');

const storeData = (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_KEY_VALUE',
      message: 'Invalid key or value provided.',
    });
  }

  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }

    if (row) {
      return res.status(409).json({
        status: 'error',
        code: 'KEY_EXISTS',
        message: 'The provided key already exists in the database. To update an existing key, use the update API.',
      });
    }

    db.run('INSERT INTO data (key, value) VALUES (?, ?)', [key, value], function (insertErr) {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({
          status: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred. Please try again later.',
        });
      }

      return res.status(201).json({
        status: 'success',
        message: 'Data stored successfully.',
      });
    });
  });
};

const retrieveData = (req, res) => {
  const { key } = req.params;

  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }

    if (!row) {
      return res.status(404).json({
        status: 'error',
        code: 'KEY_NOT_FOUND',
        message: 'The provided key does not exist in the database.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        key: row.key,
        value: row.value,
      },
    });
  });
};

const updateData = (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_VALUE',
      message: 'Invalid value provided.',
    });
  }

  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }

    if (!row) {
      return res.status(404).json({
        status: 'error',
        code: 'KEY_NOT_FOUND',
        message: 'The provided key does not exist in the database.',
      });
    }

    db.run('UPDATE data SET value = ? WHERE key = ?', [value, key], function (updateErr) {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({
          status: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred. Please try again later.',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Data updated successfully.',
      });
    });
  });
};

const deleteData = (req, res) => {
  const { key } = req.params;

  db.get('SELECT * FROM data WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }

    if (!row) {
      return res.status(404).json({
        status: 'error',
        code: 'KEY_NOT_FOUND',
        message: 'The provided key does not exist in the database.',
      });
    }

    db.run('DELETE FROM data WHERE key = ?', [key], function (deleteErr) {
      if (deleteErr) {
        console.error(deleteErr);
        return res.status(500).json({
          status: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred. Please try again later.',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Data deleted successfully.',
      });
    });
  });
};

module.exports = { storeData, retrieveData, updateData, deleteData };
