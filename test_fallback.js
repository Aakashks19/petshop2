const jwt = require('jsonwebtoken');

const fallbackSecret = 'supersecretpetshopkey123';

function testFallback() {
    process.env.JWT_SECRET = ''; // Simulate missing secret
    
    const secretToUse = process.env.JWT_SECRET || fallbackSecret;
    console.log('Using secret:', secretToUse);

    try {
        const token = jwt.sign({ _id: 'test' }, secretToUse);
        console.log('Token signed successfully!');
        
        const decoded = jwt.verify(token, secretToUse);
        console.log('Token verified successfully!', decoded);
        
        if (secretToUse === fallbackSecret) {
            console.log('VERIFICATION SUCCESS: Fallback was used.');
        } else {
            console.log('VERIFICATION FAILURE: Fallback was NOT used.');
        }
    } catch (e) {
        console.error('VERIFICATION FAILURE:', e.message);
    }
}

testFallback();
