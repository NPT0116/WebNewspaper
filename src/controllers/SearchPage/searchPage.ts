import { Request, Response, NextFunction } from 'express';
import { Article } from '~/models/Article/articleSchema.js';
import { countArticles, getListArticleInfoCards } from '~/repo/Article/articleRepo.js';
import { getAllSections, getSectionSlug } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

export const getSearchPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { time = 'all', searchValue = '', sections = [], pageNumber, pageSize } = req.query;

    // Parse `sections` into an array if it's passed as a single string
    const selectedSections = Array.isArray(sections) ? sections : [sections].filter(Boolean);

    // Fetch all available sections
    const allSections = await getAllSections();

    const currentPageNumber = pageNumber ? parseInt(pageNumber as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as string, 10) : 10;
    const skip = (currentPageNumber - 1) * size;

    if (isNaN(currentPageNumber) || isNaN(size) || currentPageNumber <= 0 || size <= 0) {
      console.log('error');
      return;
    }

    // Fetch filtered articles based on the query (search, section, and time logic can be added here)
    let query: any = { status: 'published' };

    if (typeof searchValue === 'string') {
      // Proceed with the string operations
      const searchTokens = searchValue.split(/\s+/); // Split by spaces
      query = {
        ...query,
        $or: searchTokens.map((token) => ({
          $or: [{ title: { $regex: token, $options: 'i' } }, { content: { $regex: token, $options: 'i' } }]
        }))
      };
    } else if (Array.isArray(searchValue)) {
      // If searchValue is an array, process each element
      const searchTokens = searchValue.join(' ').split(/\s+/); // Join array elements and split
      query = {
        ...query,
        $or: searchTokens.map((token) => ({
          $or: [{ title: { $regex: token, $options: 'i' } }, { content: { $regex: token, $options: 'i' } }]
        }))
      };
    } else {
      // Handle cases where searchValue is neither string nor array
      console.log('Invalid search value');
    }

    if (selectedSections.length > 0 && selectedSections[0] !== 'Any') {
      query = {
        ...query,
        sectionId: { $in: selectedSections }
      };
    }

    const articles = await getListArticleInfoCards(query, skip, size);
    const totalArticlesCount = await countArticles(query);
    if (skip > totalArticlesCount) {
      console.log(skip);
      console.log(totalArticlesCount);
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const currentDate = new Date();
    if (time === 'latest') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 1)) } }; // last 24 hours
    } else if (time === 'last-week') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) } }; // last 7 days
    } else if (time === 'last-month') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)) } }; // last 30 days
    }

    const totalPagesCount = Math.ceil(totalArticlesCount / size);
    res.render('layouts/SearchPageLayout/SearchPageLayout', {
      body: '../../pages/SearchPage/SearchPage',
      sections: allSections,
      time,
      searchValue,
      selectedSections,
      articles,
      pagination: {
        pageSize: size,
        currentPageNumber,
        totalPagesCount,
        totalArticlesCount,
        hasPrevPage: currentPageNumber > 1,
        hasNextPage: currentPageNumber < totalPagesCount,
        prevPage: currentPageNumber > 1 ? currentPageNumber - 1 : null,
        nextPage: currentPageNumber < totalPagesCount ? currentPageNumber + 1 : null
      }
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching search page data.', 500));
  }
};
