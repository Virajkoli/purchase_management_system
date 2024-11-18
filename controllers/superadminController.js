const User = require('../models/user');

const createSuperadmin = async () => {
    try {
      const superadminExists = await User.findOne({ role: 'Superadmin' });
      if (!superadminExists) {
        const superadmin = new User({
          name: 'Superadmin',
          email: 'superadmin@purchase.com',
          password: await bcrypt.hash('superadmin@purchase', 10), 
          role: 'Superadmin',
          permissions: ['all'], 
          password: await bcrypt.hash('superadmin@purchase', 10), // Hashed password
          role: 'Superadmin',
          permissions: ['all'], // Full permissions
        });
  
        await superadmin.save();
        console.log('Superadmin created successfully!');
      } else {
        console.log('Superadmin already exists.');
      }
    } catch (err) {
      console.error('Error creating Superadmin:', err);
    }
  };
  module.exports = { createSuperadmin };
