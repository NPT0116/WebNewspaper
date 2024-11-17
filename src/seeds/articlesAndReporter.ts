import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Account } from '~/models/Account/accountSchema.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import bcrypt from 'bcrypt';

// Hàm tạo slug từ tiêu đề
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, ''); // Loại bỏ ký tự đặc biệt
};

export const seedArticlesWithReporterAndEditor = async () => {
  try {
    // Xóa dữ liệu cũ
    await Article.deleteMany({});
    console.log('Old articles cleared.');

    // Tạo tài khoản và profile cho Reporter
    const reporterAccount = new Account({
      email: 'reporter@example.com',
      role: 'reporter',
      profileType: 'ReporterProfile',
      localAuth: {
        username: 'reporterAccount',
        password: await bcrypt.hash('123', 10) // Mật khẩu mặc định "123"
      }
    });
    await reporterAccount.save();

    const reporterProfile = new ReporterProfile({
      accountId: reporterAccount._id,
      name: 'John Doe',
      dob: new Date('1990-01-01'),
      gender: 'male',
      reportArticles: []
    });
    await reporterProfile.save();

    // Cập nhật profileId trong account
    reporterAccount.profileId = reporterProfile._id as mongoose.Types.ObjectId;
    await reporterAccount.save();

    console.log('Reporter account and profile created.');

    // Lấy ObjectId cho các trường liên quan
    const sections = await Section.find();
    const tags = await Tag.find();
    const editors = await EditorProfile.find(); // Lấy tất cả editors

    const getSectionId = (name: string) => sections.find((section) => section.name === name)?._id;

    const getTagIds = (tagNames: string[]) => tags.filter((tag) => tagNames.includes(tag.name)).map((tag) => tag._id);

    const getEditorForSection = (sectionId: mongoose.Types.ObjectId | undefined) => editors.find((editor) => editor.sectionId?.toString() === sectionId?.toString())?._id; // Tìm editor thuộc section

    // Lấy ngày hiện tại
    const today = new Date();

    // Dữ liệu bài viết
    const articleData = [
      {
        title: 'How Donald Trump Gave Democrats the Working-Class Blues',
        content: '...Content...',
        images: ['...URL...'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Breaking News', 'Politics']),
        author: reporterProfile._id, // Gán author là ReporterProfile vừa tạo
        editor: getEditorForSection(getSectionId('Politics')), // Gắn editor dựa trên section
        slug: generateSlug('How Donald Trump Gave Democrats the Working-Class Blues'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Naïveté Behind Post-Election Despair',
        content: '...Content...',
        images: ['...URL...'],
        sectionId: getSectionId('Politics'),
        tags: getTagIds(['Politics']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Politics')),
        slug: generateSlug('The Naïveté Behind Post-Election Despair'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'Documentaries of Dissent',
        content: '...Content...',
        images: ['...URL...'],
        sectionId: getSectionId('Arts'),
        tags: getTagIds(['Reviews', 'Art']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Arts')),
        slug: generateSlug('Documentaries of Dissent'), // Thêm slug
        status: 'published',
        publishedAt: today
      },
      {
        title: 'The Cleveland Cavaliers Are Dialed In',
        content: 'The Cleveland Cavaliers are showing extraordinary form this season...',
        images: ['https://media.newyorker.com/photos/672e855f55c32282ba45df79/master/w_2240,c_limit/Thomas-Cleveland-Cavaliers.jpg'],
        sectionId: getSectionId('Sports'),
        tags: getTagIds(['Basketball', 'Sports']),
        author: reporterProfile._id,
        editor: getEditorForSection(getSectionId('Sports')),
        slug: generateSlug('The Cleveland Cavaliers Are Dialed In'), // Thêm slug
        status: 'published',
        publishedAt: today
      }
    ];

    // Chèn bài viết vào database
    const insertedArticles = await Article.insertMany(articleData);

    // Cập nhật bài viết vào ReporterProfile
    reporterProfile.reportArticles = insertedArticles.map((article) => article._id) as mongoose.Types.ObjectId[];
    await reporterProfile.save();

    console.log('Articles seeded successfully and linked to reporter and editors:', insertedArticles);
  } catch (err) {
    console.error('Error seeding articles, reporter, and editors:', err);
  }
};
