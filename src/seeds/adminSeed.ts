import mongoose from 'mongoose';
import { Account } from '~/models/Account/accountSchema.js';
import { AdminProfile } from '~/models/Profile/adminProfile.js'; // Đường dẫn tới AdminProfile schema
import bcrypt from 'bcrypt';

export const seedAdminProfile = async () => {
  try {
    // Xóa dữ liệu Admin cũ
    await Account.deleteMany({ role: 'admin' });
    await AdminProfile.deleteMany({});
    console.log('Old admin accounts and profiles cleared.');

    // Tạo tài khoản Admin
    const adminAccount = new Account({
      email: 'admin@example.com',
      role: 'admin',
      profileType: 'AdminProfile',
      localAuth: {
        username: 'adminAccount',
        password: await bcrypt.hash('123', 10) // Mật khẩu mặc định "123"
      }
    });
    await adminAccount.save();

    // Tạo Admin Profile
    const adminProfile = new AdminProfile({
      accountId: adminAccount._id,
      name: 'Admin User',
      dob: new Date('1985-05-15'),
      gender: 'male'
    });
    await adminProfile.save();

    // Cập nhật profileId trong account
    adminAccount.profileId = adminProfile._id as mongoose.Types.ObjectId;
    await adminAccount.save();

    console.log('Admin profile and account created successfully.');
    console.log({
      email: adminAccount.email,
      username: adminAccount.localAuth?.username,
      password: '123' // Hiển thị mật khẩu mặc định
    });
  } catch (err) {
    console.error('Error seeding admin profile and account:', err);
  }
};
