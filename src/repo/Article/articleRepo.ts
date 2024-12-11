import mongoose from 'mongoose';
import { IArticleBasicInfo, IArticleCard, IAuthor, IReporterArticleDetailInfo, ISection } from '~/interfaces/Article/articleInterface.js';
import { IReaderProfile } from '~/interfaces/Profile/profileBaseInterface.js';
import { ITag } from '~/interfaces/Tag/tagSchema.js';
import { Article } from '~/models/Article/articleSchema.js';
import { EditorProfile } from '~/models/Profile/editorProfile.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import { ReporterProfile } from '~/models/Profile/reporterProfile.js';
import { Section } from '~/models/Section/sectionSchema.js';
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
    _id: article._id,
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
    publishedAt: article.approved.publishedAt || undefined, // Optional field, if not set, will return undefined
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    layout: article.layout,
    status: article.status,
    bannerTheme: article.bannerTheme
  };

  return formattedArticle;
};

export const editorGetArticleById = async (articleId: string, reporterProfileId: string): Promise<IReporterArticleDetailInfo> => {
  const article = await Article.findById(articleId).populate({
    path: 'tags',
    select: 'name'
  });

  if (!article) {
    throw new AppError('Article not found', 404, []);
  }
  console.log(article.sectionId);
  // if (article.author.toString() !== reporterProfileId) {
  //   throw new AppError('No permission', 403, []);
  // }

  const section = await Section.findById(article.sectionId);
  if (!section) {
    throw new AppError('Section not found', 404, []);
  }

  const formattedArticle: IReporterArticleDetailInfo = {
    _id: article._id,
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
    publishedAt: article.approved.publishedAt || undefined, // Optional field, if not set, will return undefined
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    layout: article.layout,
    status: article.status,
    bannerTheme: article.bannerTheme
  };

  return formattedArticle;
};

export const getAllArticles = async () => {
  return await Article.find({})
    .populate({
      path: 'rejected.editorId',
      select: 'name',
      model: 'EditorProfile'
    })
    .populate({
      path: 'approved.editorId',
      select: 'name',
      model: 'EditorProfile'
    });
};

export const getListArticleInfoCards = async (query: any, skip: number, limit: number): Promise<IArticleCard[]> => {
  try {
    const articles = await Article.find(query)
      .skip(skip)
      .limit(limit)
      .populate<{ sectionId: ISection }>('sectionId', 'name slug') // Include slug for section
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
        images: article.images,
        publishedAt: article.approved.publishedAt,
        isSubscribed: article.isSubscribed
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

export const profileReaderFindArticlesByIds = async (readerProfile: IReaderProfile, limit: number) => {
  // Lấy danh sách watchedArticles từ readerProfile, đã được sắp xếp theo viewedAt (giảm dần)
  const watchedArticles = readerProfile.watchedArticles.sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime());

  // Lấy 10 bài viết gần đây nhất
  const recentWatchedArticles = watchedArticles.slice(0, limit);
  const recentArticleIds = recentWatchedArticles.map((watchedArticle) => watchedArticle.articleId.toString());

  // Tìm các bài viết từ bảng Article dựa trên các articleId
  const articles = await Article.find({ _id: { $in: recentArticleIds.map((id) => new mongoose.Types.ObjectId(id)) } })
    .populate<{ sectionId: ISection }>('sectionId', 'name slug')
    .populate<{ tags: ITag[] }>('tags', 'name slug')
    .populate<{ author: IAuthor }>('author', 'name');

  // Sắp xếp lại các bài viết theo thứ tự trong watchedArticles
  const articlesSorted = recentWatchedArticles
    .map((watchedArticle) => {
      const article = articles.find((article) => article._id.toString() === watchedArticle.articleId.toString());
      return article;
    })
    .filter((article) => article !== undefined); // Loại bỏ các giá trị undefined nếu không tìm thấy bài viết

  // Trả về các bài viết đã sắp xếp
  return articlesSorted;
};

export const getArticleByReporterId = async (reporterId: mongoose.Types.ObjectId) => {
  const articles = await Article.find({ author: reporterId }).populate({
    path: 'rejected.editorId',
    select: 'name',
    model: 'EditorProfile'
  });
  return articles;
};

export const getArticleByEditorId = async (editorId: mongoose.Types.ObjectId) => {
  const editorProfile = await EditorProfile.findById(editorId);
  const editorSectionId = editorProfile?.sectionId;
  console.log(editorProfile);

  const articles = await Article.find({ sectionId: editorSectionId, status: { $ne: 'draft' } });
  return articles;
};

export const getApprovedArticle = async () => {
  return await Article.find({ status: 'approved' });
};

export const updateArticleStatus = async (articleId: mongoose.Types.ObjectId, status: 'draft' | 'approved' | 'rejected' | 'published' | 'pending') => {
  const article = await Article.findById(articleId);
  if (!article) {
    throw new AppError('Article not found', 404, []);
  }
  article.publishedAt = new Date();
  article.status = status;
  await article.save();
};

export const deleteArticle = async (articleId: mongoose.Types.ObjectId) => {
  const article = await Article.findByIdAndDelete(articleId);
  if (!article) {
    return 0;
  }
  if (article.status === 'approved' || article.status === 'published' || article.status === 'rejected') {
    if (article.approved?.editorId) {
      await EditorProfile.updateOne({ _id: article.approved.editorId }, { $pull: { editArticles: articleId } });
    }

    if (article.rejected?.editorId) {
      await EditorProfile.updateOne({ _id: article.rejected.editorId }, { $pull: { editArticles: articleId } });
    }
  }

  await ReporterProfile.updateOne({ _id: article.author }, { $pull: { reportArticles: articleId } });
  await ReaderProfile.updateMany({ 'watchedArticles.articleId': articleId }, { $pull: { watchedArticles: { articleId: articleId } } });
  return 1;
};

export const changeSubscriptionArticle = async (articleId: mongoose.Types.ObjectId) => {
  const article = await Article.findById(articleId);
  if (!article) {
    throw new AppError('Article not found', 404, []);
  }
  article.isSubscribed = !article.isSubscribed;
  await article.save();
};
