import { Tag } from '~/models/Tag/tagSchema.js'; // Đường dẫn tới tagSchema
import { generateSlug } from '~/utils/common.js';

export const seedTags = async () => {
  try {
    // Xóa dữ liệu cũ trong collection Tag
    await Tag.deleteMany({});
    console.log('Old tags cleared');

    // Dữ liệu tag mẫu
    const tags = [
      { name: 'Breaking News', description: 'Latest updates and events', slug: '' },
      { name: 'Technology', description: 'Tech news and trends', slug: '' },
      { name: 'Sports', description: 'News about sports', slug: '' },
      { name: 'Economy', description: 'Economic updates', slug: '' },
      { name: 'Politics', description: 'Political news', slug: '' },
      { name: 'Education', description: 'Learning and education', slug: '' },
      { name: 'Health', description: 'Health tips and news', slug: '' },
      { name: 'Entertainment', description: 'Movies, music, and shows', slug: '' },
      { name: 'Science', description: 'Scientific news', slug: '' },
      { name: 'Environment', description: 'Climate and nature news', slug: '' },
      { name: 'Hot News', description: 'Popular news stories', slug: '' },
      { name: 'AI', description: 'Artificial intelligence updates', slug: '' },
      { name: '5G', description: 'Next-gen mobile networks', slug: '' },
      { name: 'Blockchain', description: 'Blockchain news', slug: '' },
      { name: 'CyberSecurity', description: 'Online security updates', slug: '' },
      { name: 'Augmented Technology', description: 'AR news and insights', slug: '' },
      { name: 'Quantum Computing', description: 'Advanced computing updates', slug: '' },
      { name: 'Mental Health', description: 'Mind and wellness tips', slug: '' },
      { name: 'Awareness', description: 'Important issues to know', slug: '' },
      { name: 'Diet', description: 'Healthy eating tips', slug: '' },
      { name: 'Nutrition', description: 'Food and health info', slug: '' },
      { name: 'Sleep', description: 'Rest and sleep tips', slug: '' },
      { name: 'Inflation', description: 'Price changes and news', slug: '' },
      { name: 'Global Economy', description: 'World economy updates', slug: '' },
      { name: 'Economic Growth', description: 'Business and growth news', slug: '' },
      { name: 'Global Trade', description: 'International trade updates', slug: '' },
      { name: 'Labor Market', description: 'Workforce and jobs news', slug: '' },
      { name: 'Cryptocurrency', description: 'Digital currency updates', slug: '' },
      { name: 'Digital Economy', description: 'Online economy trends', slug: '' },
      { name: 'Esports', description: 'Competitive gaming news', slug: '' },
      { name: 'Video Games', description: 'Gaming updates', slug: '' },
      { name: 'Football', description: 'Football news', slug: '' },
      { name: 'Tactics', description: 'Game strategies', slug: '' },
      { name: "Women's Sports", description: "News on women's sports", slug: '' },
      { name: 'Equality', description: 'Equal rights updates' },
      { name: 'Athlete Performance', description: 'Athlete stats and updates', slug: '' },
      { name: 'Training', description: 'Fitness and training tips', slug: '' },
      { name: 'Social Media', description: 'Social platforms updates', slug: '' },
      { name: 'Elections', description: 'Voting and election news', slug: '' },
      { name: 'Climate Change', description: 'Environmental updates', slug: '' },
      { name: 'Populism', description: 'Populist movements news', slug: '' },
      { name: 'Democracy', description: 'Democracy updates', slug: '' },
      { name: 'Diplomacy', description: 'International relations', slug: '' },
      { name: 'International Organizations', description: 'Global institutions news', slug: '' }
    ];

    for (const tag of tags) {
      tag.slug = generateSlug(tag.name);
    }

    // Chèn tag vào database
    const insertedTags = await Tag.insertMany(tags);

    // Hiển thị kết quả
    console.log('Tags seeded successfully:', insertedTags);
  } catch (err) {
    console.error('Error seeding tags:', err);
  }
};
