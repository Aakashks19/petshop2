const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://aakashks1903_db_user:pRrCNDH06Ie81Jvj@cluster0.8g8kxge.mongodb.net/petshop?retryWrites=true&w=majority';

async function reset() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@exoticpets.com';
        const hashedPassword = await bcrypt.hash('admin123', 8);

        const result = await User.findOneAndUpdate(
            { email: adminEmail },
            { password: hashedPassword, role: 'admin' },
            { new: true, upsert: true }
        );

        console.log('Admin password reset successful!');
        console.log('Email:', result.email);
        console.log('Password: admin123');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

reset();
