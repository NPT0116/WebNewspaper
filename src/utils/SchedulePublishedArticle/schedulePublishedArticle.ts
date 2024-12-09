import cron from 'node-cron';
import { getApprovedArticle, updateArticleStatus } from '~/repo/Article/articleRepo.js';

export const schedulePublishedArticle = cron.schedule(
  '*/10 * * * * *',
  async () => {
    const approvedArticles = await getApprovedArticle();
    if (approvedArticles.length > 0) {
      approvedArticles.forEach(async (article) => {
        const currentDate = new Date();
        const vietnamDate = new Date(currentDate.getTime() + 7 * 60 * 60000);
        if (article.approved.publishedAt && article.approved.publishedAt <= vietnamDate) {
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
