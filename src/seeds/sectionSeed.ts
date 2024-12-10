import { Section } from '~/models/Section/sectionSchema.js';
import { generateSlug } from '~/utils/common.js';

export const seedSections = async () => {
  try {
    // Xóa dữ liệu cũ
    await Section.deleteMany({});
    console.log('Old sections cleared');

    // Tạo danh sách main sections
    const mainSections = [
      { name: 'Sports', parentSection: null, slug: '' },
      { name: 'Technology', parentSection: null, slug: '' },
      { name: 'Politics', parentSection: null, slug: '' },
      { name: 'Entertainment', parentSection: null, slug: '' },
      { name: 'Health', parentSection: null, slug: '' },
      { name: 'Economy', parentSection: null, slug: '' },
      { name: 'Life', parentSection: null, slug: '' },
      { name: 'Education', parentSection: null, slug: '' }
    ];

    // Generate slugs for main sections
    for (const section of mainSections) {
      section.slug = generateSlug(section.name);
    }

    // Chèn các main sections
    const insertedMainSections = await Section.insertMany(mainSections);

    const sports = insertedMainSections.find((s) => s.name === 'Sports')?._id;
    const politics = insertedMainSections.find((s) => s.name === 'Politics')?._id;
    const economy = insertedMainSections.find((s) => s.name === 'Economy')?._id;
    const entertainment = insertedMainSections.find((s) => s.name === 'Entertainment')?._id;
    const life = insertedMainSections.find((s) => s.name === 'Life')?._id;

    // Tạo danh sách child sections
    const childSections = [
      { name: 'Football', parentSection: sports, slug: '' },
      { name: 'Basketball', parentSection: sports, slug: '' },
      { name: 'Tennis', parentSection: sports, slug: '' },
      { name: 'Elections', parentSection: politics, slug: '' },
      { name: 'Stock Market', parentSection: economy, slug: '' },
      { name: 'Music', parentSection: entertainment, slug: '' },
      { name: 'Film', parentSection: entertainment, slug: '' },
      { name: 'Cars', parentSection: life, slug: '' },
      { name: 'Food', parentSection: life, slug: '' },
      { name: 'Book', parentSection: life, slug: '' }
    ];

    // Generate slugs for child sections
    for (const section of childSections) {
      section.slug = generateSlug(section.name);
    }

    // Chèn các child sections
    const insertedChildSections = await Section.insertMany(childSections);

    // Cập nhật danh sách childSections trong các main sections
    for (const child of insertedChildSections) {
      await Section.findByIdAndUpdate(child.parentSection, {
        $push: { childSections: child._id }
      });
    }

    // Debug để xem dữ liệu
    // console.log('Inserted main sections:', insertedMainSections);
    // console.log('Inserted child sections:', insertedChildSections);

    console.log('Sections seeded successfully');
  } catch (err) {
    console.error('Error seeding sections:', err);
  }
};
