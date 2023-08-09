// src/routes/dataRoutes.js
const express = require('express');
const dataController = require('../controllers/dataController');
const verifyToken = require('../middleware/verifyToken'); // Import the middleware

const router = express.Router();

router.post('/data', verifyToken, dataController.storeData);
router.get('/data/:key', verifyToken, dataController.retrieveData);
router.put('/data/:key', verifyToken, dataController.updateData);
router.delete('/data/:key', verifyToken, dataController.deleteData);

module.exports = router;
