import { Tag } from '~/models/Tag/tagSchema.js'; // Đường dẫn tới tagSchema

export const seedTags = async () => {
  try {
    // Xóa dữ liệu cũ trong collection Tag
    await Tag.deleteMany({});
    console.log('Old tags cleared');

    // Dữ liệu tag mẫu
    const tags = [
      { name: 'Breaking News', description: 'Latest breaking news' },
      { name: 'Technology', description: 'Tech-related news and articles' },
      { name: 'Sports', description: 'All about sports' },
      { name: 'Economy', description: 'Economic news and insights' },
      { name: 'Politics', description: 'Political updates and analysis' },
      { name: 'Education', description: 'Articles and resources for learning' },
      { name: 'Health', description: 'Health and wellness tips' },
      { name: 'Entertainment', description: 'Movies, music, and more' },
      { name: 'Science', description: 'Scientific discoveries and discussions' },
      { name: 'Environment', description: 'Climate and environmental news' }
    ];

    // Chèn tag vào database
    const insertedTags = await Tag.insertMany(tags);

    // Hiển thị kết quả
    console.log('Tags seeded successfully:', insertedTags);
  } catch (err) {
    console.error('Error seeding tags:', err);
  }
};
