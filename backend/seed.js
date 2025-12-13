require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Transaction = require('./src/models/Transaction');

const BATCH_SIZE = 500;

const seedData = async () => {
  try {
    
    console.log('🗑️  Clearing old data...');
    await Transaction.deleteMany({});
    console.log('✅ Old data cleared.');

    const stream = fs.createReadStream('data.csv').pipe(csv());
    
    let batch = [];
    let count = 0;

    console.log('🚀 Starting batch upload...');

    for await (const data of stream) {
      const doc = {
        customerID: data['Customer ID'],
        customerName: data['Customer Name'],
        phoneNumber: String(data['Phone Number']),
        gender: data['Gender'],
        age: parseInt(data['Age']) || 0,
        customerRegion: data['Customer Region'],
        customerType: data['Customer Type'],
        
        productID: data['Product ID'],
        productName: data['Product Name'],
        brand: data['Brand'],
        productCategory: data['Product Category'],
        tags: data['Tags'] ? data['Tags'].replace(/[\[\]']/g, '').split(',').map(t => t.trim()) : [],
        
        quantity: parseInt(data['Quantity']) || 0,
        pricePerUnit: parseFloat(data['Price per Unit']) || 0,
        discountPercent: parseFloat(data['Discount Percentage']) || 0,
        totalAmount: parseFloat(data['Total Amount']) || 0,
        finalAmount: parseFloat(data['Final Amount']) || 0,
        
        date: new Date(data['Date']),
        paymentMethod: data['Payment Method'],
        orderStatus: data['Order Status'],
        deliveryType: data['Delivery Type'],
        storeID: data['Store ID'],
        storeLocation: data['Store Location'],
        salespersonID: data['Salesperson ID'],
        employeeName: data['Employee Name']
      };

      batch.push(doc);

      if (batch.length >= BATCH_SIZE) {
        await Transaction.insertMany(batch);
        count += batch.length;
        process.stdout.write(`\r✅ Inserted ${count} records...`);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await Transaction.insertMany(batch);
      count += batch.length;
      console.log(`\r✅ Inserted ${count} records...`);
    }

    console.log('\n🎉 Seeding Completed Successfully!');
    process.exit();

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
};


const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    await seedData();
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  }
};

run();