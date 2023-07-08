const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB configuration
const MONGODB_URI = 'mongodb://localhost:27017/judgeo'; 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const codeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const Code = mongoose.model('Code', codeSchema);

app.post('/api/judge', async (req, res) => {
  try {
    // Retrieve the code and language from the request body
    const { code, language } = req.body;

    if (code === 'console.log("Hello, World!");' && language === 'javascript') {
      res.json({
        status: 'accepted',
        message: 'Congratulations! Working Properly.',
      });
    } else {
      res.json({
        status: 'wrong_answer',
        message: 'Sorry, Not Working Properly.',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
