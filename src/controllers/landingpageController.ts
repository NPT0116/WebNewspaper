import { Request, Response, NextFunction } from 'express';
import { getLandingPageData } from '~/repo/Article/landingpage.js';
import { AppError } from '~/utils/appError.js';

export const getLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const data = await getLandingPageData();
    const data = {
      hotNews: {
        title: 'Breaking News: Kim Jong Un Meets World Leaders',
        summary: "In a historic meeting, Kim Jong Un has met with world leaders to discuss international relations. Here's what happened...",
        url: 'https://example.com/kim-jong-un-meets-world-leaders',
        author: 'John Doe', // Adding the author
        categories: ['Politics', 'International Relations'] // Adding categories
      },
      mostViewedArticles: [
        {
          title: 'How North Korea Has Evolved Over the Decades',
          summary: 'A deep dive into the history of North Korea and how it has evolved over the past 70 years.',
          url: 'https://example.com/north-korea-history',
          author: 'Jane Smith',
          categories: ['History', 'Politics']
        },
        {
          title: 'The Impact of Technology in North Korea',
          summary: 'Exploring how technology is changing the landscape in North Korea.',
          url: 'https://example.com/north-korea-technology',
          author: 'Mark Johnson',
          categories: ['Technology', 'Society']
        },
        {
          title: 'North Korean Defectors: A Look Into Their Lives',
          summary: 'What happens to North Korean defectors after they escape the regime? A detailed exploration.',
          url: 'https://example.com/north-korea-defectors',
          author: 'Emily Davis',
          categories: ['Defectors', 'Politics']
        },
        {
          title: 'The Secretive World of North Korean Military',
          summary: "Inside the secretive world of North Korea's military and its global implications.",
          url: 'https://example.com/north-korea-military',
          author: 'Sam Lee',
          categories: ['Military', 'Politics']
        },
        {
          title: 'Kim Jong Un’s Vision for the Future of North Korea',
          summary: "An in-depth look at Kim Jong Un's policies and his vision for the future of North Korea.",
          url: 'https://example.com/kim-jong-un-vision',
          author: 'Chris Brown',
          categories: ['Politics', 'Leadership']
        }
      ],
      latestArticles: [
        {
          title: 'North Korea and the Global Economy',
          summary: 'How North Korea’s economic policies are affecting global trade.',
          url: 'https://example.com/north-korea-global-economy',
          author: 'David Wilson',
          categories: ['Economy', 'Global Trade']
        },
        {
          title: 'Inside the Kim Family: Secrets and Scandals',
          summary: 'Exploring the secrets of the Kim family and the controversies surrounding them.',
          url: 'https://example.com/kim-family-secrets',
          author: 'Lisa White',
          categories: ['Family', 'Politics']
        },
        {
          title: 'North Korea’s Space Program: The Final Frontier',
          summary: 'A look into North Korea’s ambitious space program and its potential global consequences.',
          url: 'https://example.com/north-korea-space-program',
          author: 'Tom Harris',
          categories: ['Space', 'Politics']
        },
        {
          title: 'North Korean Cuisine: A Cultural Journey',
          summary: 'Exploring the unique and traditional dishes from North Korea.',
          url: 'https://example.com/north-korean-cuisine',
          author: 'Rachel Green',
          categories: ['Culture', 'Food']
        },
        {
          title: 'The Role of Women in North Korean Society',
          summary: 'A detailed look at the role of women in North Korea’s society and politics.',
          url: 'https://example.com/women-in-north-korea',
          author: 'Jessica Taylor',
          categories: ['Women', 'Politics']
        }
      ],
      topSections: [
        {
          title: 'North Korean Politics',
          summary: 'Exploring the political landscape in North Korea and the figures shaping its future.',
          url: 'https://example.com/north-korean-politics',
          author: 'George King',
          categories: ['Politics', 'Governance']
        },
        {
          title: 'Cultural Shifts in North Korea',
          summary: 'An examination of the changing cultural dynamics within North Korea.',
          url: 'https://example.com/cultural-shifts',
          author: 'Helen Carter',
          categories: ['Culture', 'Politics']
        },
        {
          title: 'The Role of Media in North Korean Society',
          summary: 'How the government controls media in North Korea and its impact on society.',
          url: 'https://example.com/media-in-north-korea',
          author: 'Anna Parker',
          categories: ['Media', 'Politics']
        },
        {
          title: 'Education in North Korea: The State’s Influence',
          summary: 'Understanding the education system in North Korea and how it serves the regime.',
          url: 'https://example.com/education-north-korea',
          author: 'Brian Clark',
          categories: ['Education', 'Politics']
        },
        {
          title: 'Military Parades in North Korea: A Symbol of Power',
          summary: 'Analyzing the role of military parades in North Korea as a symbol of strength and unity.',
          url: 'https://example.com/north-korea-military-parades',
          author: 'Karen King',
          categories: ['Military', 'Politics']
        }
      ]
    };

    res.render('layouts/LandingPageLayout/LandingPageLayout', {
      body: '../../pages/LandingPage/LandingPage',
      data
    });
  } catch (error) {
    console.error(error);
    next(new AppError('Error fetching landing page data.', 500));
  }
};
