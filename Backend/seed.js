const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Supplier = require('./models/Supplier');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data (optional - comment out if you don't want to clear)
    // await User.deleteMany({ email: { $in: ['admin@fashionhub.com', 'sales@fashionhub.com'] } });
    // await Supplier.deleteMany({});

    // Create Admin User
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fashionhub.com',
      phone: '+91 99999 99999',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      permissions: {
        canDiscount: true,
        canRefund: true,
        canViewReports: true,
        maxDiscountPercent: 50
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create Sales Person
    const sales = await User.create({
      name: 'Sales Person',
      email: 'sales@fashionhub.com',
      phone: '+91 98765 43210',
      password: 'sales123',
      role: 'salesPerson',
      status: 'active',
      permissions: {
        canDiscount: true,
        canRefund: false,
        canViewReports: false,
        maxDiscountPercent: 10
      }
    });
    console.log('✅ Sales user created:', sales.email);

    // Create Sample Suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'Fashion Textiles Ltd',
        email: 'contact@fashiontextiles.com',
        phone: '+91 98765 11111',
        address: '123 Textile Market',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gstin: '27AABCU9603R1ZM',
        contactPerson: 'Rajesh Kumar',
        status: 'active'
      },
      {
        name: 'Global Garments Supply',
        email: 'info@globalgarments.com',
        phone: '+91 98765 22222',
        address: '456 Trade Center',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        gstin: '07AABCU9603R1ZN',
        contactPerson: 'Priya Sharma',
        status: 'active'
      }
    ]);
    console.log(`✅ ${suppliers.length} suppliers created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Default Credentials:');
    console.log('   Admin: admin@fashionhub.com / admin123');
    console.log('   Sales: sales@fashionhub.com / sales123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
