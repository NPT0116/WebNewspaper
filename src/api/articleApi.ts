import express, { Response, Request, NextFunction } from 'express';

const articleApiRouter = express.Router();

/**
 * GET /api/sections
    trả về menu section bao gồm đầy đủ tất cả các cấp
 */
// articleApiRouter.get('/:sectionId', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { sectionId } = req.params;

//     const articles = await getArticlesBySectionId(sectionId);

//     res.status(200).json(articles);
//   } catch (err) {
//     next(new AppError('Errors fetching articles of section', 500));
//   }
// });

export default articleApiRouter;
