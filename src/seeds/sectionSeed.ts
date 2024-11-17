import { Section } from '~/models/Section/sectionSchema.js';

export const seedSections = async () => {
  try {
    // Xóa dữ liệu cũ
    await Section.deleteMany({});
    console.log('Old sections cleared');

    // Tạo danh sách main sections
    const mainSections = [
      { name: 'News', parentSection: null },
      { name: 'Sports', parentSection: null },
      { name: 'Technology', parentSection: null },
      { name: 'World News', parentSection: null },
      { name: 'Politics', parentSection: null },
      { name: 'Economy', parentSection: null }
    ];

    // Chèn các main sections
    const insertedMainSections = await Section.insertMany(mainSections);

    const sports = insertedMainSections.find((s) => s.name === 'Sports')?._id;
    const politics = insertedMainSections.find((s) => s.name === 'Politics')?._id;
    const economy = insertedMainSections.find((s) => s.name === 'Economy')?._id;

    // Tạo danh sách child sections
    const childSections = [
      { name: 'Football', parentSection: sports },
      { name: 'Basketball', parentSection: sports },
      { name: 'Elections', parentSection: politics },
      { name: 'Government Policies', parentSection: politics },
      { name: 'Stock Market', parentSection: economy }
    ];

    // Chèn các child sections
    const insertedChildSections = await Section.insertMany(childSections);

    // Cập nhật danh sách childSections trong các main sections
    for (const child of insertedChildSections) {
      await Section.findByIdAndUpdate(child.parentSection, {
        $push: { childSections: child._id }
      });
    }

    // Debug để xem dữ liệu
    console.log('Inserted main sections:', insertedMainSections);
    console.log('Inserted child sections:', insertedChildSections);

    console.log('Sections seeded successfully');
  } catch (err) {
    console.error('Error seeding sections:', err);
  }
};
