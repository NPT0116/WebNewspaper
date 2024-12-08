import { Section } from '~/models/Section/sectionSchema.js'; // Đường dẫn tới Section schema
import { EditorProfile } from '~/models/Profile/editorProfile.js'; // Đường dẫn tới EditorProfile schema
import { Account } from '~/models/Account/accountSchema.js'; // Đường dẫn tới Account schema
import bcrypt from 'bcrypt'; // Dùng để hash mật khẩu

export const seedEditors = async () => {
  try {
    // Xóa dữ liệu cũ nếu cần
    await EditorProfile.deleteMany({});
    await Account.deleteMany({});
    console.log('Old editor profiles and accounts cleared');

    // Lấy danh sách tất cả các sections
    const sections = await Section.find({});
    if (!sections.length) {
      console.log('No sections found. Please seed sections first.');
      return;
    }

    // Hash mật khẩu mặc định
    const defaultPassword = await bcrypt.hash('123', 10);

    // Tạo editor profile và account cho từng section
    for (const section of sections) {
      for (let i = 1; i <= 3; i++) {
        const editorProfile = new EditorProfile({
          accountId: null, // Sẽ được cập nhật sau khi tạo account
          sectionId: section._id,
          name: `${section.name} Editor ${i}`,
          dob: new Date(`198${i + 1}-0${i}-${i - 1}5`),
          gender: i % 2 === 0 ? 'male' : 'female',
          editArticles: []
        });

        await editorProfile.save();

        const editorAccount = new Account({
          email: `${section.name.toLowerCase()}editor${i}@example.com`,
          role: 'editor',
          profileType: 'EditorProfile',
          profileId: editorProfile._id,
          localAuth: {
            username: `${section.name.toLowerCase()}EditorAccount${i}`,
            password: defaultPassword // Mật khẩu mặc định: "123"
          }
        });

        await editorAccount.save();

        // Cập nhật accountId trong editorProfile
        editorProfile.accountId = editorAccount._id;
        await editorProfile.save();
      }
      console.log(`Editor and account created for section: ${section.name}`);
    }

    console.log('All editors and accounts seeded successfully');
  } catch (err) {
    console.error('Error seeding editors and accounts:', err);
  }
};
