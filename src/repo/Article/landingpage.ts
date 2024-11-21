import mongoose from 'mongoose';
import { IAuthor, ISection, ITag } from '~/interfaces/Article/articleInterface.js';
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
  console.log(mongoose.modelNames());

  const hotNews = await Article.find({
    status: 'published',
    tags: { $in: [hotNewsTag._id] },
    publishedAt: { $gte: oneWeekAgo }
  })
    .sort({ publishedAt: -1 })
    .limit(4)
    .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Include slug for section
    .populate<{ tags: ITag[] }>('tags', 'name slug') // Include slug for tags
    .populate<{ author: IAuthor }>('author', 'name') // Strict typing for author
    .exec();

  return hotNews.map((article) => ({
    slug: article.slug,
    title: article.title,
    author: {
      id: article.author._id,
      name: article.author.name
    },
    section: {
      id: article.sectionId._id,
      name: article.sectionId.name,
      slug: article.sectionId.slug // Include slug
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name,
      slug: tag.slug // Include slug
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
    .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Include slug for section
    .populate<{ tags: ITag[] }>('tags', 'name slug') // Include slug for tags
    .populate<{ author: IAuthor }>('author', 'name') // Strict typing for author
    .exec();

  return mostViewedArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    author: {
      id: article.author._id,
      name: article.author.name
    },
    section: {
      id: article.sectionId._id,
      name: article.sectionId.name,
      slug: article.sectionId.slug // Include slug
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name,
      slug: tag.slug // Include slug
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
    .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Include slug for section
    .populate<{ tags: ITag[] }>('tags', 'name slug') // Include slug for tags
    .populate<{ author: IAuthor }>('author', 'name') // Strict typing for author
    .exec();

  return latestArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    author: {
      id: article.author._id,
      name: article.author.name
    },
    section: {
      id: article.sectionId._id,
      name: article.sectionId.name,
      slug: article.sectionId.slug // Include slug
    },
    tags: article.tags.map((tag) => ({
      id: tag._id,
      name: tag.name,
      slug: tag.slug // Include slug
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
        slug: 1, // Include slug for section
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
        .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Include slug for section
        .populate<{ tags: ITag[] }>('tags', 'name slug') // Include slug for tags
        .populate<{ author: IAuthor }>('author', 'name') // Strict typing for author
        .exec();

      return {
        sectionId: section._id,
        sectionName: section.name,
        slug: section.slug, // Include slug for section
        totalViews: section.totalViews,
        latestArticle: latestArticle
          ? {
              slug: latestArticle.slug,
              id: latestArticle._id,
              title: latestArticle.title,
              author: {
                id: latestArticle.author._id,
                name: latestArticle.author.name
              },
              publishedAt: latestArticle.publishedAt,
              views: latestArticle.views,
              description: latestArticle.description,
              images: latestArticle.images,
              tags: latestArticle.tags.map((tag) => ({
                id: tag._id,
                name: tag.name,
                slug: tag.slug // Include slug for tags
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
