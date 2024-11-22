import { IAuthor, IReporterArticleDetailInfo } from '~/interfaces/Article/articleInterface.js';
import { ISection } from '~/interfaces/Section/sectionInterface.js';
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

export const findRootSectionBySlug = async (sectionSlug: string) => {
  return await Section.findOne({ slug: sectionSlug }).populate({
    path: 'childSections',
    populate: {
      path: 'childSections',
      populate: {
        path: 'childSections'
      }
    }
  });
};

export const collectSectionIds = (section: any): string[] => {
  const childIds = section.childSections?.map(collectSectionIds) || [];
  return [section._id.toString(), ...childIds.flat()];
};

export const countArticlesBySectionIds = async (sectionIds: string[]) => {
  return await Article.countDocuments({ sectionId: { $in: sectionIds } });
};

export const findArticlesBySectionIds = async (sectionIds: string[], skip: number, limit: number) => {
  return await Article.find({ sectionId: { $in: sectionIds } })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate<{ sectionId: ISection }>('sectionId', 'name slug')
    .populate<{ tags: ITag[] }>('tags', 'name slug')
    .populate<{ author: IAuthor }>('author', 'name');
};
