const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
