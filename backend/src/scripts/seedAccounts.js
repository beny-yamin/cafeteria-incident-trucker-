require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ACCOUNTS = [
  {
    email: 'student@university.edu',
    passwordHint: 'Student123!',
    fullName: 'Student Reporter',
    role: 'student',
    firebaseUid: 'EG7hwFW5ufNC2ulJX6fGnNVVVh43'
  },
  {
    email: 'inspector@university.edu',
    passwordHint: 'Inspector123!',
    fullName: 'Food Safety Inspector',
    role: 'inspector',
    firebaseUid: 'JbuCIW8X12f1VUEZ8zg547wPbi22'
  },
  {
    email: 'admin@university.edu',
    passwordHint: 'Admin123!',
    fullName: 'Campus Administrator',
    role: 'admin',
    firebaseUid: '7MZjpHf3cRYfkQqyO5ujzAKZMUl2'
  }
];

async function seedAccounts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/university-food-quality';
  console.log('Connecting to MongoDB at:', uri);
  await mongoose.connect(uri);

  console.log('\n--- Syncing Instance Accounts in MongoDB ---');
  for (const acc of ACCOUNTS) {
    const existing = await User.findOne({ email: acc.email });
    if (existing) {
      existing.fullName = acc.fullName;
      existing.role = acc.role;
      existing.firebaseUid = acc.firebaseUid;
      await existing.save();
      console.log(`✓ Updated existing account: ${acc.email} (${acc.role})`);
    } else {
      await User.create({
        email: acc.email,
        fullName: acc.fullName,
        role: acc.role,
        firebaseUid: acc.firebaseUid
      });
      console.log(`✓ Created account: ${acc.email} (${acc.role})`);
    }
  }

  console.log('\n======================================================');
  console.log(' INSTANT ROLE CREDENTIALS (Firebase: jaaamin-rox) ');
  console.log('======================================================');
  console.log('1. Student Reporter:');
  console.log('   Email:    student@university.edu');
  console.log('   Password: Student123!');
  console.log('   Role:     student');
  console.log('------------------------------------------------------');
  console.log('2. Food Safety Inspector:');
  console.log('   Email:    inspector@university.edu');
  console.log('   Password: Inspector123!');
  console.log('   Role:     inspector');
  console.log('------------------------------------------------------');
  console.log('3. Campus Administrator:');
  console.log('   Email:    admin@university.edu');
  console.log('   Password: Admin123!');
  console.log('   Role:     admin');
  console.log('======================================================');
  console.log('* Change password anytime via dashboard or Firebase Console.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedAccounts().catch((err) => {
  console.error('Seed accounts error:', err);
  process.exit(1);
});
