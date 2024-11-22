import { Request, Response, NextFunction } from 'express';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { ISectionBasicInfo } from '~/interfaces/Section/sectionInterface.js';
import { countArticles, getListArticleInfoCards } from '~/repo/Article/articleRepo.js';
import { getAllSections } from '~/repo/Section/index.js';
import { AppError } from '~/utils/appError.js';

interface ISearchPageRequestQuery {
  time: string;
  searchValue: string;
  sections: string[];
  pageNumber: number;
  pageSize: number;
}

interface ISearchPageData {
  body: string;
  sections: ISectionBasicInfo[];
  time: string;
  searchValue: string;
  selectedSections: string[];
  articles: IArticleCard[];
  pagination: {
    pageSize: number;
    currentPageNumber: number;
    totalPagesCount: number;
    totalArticlesCount: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export const getSearchPage = async (req: Request<{}, {}, {}, ISearchPageRequestQuery>, res: Response, next: NextFunction) => {
  try {
    const { time = 'all', searchValue = '', sections = [], pageNumber, pageSize } = req.query;

    const selectedSections = Array.isArray(sections) ? sections : [sections].filter(Boolean);
    const allSections = await getAllSections();

    const currentPageNumber = pageNumber ? parseInt(pageNumber as unknown as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as unknown as string, 10) : 10;
    const skip = (currentPageNumber - 1) * size;

    if (isNaN(currentPageNumber) || isNaN(size) || currentPageNumber <= 0 || size <= 0) {
      console.log('error');
      return;
    }

    let query: any = { status: 'published' };

    if (typeof searchValue === 'string') {
      const searchTokens = searchValue.split(/\s+/); // Split by spaces
      query = {
        ...query,
        $or: searchTokens.map((token) => ({
          $or: [{ title: { $regex: token, $options: 'i' } }, { content: { $regex: token, $options: 'i' } }]
        }))
      };
    } else if (Array.isArray(searchValue)) {
      const searchTokens = (searchValue as string[]).join(' ').split(/\s+/); // Join array elements and split
      query = {
        ...query,
        $or: searchTokens.map((token: any) => ({
          $or: [{ title: { $regex: token, $options: 'i' } }, { content: { $regex: token, $options: 'i' } }]
        }))
      };
    } else {
      console.log('Invalid search value');
    }

    if (selectedSections.length > 0 && selectedSections[0] !== 'Any') {
      query = {
        ...query,
        sectionId: { $in: selectedSections }
      };
    }

    const currentDate = new Date();
    if (time === 'latest') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 1)) } }; // last 24 hours
    } else if (time === 'last-week') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) } }; // last 7 days
    } else if (time === 'last-month') {
      query = { ...query, publishedAt: { $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)) } }; // last 30 days
    }

    const articles = await getListArticleInfoCards(query, skip, size);
    const totalArticlesCount = await countArticles(query);
    const totalPagesCount = Math.ceil(totalArticlesCount / size);
    if (skip > totalArticlesCount) {
      console.log(skip);
      console.log(totalArticlesCount);
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const searchPageData: ISearchPageData = {
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
    };

    res.render('layouts/SearchPageLayout/SearchPageLayout', searchPageData);
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching search page data.', 500));
  }
};
