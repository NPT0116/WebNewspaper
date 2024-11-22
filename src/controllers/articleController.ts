import { Article } from '~/models/Article/articleSchema.js';
import mongoose from 'mongoose';
import { Section } from '~/models/Section/sectionSchema.js';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '~/utils/appError.js';
import { reporterGetArticleById } from '~/repo/Article/articleRepo.js';
import { ObjectId } from 'mongoose';
import { getArticleByIdParams, IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { IAuthor, ISection, ITag } from './landingpage/articleDetail/articleDetailController.js';

interface ArticleQuery {
  search_value: string;
  pageNumber: string;
  pageSize: string;
  sectionId: string;
  tagId: string;
  authorId: string;
}

interface GetArticleByStatusQuery {
  status: string;
  pageNumber: string;
  pageSize: string;
}

interface getArticlesBySlugParams {
  sectionSlug: string;
}
export const articleQuery = async (req: Request<{}, {}, {}, ArticleQuery>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search_value, pageNumber, pageSize, sectionId, tagId, authorId } = req.query;

    let query: any = { status: 'published' };

    if (search_value) {
      query = {
        ...query,
        $or: [{ title: { $regex: search_value, $options: 'i' } }, { content: { $regex: search_value, $options: 'i' } }, { description: { $regex: search_value, $options: 'i' } }]
      };
    }
    if (sectionId) {
      query.sectionId = sectionId;
    }
    if (tagId) {
      query.tags = tagId;
    }
    if (authorId) {
      query.author = authorId;
    }

    const pageNum = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      next(new AppError('Invalid pagination parameters', 400));
      return;
    }

    const skip = (pageNum - 1) * size;

    // Lấy danh sách articles
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .populate<{ sectionId: ISection }>('sectionId', 'name slug')
      .populate<{ tags: ITag[] }>('tags', 'name slug')
      .populate<{ author: IAuthor }>('author', 'name');

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / size);

    if (skip >= totalArticles && skip !== 0) {
      next(new AppError('Page not found', 404));
      return;
    }

    // Chuyển dữ liệu bài viết thành định dạng IArticleCard
    const response: IArticleCard[] = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      sectionId: {
        name: article.sectionId.name,
        _id: article.sectionId._id,
        slug: article.sectionId.slug
      },
      tags: article.tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        _id: tag._id
      })),
      author: {
        name: article.author.name,
        _id: article.author._id
      },
      images: article.images
    }));

    res.json({
      data: response,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    next(new AppError(`Error querying articles: ${err}`, 500));
  }
};

export const getArticleByStatus = async (req: Request<{}, {}, {}, GetArticleByStatusQuery>, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Kiểm tra nếu có tham số tìm kiếm (search_value)
    const { status = 'published', pageNumber, pageSize } = req.query;
    const query: any = {};
    query.status = status;
    // Kiểm tra nếu có tham số phân trang
    const pageNum = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      next(new AppError('Invalid pagination parameters', 400));
      return;
    }

    const skip = (pageNum - 1) * size;

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .populate<{ sectionId: ISection }>('sectionId', 'name slug')
      .populate<{ tags: ITag[] }>('tags', 'name slug')
      .populate<{ author: IAuthor }>('author', 'name');

    // Chuyển dữ liệu bài viết thành định dạng IArticleCard
    const response: IArticleCard[] = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      sectionId: {
        name: article.sectionId.name,
        _id: article.sectionId._id,
        slug: article.sectionId.slug
      },
      tags: article.tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        _id: tag._id
      })),
      author: {
        name: article.author.name,
        _id: article.author._id
      },
      images: article.images
    }));

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / size);

    if (skip >= totalArticles && skip !== 0) {
      next(new AppError('Page not found', 404));
      return;
    }

    res.json({
      data: response,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    next(new AppError(`Error querying articles: ${err}`, 500));
  }
};

//Tìm kiếm bài viết theo sectionSlug
export const getArticlesBySectionSlug = async (req: Request<getArticlesBySlugParams>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sectionSlug } = req.params;

    // Cố định giá trị pageNumber và pageSize (Ví dụ: page 1, pageSize 5)
    const pageNum = parseInt(req.query.pageNumber as string) || 1;
    const size = 1;

    // Tìm root section dựa trên slug
    const rootSection = await Section.findOne({ slug: sectionSlug }).populate({
      path: 'childSections',
      populate: {
        path: 'childSections',
        populate: {
          path: 'childSections'
        }
      }
    });

    if (!rootSection) {
      next(new AppError('Section not found', 404));
      return;
    }

    // Thu thập tất cả các ID của rootSection và các childSections
    const collectSectionIds = (section: any): string[] => {
      const childIds = section.childSections?.map(collectSectionIds) || [];
      return [section._id.toString(), ...childIds.flat()];
    };
    const sectionIds = collectSectionIds(rootSection);

    // Xử lý phân trang
    const skip = (pageNum - 1) * size;
    const totalArticles = await Article.countDocuments({ sectionId: { $in: sectionIds } });
    const totalPages = Math.ceil(totalArticles / size);

    if (skip >= totalArticles && skip !== 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // Tìm bài viết dựa trên sectionIds
    const articles = await Article.find({ sectionId: { $in: sectionIds } })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(size)
      .populate<{ sectionId: ISection }>('sectionId', 'name slug')
      .populate<{ tags: ITag[] }>('tags', 'name slug')
      .populate<{ author: IAuthor }>('author', 'name');

    const response: IArticleCard[] = articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      sectionId: {
        _id: article.sectionId._id,
        name: article.sectionId.name,
        slug: article.sectionId.slug
      },
      tags: article.tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        _id: tag._id
      })),
      author: {
        name: article.author.name,
        _id: article.author._id
      },
      images: article.images
    }));

    // Render kết quả lên view
    res.render('pages/LandingPage/SectionPage/sectionPage', {
      section: rootSection,
      articles: response,
      pagination: {
        totalItems: totalArticles,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: size
      }
    });
  } catch (err) {
    next(new AppError('Internal server error', 500));
  }
};

export const reporterGetArticleByIdQuery = async (req: Request<getArticleByIdParams>, res: Response, next: NextFunction) => {
  try {
    const user = req.user as unknown as { profileId: ObjectId };
    const reporterProfileId = user.profileId;
    if (!reporterProfileId) {
      return next(new AppError('Profile not found', 400));
    }

    const { articleId } = req.params;
    const article = await reporterGetArticleById(articleId, reporterProfileId.toString());

    res.status(200).json(article);
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : 'Error fetching article';

    // If the error has a status code, use it, else default to 500
    next(new AppError(message, statusCode));
  }
};
