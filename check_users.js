const mongoose = require('mongoose');
const User = require('./models/User');

const uri = 'mongodb+srv://aakashks1903_db_user:pRrCNDH06Ie81Jvj@cluster0.8g8kxge.mongodb.net/petshop?retryWrites=true&w=majority';

async function run() {
    try {
        await mongoose.connect(uri);
        console.log('--- Database Connected ---');
        
        const users = await User.find({}, { password: 0 });
        console.log(`Found ${users.length} users:`);
        
        users.forEach((u, i) => {
            console.log(`${i+1}. Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
        
        console.log('--- End of List ---');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
