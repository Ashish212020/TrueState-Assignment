require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const salesRoutes = require('./routes/salesRoutes');
const app = express();


app.use(express.json());
app.use(cors()); 
app.use(helmet());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));


app.use('/api', salesRoutes);
app.get('/', (req, res) => {
  res.send('TruEstate API is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));