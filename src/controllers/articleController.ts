import { Article } from '~/models/Article/articleSchema.js';
import { Request, Response } from 'express';

export const articleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra nếu có tham số tìm kiếm (search_value)

    const { search_value, pageNumber, pageSize, sectionId, tagId, authorId } = req.query;

    let query: any = { status: 'published' };

    if (search_value) {
      query = {
        ...query, // Giữ lại điều kiện trạng thái
        $or: [{ title: { $regex: search_value, $options: 'i' } }, { content: { $regex: search_value, $options: 'i' } }]
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
    // Kiểm tra nếu có tham số phân trang
    const pageNum = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;

    if (isNaN(pageNum) || isNaN(size) || pageNum <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters' });
      return;
    }

    const skip = (pageNum - 1) * size;

    // Tìm các bài viết theo điều kiện tìm kiếm và phân trang
    const articles = await Article.find(query).skip(skip).limit(size);
    const totalArticleCount = await Article.countDocuments(query);

    if (skip > totalArticleCount) {
      console.log(skip);
      console.log(totalArticleCount);
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({
      totalItems: totalArticleCount,
      totalPages: Math.ceil(totalArticleCount / size),
      currentPage: pageNum,
      itemsPerPage: size,
      data: articles
    });
  } catch (err) {
    console.error('Error in article query and pagination:', err);
    res.status(500).json({ error: `Error querying articles: ${err}` });
  }
};

export const authorArticleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra nếu có tham số tìm kiếm (search_value)
    const { status } = req.query;
    const query: any = {};
    if (!status) {
      return;
    }
    query.status = status;
    const articles = await Article.find(query);

    res.json({
      data: articles
    });
  } catch (err) {
    res.status(500).json({ error: `Error querying articles: ${err}` });
  }
};
