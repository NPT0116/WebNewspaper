import { Request, Response, NextFunction } from 'express';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { ISectionBasicInfo, ISectionTree } from '~/interfaces/Section/sectionInterface.js';
import { countArticles, getListArticleInfoCards } from '~/repo/Article/articleRepo.js';
import { getAllSections, getSectionTree } from '~/repo/Section/index.js';
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
  sectionTree: ISectionTree | null;
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
    const sectionTree = await getSectionTree();

    const currentPageNumber = pageNumber ? parseInt(pageNumber as unknown as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as unknown as string, 10) : 10;
    const skip = (currentPageNumber - 1) * size;

    if (isNaN(currentPageNumber) || isNaN(size) || currentPageNumber <= 0 || size <= 0) {
      console.log('error');
      return;
    }

    let query: any = { status: 'published' };

    if (searchValue) {
      query = {
        ...query,
        $or: [
          { title: { $regex: `\\b${searchValue}\\b`, $options: 'i' } },
          { content: { $regex: `\\b${searchValue}\\b`, $options: 'i' } },
          { description: { $regex: `\\b${searchValue}\\b`, $options: 'i' } }
        ]
      };
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
      sectionTree,
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
