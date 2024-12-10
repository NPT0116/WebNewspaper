import mongoose from 'mongoose';
import { Article } from '~/models/Article/articleSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Account } from '~/models/Account/accountSchema.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { generateSlug } from '~/utils/common.js';
import { fileURLToPath } from 'url';

interface IArticleData {
  title: string;
  description: string;
  content: string;
  images: string[];
  sectionId: string;
  tags: string[];
}

const getRandomNumberInRange = (min: number, max: number): number => {
  if (min > max) {
    throw new Error('Min value cannot be greater than max value.');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomDate(start: Date, end: Date): string {
  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) {
    throw new Error('Start date must be before or equal to the end date.');
  }

  const randomTime = Math.random() * (endTime - startTime) + startTime;
  return new Date(randomTime).toISOString();
}

export const seedArticlesWithReporterAndEditor = async () => {
  try {
    // Xóa dữ liệu cũ
    await Article.deleteMany({});
    console.log('Old articles cleared.');
    await Article.syncIndexes();
    console.log('Indexes synced successfully.');

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

    const reporterAccount2 = new Account({
      email: 'davidremnick@example.com',
      role: 'reporter',
      profileType: 'ReporterProfile',
      localAuth: {
        username: 'davidremnick',
        password: await bcrypt.hash('davidremnickpassword', 10)
      }
    });
    await reporterAccount2.save();

    const reporterProfile2 = new ReporterProfile({
      accountId: reporterAccount2._id,
      name: 'David Remnick',
      dob: new Date('1958-10-29'),
      gender: 'male',
      reportArticles: []
    });
    await reporterProfile2.save();

    reporterAccount2.profileId = reporterProfile2._id as mongoose.Types.ObjectId;
    await reporterAccount2.save();

    const reporterAccount3 = new Account({
      email: 'truonganhngoc@example.com',
      role: 'reporter',
      profileType: 'ReporterProfile',
      localAuth: {
        username: 'truonganhngoc',
        password: await bcrypt.hash('truonganhngocpassword', 10)
      }
    });
    await reporterAccount2.save();

    const reporterProfile3 = new ReporterProfile({
      accountId: reporterAccount2._id,
      name: 'Trương Anh Ngọc',
      dob: new Date('1976-01-19'),
      gender: 'male',
      reportArticles: []
    });
    await reporterProfile3.save();

    reporterAccount3.profileId = reporterProfile3._id as mongoose.Types.ObjectId;
    await reporterAccount3.save();
    console.log('Reporter account and profile created.');

    const reporterArr = [reporterProfile, reporterProfile2, reporterProfile3];

    // Lấy ObjectId cho các trường liên quan
    const sections = await Section.find();
    const getSectionId = (name: string) => sections.find((section) => section.name === name)?._id;

    const tags = await Tag.find();
    const getTagIds = (tagNames: string[]) => tags.filter((tag) => tagNames.includes(tag.name)).map((tag) => tag._id);

    const editors = await EditorProfile.find();
    const getEditorForSection = (sectionId: mongoose.Types.ObjectId | undefined) => editors.find((editor) => editor.sectionId?.toString() === sectionId?.toString())?._id;

    const __filename = fileURLToPath(import.meta.url); // Path to the current file
    const __dirname = path.dirname(__filename); // Directory of the current file
    const filePath = path.resolve(__dirname, '../../src/seeds', 'articles.json');

    const data = await fs.promises.readFile(filePath, 'utf-8');
    // Parse the JSON string into an array of Content objects
    const content: IArticleData[] = JSON.parse(data);

    for (const articleData of content) {
      const sectionId = getSectionId(articleData.sectionId);
      const editorId = getEditorForSection(sectionId);
      const editor = await EditorProfile.findById(editorId);
      const reporter = reporterArr[getRandomNumberInRange(0, reporterArr.length - 1)];
      const publishedDate = getRandomDate(new Date('2024-11-01T00:00:00Z'), new Date('2024-12-01T00:00:00Z'));
      const views = getRandomNumberInRange(10000, 30000);

      const article = new Article({
        slug: generateSlug(articleData.title),
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        author: reporter._id,
        images: articleData.images,
        sectionId: sectionId,
        tags: getTagIds(articleData.tags),
        status: 'published',
        views: views,
        isSubscribed: views % 3 == 0 ? true : false,
        publishedAt: publishedDate,
        layout: getRandomNumberInRange(1, 3),
        approved: {
          editorId: editorId,
          publishedAt: publishedDate
        }
      });

      await article.save();
      reporter.reportArticles.push(article._id);
      await reporter.save();
      editor?.editArticles.push(article._id);
      await editor?.save();
    }

    // Cập nhật bài viết vào ReporterProfile

    console.log('Articles seeded successfully and linked to reporter and editors');
  } catch (err) {
    console.error('Error seeding articles, reporter, and editors:', err);
  }
};
