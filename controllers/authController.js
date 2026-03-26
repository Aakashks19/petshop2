const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretpetshopkey123';

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Set role to 'user' by default for all new registrations
        const user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            phone,
            address,
            role: 'user'
        });

        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ message: 'Registration failed', error: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ message: 'Login failed', error: e.message });
    }
};

exports.getProfile = async (req, res) => {
    res.send(req.user);
};

exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'phone', 'address'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
};
