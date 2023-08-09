const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const registerUser = (req, res) => {
  const { username, email, password, full_name, age, gender } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_REQUEST',
      message: 'Invalid request. Please provide all required fields: username, email, password, full_name.',
    });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
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
        code: 'USERNAME_EXISTS',
        message: 'The provided username is already taken. Please choose a different username.',
      });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
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
          code: 'EMAIL_EXISTS',
          message: 'The provided email is already registered. Please use a different email address.',
        });
      }

      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res.status(500).json({
            status: 'error',
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An internal server error occurred. Please try again later.',
          });
        }

        db.run(
          'INSERT INTO users (username, email, password, full_name, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
          [username, email, hashedPassword, full_name, age, gender],
          function (insertErr) {
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
              message: 'User successfully registered!',
              data: {
                user_id: this.lastID,
                username,
                email,
                full_name,
                age,
                gender,
              },
            });
          }
        );
      });
    });
  });
};

const generateToken = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      code: 'MISSING_FIELDS',
      message: 'Missing fields. Please provide both username and password.',
    });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred. Please try again later.',
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. The provided username or password is incorrect.',
      });
    }

    bcrypt.compare(password, user.password, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res.status(500).json({
          status: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred. Please try again later.',
        });
      }

      if (!result) {
        return res.status(401).json({
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials. The provided username or password is incorrect.',
        });
      }

      const token = jwt.sign({ user_id: user.user_id }, secretKey, { expiresIn: '1h' });

      return res.status(200).json({
        status: 'success',
        message: 'Access token generated successfully.',
        data: {
          access_token: token,
          expires_in: 3600,
        },
      });
    });
  });
};

module.exports = { registerUser, generateToken };
