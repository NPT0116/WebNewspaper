import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';

// Lấy bài viết nổi bật nhất trong tuần qua
export const getHotNews = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const hotNewsTag = await Tag.findOne({ name: 'Hot News' });
  if (!hotNewsTag) {
    console.log("Can't find tag hot news");
    return null;
  }
  const hotNews = await Article.find({
    status: 'published',
    tags: { $in: [hotNewsTag._id] },
    publishedAt: { $gte: oneWeekAgo }
  })
    .sort({ publishedAt: -1 })
    .limit(4)
    .populate('sectionId', 'name') // Populate sectionName
    .populate('tags', 'name') // Populate tagNames
    .populate('author', 'name'); // Populate authorName

  return hotNews.map((article) => ({
    title: article.title,
    author: {
      id: article.author?._id,
      name: article.author?.name
    },
    section: {
      id: article.sectionId?._id,
      name: article.sectionId?.name
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name
    })),
    publishedAt: article.publishedAt,
    description: article.description,
    images: article.images
  }));
};

// Lấy bài viết được xem nhiều nhất
export const getMostViewedArticles = async () => {
  const mostViewedArticles = await Article.find({ status: 'published' })
    .sort({ views: -1 })
    .limit(10)
    .populate('sectionId', 'name') // Populate sectionName
    .populate('tags', 'name') // Populate tagNames
    .populate('author', 'name'); // Populate authorName

  return mostViewedArticles.map((article) => ({
    title: article.title,
    author: {
      id: article.author?._id,
      name: article.author?.name
    },
    section: {
      id: article.sectionId?._id,
      name: article.sectionId?.name
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name
    })),
    publishedAt: article.publishedAt,
    description: article.description,
    images: article.images,
    views: article.views
  }));
};

// Lấy bài viết mới nhất
export const getLatestArticles = async () => {
  const latestArticles = await Article.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(10)
    .populate('sectionId', 'name') // Populate sectionName
    .populate('tags', 'name') // Populate tagNames
    .populate('author', 'name'); // Populate authorName

  return latestArticles.map((article) => ({
    title: article.title,
    author: {
      id: article.author?._id,
      name: article.author?.name
    },
    section: {
      id: article.sectionId?._id,
      name: article.sectionId?.name
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name
    })),
    publishedAt: article.publishedAt,
    description: article.description,
    images: article.images
  }));
};

// Lấy top 10 chuyên mục với bài viết mới nhất
export const getTopSectionsWithLatestArticles = async () => {
  const topSections = await Section.aggregate([
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'sectionId',
        as: 'articles'
      }
    },
    {
      $addFields: {
        totalViews: { $sum: '$articles.views' }
      }
    },
    { $sort: { totalViews: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        name: 1,
        totalViews: 1
      }
    }
  ]);

  const topSectionArticles = await Promise.all(
    topSections.map(async (section) => {
      const latestArticle = await Article.findOne({
        sectionId: section._id,
        status: 'published'
      })
        .sort({ publishedAt: -1 })
        .select('_id title views publishedAt description images tags author')
        .populate('tags', 'name')
        .populate('author', 'name');

      return {
        sectionId: section._id,
        sectionName: section.name,
        totalViews: section.totalViews,
        latestArticle: latestArticle
          ? {
              id: latestArticle._id,
              title: latestArticle.title,
              author: {
                id: latestArticle.author?._id,
                name: latestArticle.author?.name
              },
              publishedAt: latestArticle.publishedAt,
              views: latestArticle.views,
              description: latestArticle.description,
              images: latestArticle.images,
              tags: latestArticle.tags.map((tag) => ({
                id: tag._id,
                name: tag.name
              }))
            }
          : null
      };
    })
  );

  return topSectionArticles;
};

// Kết hợp tất cả dữ liệu trong một function (Landing Page Data)
export const getLandingPageData = async () => {
  const [hotNews, mostViewedArticles, latestArticles, topSections] = await Promise.all([getHotNews(), getMostViewedArticles(), getLatestArticles(), getTopSectionsWithLatestArticles()]);

  return {
    hotNews,
    mostViewedArticles,
    latestArticles,
    topSections
  };
};
