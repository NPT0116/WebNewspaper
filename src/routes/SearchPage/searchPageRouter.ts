import express from 'express';
import { PATH } from '~/config/path.js';
import { getSearchPage } from '~/controllers/SearchPage/searchPage.js';

const searchPageRouter = express.Router();

searchPageRouter.get(PATH.LANDINGPAGE.SEARCH_PAGE, getSearchPage);

export default searchPageRouter;
