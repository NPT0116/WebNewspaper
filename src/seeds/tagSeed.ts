import { Tag } from '~/models/Tag/tagSchema.js'; // Đường dẫn tới tagSchema

export const seedTags = async () => {
  try {
    // Xóa dữ liệu cũ trong collection Tag
    await Tag.deleteMany({});
    console.log('Old tags cleared');

    // Dữ liệu tag mẫu
    const tags = [
      { name: 'Breaking News', description: 'Latest updates and events' },
      { name: 'Technology', description: 'Tech news and trends' },
      { name: 'Sports', description: 'News about sports' },
      { name: 'Economy', description: 'Economic updates' },
      { name: 'Politics', description: 'Political news' },
      { name: 'Education', description: 'Learning and education' },
      { name: 'Health', description: 'Health tips and news' },
      { name: 'Entertainment', description: 'Movies, music, and shows' },
      { name: 'Science', description: 'Scientific news' },
      { name: 'Environment', description: 'Climate and nature news' },
      { name: 'Hot News', description: 'Popular news stories' },
      { name: 'AI', description: 'Artificial intelligence updates' },
      { name: '5G', description: 'Next-gen mobile networks' },
      { name: 'Blockchain', description: 'Blockchain news' },
      { name: 'CyberSecurity', description: 'Online security updates' },
      { name: 'Augmented Technology', description: 'AR news and insights' },
      { name: 'Quantum Computing', description: 'Advanced computing updates' },
      { name: 'Mental Health', description: 'Mind and wellness tips' },
      { name: 'Awareness', description: 'Important issues to know' },
      { name: 'Diet', description: 'Healthy eating tips' },
      { name: 'Nutrition', description: 'Food and health info' },
      { name: 'Sleep', description: 'Rest and sleep tips' },
      { name: 'Inflation', description: 'Price changes and news' },
      { name: 'Global Economy', description: 'World economy updates' },
      { name: 'Economic Growth', description: 'Business and growth news' },
      { name: 'Global Trade', description: 'International trade updates' },
      { name: 'Labor Market', description: 'Workforce and jobs news' },
      { name: 'Cryptocurrency', description: 'Digital currency updates' },
      { name: 'Digital Economy', description: 'Online economy trends' },
      { name: 'Esports', description: 'Competitive gaming news' },
      { name: 'Video Games', description: 'Gaming updates' },
      { name: 'Football', description: 'Football news' },
      { name: 'Tactics', description: 'Game strategies' },
      { name: "Women's Sports", description: "News on women's sports" },
      { name: 'Equality', description: 'Equal rights updates' },
      { name: 'Athlete Performance', description: 'Athlete stats and updates' },
      { name: 'Training', description: 'Fitness and training tips' },
      { name: 'Social Media', description: 'Social platforms updates' },
      { name: 'Elections', description: 'Voting and election news' },
      { name: 'Climate Change', description: 'Environmental updates' },
      { name: 'Populism', description: 'Populist movements news' },
      { name: 'Democracy', description: 'Democracy updates' },
      { name: 'Diplomacy', description: 'International relations' },
      { name: 'International Organizations', description: 'Global institutions news' }
    ];

    // Chèn tag vào database
    const insertedTags = await Tag.insertMany(tags);

    // Hiển thị kết quả
    console.log('Tags seeded successfully:', insertedTags);
  } catch (err) {
    console.error('Error seeding tags:', err);
  }
};
