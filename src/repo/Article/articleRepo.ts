import { IArticleBasicInfo, IArticleCard, IAuthor, IReporterArticleDetailInfo, ISection } from '~/interfaces/Article/articleInterface.js';
import { ITag } from '~/interfaces/Tag/tagSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { Tag } from '~/models/Tag/tagSchema.js';
import { AppError } from '~/utils/appError.js';

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

export const getAllArticles = async () => {
  return await Article.find({});
};

export const getListArticleInfoCards = async (query: any, skip: number, limit: number): Promise<IArticleCard[]> => {
  try {
    const articles = await Article.find(query)
      .skip(skip)
      .limit(limit)
      .populate<{ sectionId: ISection }>('sectionId', 'name') // Include slug for section
      .populate<{ tags: ITag[] }>('tags', 'name slug') // Include slug for tags
      .populate<{ author: IAuthor }>('author', 'name') // Strict typing for author
      .exec();

    const formattedArticle: IArticleCard[] = articles.map((article) => {
      return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        sectionId: article.sectionId,
        tags: article.tags,
        author: article.author,
        images: article.images
      };
    });

    return formattedArticle;
  } catch (error) {
    throw new AppError('Error get articles', 404);
  }
};

export const countArticles = async (query: any): Promise<number> => {
  try {
    const articlesCount = await Article.countDocuments(query);
    if (!articlesCount) {
      return 0;
    }

    return articlesCount;
  } catch (error) {
    throw new AppError('Error get articles count', 404);
  }
};
