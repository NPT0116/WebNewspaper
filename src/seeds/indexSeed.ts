import { seedSections } from './sectionSeed.js';
import connectDB from '~/config/db.js';
import { seedTags } from './tagSeed.js';
import { seedEditors } from './editorSeed.js';
import { seedArticlesWithReporterAndEditor } from './articlesAndReporter.js';
import { seedComments } from './commentAndReaderSeed.js';
import { seedAdminProfile } from './adminSeed.js';
import dotenv from 'dotenv';
dotenv.config();
connectDB();
const seedAll = async () => {
  try {
    await connectDB();

    console.log('Seeding data...');
    await seedSections();
    await seedTags();
    await seedEditors();
    await seedArticlesWithReporterAndEditor();
    await seedComments();
    await seedAdminProfile();
    console.log('All seeds completed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedAll();
