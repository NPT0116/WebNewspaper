import cron from 'node-cron';
import { getApprovedArticle, updateArticleStatus } from '~/repo/Article/articleRepo.js';

export const schedulePublishedArticle = cron.schedule(
  '*/1 * * * * *',
  async () => {
    const approvedArticles = await getApprovedArticle();
    if (approvedArticles.length > 0) {
      approvedArticles.forEach(async (article) => {
        if (article.publishedAt && new Date(article.publishedAt) <= new Date()) {
          await updateArticleStatus(article._id, 'published');
          console.log(`Article ${article.slug} has been published`);
        }
      });
    } else console.log('No approved articles');
  },
  {
    scheduled: true
  }
);
