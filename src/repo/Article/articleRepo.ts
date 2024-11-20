import { IArticleBasicInfo, IReporterArticleDetailInfo } from '~/interfaces/Article/articleInterface.js';
import { ITag } from '~/interfaces/Tag/tagSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { AppError } from '~/utils/appError.js';

export const getArticlesBySectionId = async (sectionId: string): Promise<IArticleBasicInfo[]> => {
  const section = await Section.findById(sectionId);
  if (!section) {
    throw new AppError('Section not found', 404, []);
  }

  const tagList = await Tag.find({});

  const articles = await Article.find({ sectionId: sectionId }).populate({
    path: 'tags',
    select: 'name'
  });

  if (!articles) {
    throw new AppError('No articles found for this section', 404, []);
  }

  // Format the articles as IArticleBasicInfo
  const formattedArticles: IArticleBasicInfo[] = articles.map((article) => ({
    title: article.title,
    section: section.name, // Assuming section has a 'name' field
    tags: article.tags.map((tag) => {
      if (tag && (tag as unknown as ITag).name) {
        return (tag as unknown as ITag).name;
      }
      return ''; // Default if it's not an ITag
    }), // Map the tags to their 'name' property
    publishedAt: article.publishedAt || new Date(), // Ensure publishedAt is valid
    description: article.description || '', // Ensure description is valid
    coverImage: article.images.length > 0 ? article.images[0] : ''
  }));

  return formattedArticles;
};

export const reporterGetArticleById = async (articleId: string, reporterProfileId: string): Promise<IReporterArticleDetailInfo> => {
  const article = await Article.findById(articleId).populate({
    path: 'tags',
    select: 'name'
  });

  if (!article) {
    throw new AppError('Article not found', 404, []);
  }

  if (article.author.toString() !== reporterProfileId) {
    throw new AppError('No permission', 403, []);
  }

  const section = await Section.findById(article.sectionId);
  if (!section) {
    throw new AppError('Section not found', 404, []);
  }

  const formattedArticle: IReporterArticleDetailInfo = {
    title: article.title,
    description: article.description,
    content: article.content,
    images: article.images || [], // Assuming images is an array field
    videoUrl: article.videoUrl, // Optional field
    section: section.name, // Assuming sectionId is populated with the section name
    tags: article.tags.map((tag) => {
      if (tag && (tag as unknown as ITag).name) {
        return (tag as unknown as ITag).name;
      }
      return ''; // Default if it's not an ITag
    }), // Map the tags to their 'name' property
    publishedAt: article.publishedAt || undefined, // Optional field, if not set, will return undefined
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    layout: article.layout,
    status: article.status,
    bannerTheme: article.bannerTheme
  };

  return formattedArticle;
};
