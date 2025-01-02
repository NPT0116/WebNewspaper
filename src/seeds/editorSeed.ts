import { Section } from '~/models/Section/sectionSchema.js'; // Đường dẫn tới Section schema
import { EditorProfile } from '~/models/Profile/editorProfile.js'; // Đường dẫn tới EditorProfile schema
import { Account } from '~/models/Account/accountSchema.js'; // Đường dẫn tới Account schema
import bcrypt from 'bcrypt'; // Dùng để hash mật khẩu

export const seedEditors = async () => {
  try {
    // Xóa dữ liệu cũ nếu cần
    await EditorProfile.deleteMany({});
    await Account.deleteMany({ role: 'editor' });
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
      const editorProfile = new EditorProfile({
        accountId: null, // Sẽ được cập nhật sau khi tạo account
        sectionId: section._id,
        name: `${section.name} Editor`,
        dob: new Date(`1985-02-15`),
        gender: 'male',
        editArticles: []
      });

      await editorProfile.save();

      const editorAccount = new Account({
        email: `${section.name.toLowerCase()}editor@example.com`,
        role: 'editor',
        profileType: 'EditorProfile',
        profileId: editorProfile._id,
        localAuth: {
          username: `${section.name.toLowerCase()}EditorAccount`,
          password: defaultPassword // Mật khẩu mặc định: "123"
        }
      });

      await editorAccount.save();

      // Cập nhật accountId trong editorProfile
      editorProfile.accountId = editorAccount._id;
      await editorProfile.save();
      // console.log(`Editor and account created for section: ${section.name}`);
    }

    console.log('All editors and accounts seeded successfully');
  } catch (err) {
    console.error('Error seeding editors and accounts:', err);
  }
};
