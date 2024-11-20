import { IArticleBasicInfo } from '~/interfaces/Article/articleInterface.js';
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
    tags: article.tags ? article.tags.map((tag) => tag.name) : [], // Handle empty or missing tags
    publishedAt: article.publishedAt || new Date(), // Ensure publishedAt is valid
    description: article.description || '', // Ensure description is valid
    coverImage: article.images.length > 0 ? article.images[0] : ''
  }));

  return formattedArticles;
};
