import { Request, Response, NextFunction } from 'express';
import { IArticleCard } from '~/interfaces/Article/articleInterface.js';
import { ISectionBasicInfo, ISectionTree } from '~/interfaces/Section/sectionInterface.js';
import { Section } from '~/models/Section/sectionSchema.js';
import { countArticles, getListArticleInfoCards } from '~/repo/Article/articleRepo.js';
import { getAllSections, getSectionTree } from '~/repo/Section/index.js';
import { getAllTags, getTagIdBySlug, ITagBasicInfo } from '~/repo/Tag/index.js';
import { AppError } from '~/utils/appError.js';

interface ISearchPageRequestQuery {
  time: string;
  searchValue: string;
  sections: string[];
  pageNumber: number;
  pageSize: number;
  tags: string;
}

interface ISearchPageData {
  body: string;
  sections: ISectionBasicInfo[];
  time: string;
  searchValue: string;
  selectedSections: string[];
  selectedTags: string[];
  articles: IArticleCard[];
  sectionTree: ISectionTree | null;
  allTags: ITagBasicInfo[];
  pagination: {
    pageSize: number;
    currentPageNumber: number;
    selectedSectionsName: string[];
    totalPagesCount: number;
    totalArticlesCount: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

// Helper function to escape special characters for regex
const escapeRegex = (string: string) => {
  if (!string) return ''; // Return empty string if searchValue is invalid
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
};

// List of stop words
const stopWords = [
  'a',
  'about',
  'above',
  'after',
  'again',
  'against',
  'all',
  'am',
  'an',
  'and',
  'any',
  'are',
  "aren't",
  'as',
  'at',
  'be',
  'because',
  'been',
  'before',
  'being',
  'below',
  'between',
  'both',
  'but',
  'by',
  "can't",
  'cannot',
  'could',
  "couldn't",
  'did',
  "didn't",
  'do',
  'does',
  "doesn't",
  'doing',
  "don't",
  'down',
  'during',
  'each',
  'few',
  'for',
  'from',
  'further',
  'had',
  "hadn't",
  'has',
  "hasn't",
  'have',
  "haven't",
  'having',
  'he',
  "he'd",
  "he'll",
  "he's",
  'her',
  'here',
  "here's",
  'hers',
  'herself',
  'him',
  'himself',
  'his',
  'how',
  "how's",
  'i',
  "i'd",
  "i'll",
  "i'm",
  "i've",
  'if',
  'in',
  'into',
  'is',
  "isn't",
  'it',
  "it's",
  'its',
  'itself',
  "let's",
  'me',
  'more',
  'most',
  "mustn't",
  'my',
  'myself',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'on',
  'once',
  'only',
  'or',
  'other',
  'ought',
  'our',
  'ours',
  'ourselves',
  'out',
  'over',
  'own',
  'same',
  "shan't",
  'she',
  "she'd",
  "she'll",
  "she's",
  'should',
  "shouldn't",
  'so',
  'some',
  'such',
  'than',
  'that',
  "that's",
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'there',
  "there's",
  'these',
  'they',
  "they'd",
  "they'll",
  "they're",
  "they've",
  'this',
  'those',
  'through',
  'to',
  'too',
  'under',
  'until',
  'up',
  'very',
  'was',
  "wasn't",
  'we',
  "we'd",
  "we'll",
  "we're",
  "we've",
  'were',
  "weren't",
  'what',
  "what's",
  'when',
  "when's",
  'where',
  "where's",
  'which',
  'while',
  'who',
  "who's",
  'whom',
  'why',
  "why's",
  'with',
  "won't",
  'would',
  "wouldn't",
  'you',
  "you'd",
  "you'll",
  "you're",
  "you've",
  'your',
  'yours',
  'yourself',
  'yourselves'
];

const containsOnlyStopWords = (value: string) => {
  const words = value.toLowerCase().split(/\s+/); // Split value into words
  return words.every((word) => stopWords.includes(word)); // Check if each word is a stop word
};

export const getSearchPage = async (req: Request<{}, {}, {}, ISearchPageRequestQuery>, res: Response, next: NextFunction) => {
  try {
    const { time = 'all', searchValue = '', sections = [], pageNumber, pageSize, tags } = req.query;

    let tagSlugList: string[] = [];
    if (tags && tags.length > 0) {
      tagSlugList = tags.split(', ');
    }

    const selectedSections = Array.isArray(sections) ? sections : [sections].filter(Boolean);
    const selectedSectionsName = [];
    const selectedTags = Array.isArray(tagSlugList) ? tagSlugList : [tagSlugList].filter(Boolean);
    const allSections = await getAllSections();
    const sectionTree = await getSectionTree();
    const allTags = await getAllTags();

    const currentPageNumber = pageNumber ? parseInt(pageNumber as unknown as string, 10) : 1;
    const size = pageSize ? parseInt(pageSize as unknown as string, 10) : 10;
    const skip = (currentPageNumber - 1) * size;

    if (isNaN(currentPageNumber) || isNaN(size) || currentPageNumber <= 0 || size <= 0) {
      res.status(400).json({ error: 'Invalid pagination parameters.' });
      return;
    }

    // Build query
    let query: any = { status: 'published' };
    const isStopWordSearch = containsOnlyStopWords(searchValue);

    if (searchValue) {
      const escapedSearchValue = escapeRegex(searchValue); // Escape the search value

      if (isStopWordSearch) {
        query = {
          ...query,
          $or: [
            { title: { $regex: `\\b${escapedSearchValue}\\b`, $options: 'i' } },
            { description: { $regex: `\\b${escapedSearchValue}\\b`, $options: 'i' } },
            { content: { $regex: `\\b${escapedSearchValue}\\b`, $options: 'i' } }
          ]
        };
      } else {
        // If it's not a stop word, use full-text search
        console.log('full text');
        query = {
          ...query,
          $text: { $search: searchValue }
        };
      }
    }

    // Filter by sections
    if (selectedSections.length > 0 && selectedSections[0] !== 'Any') {
      for (const sectionId of selectedSections) {
        const section = await Section.findById(sectionId);
        if (!section) {
          console.log('Error getting section by ' + section);
        }
        section?.childSections?.forEach((childSection) => selectedSections.push(childSection.toString()));
        selectedSectionsName.push(section?.name);
      }
      query.sectionId = { $in: selectedSections };
    }

    if (tagSlugList.length > 0) {
      const tagList: string[] = [];
      for (const tagSlug of tagSlugList) {
        const tagId = await getTagIdBySlug(tagSlug);
        tagList.push(tagId);
      }
      query.tags = { $all: tagList };
    }

    // Filter by time
    const currentDate = new Date();
    if (time === 'latest') {
      query.publishedAt = { $gte: new Date(currentDate.setDate(currentDate.getDate() - 1)) };
    } else if (time === 'last-week') {
      query.publishedAt = { $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)) };
    } else if (time === 'last-month') {
      query.publishedAt = { $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)) };
    }

    console.log('Constructed Query:', JSON.stringify(query, null, 2));

    // Fetch articles and pagination data
    const articles = await getListArticleInfoCards(query, skip, size);
    const totalArticlesCount = await countArticles(query);
    const totalPagesCount = Math.ceil(totalArticlesCount / size);

    if (skip > totalArticlesCount) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const searchPageData: ISearchPageData = {
      body: '../../pages/SearchPage/SearchPage',
      sections: allSections,
      time,
      searchValue,
      selectedSections,
      selectedSectionsName,
      selectedTags,
      articles,
      sectionTree,
      allTags,
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
    console.error('Error in getSearchPage:', error);
    next(new AppError('Error fetching search page data.', 500));
  }
};
