export const PATH = {
  HOME: '/',
  LANDINGPAGE: {
    SEARCH_PAGE: '/search-page',
    SECTION: '/section/:sectionSlug',
    ARTICLE_DETAIL: '/section/:sectionSlug/article/:articleSlug'
  },
  DASHBOARD: {
    PATH: '/dashboard',
    REPORTER: {
      PATH: '/reporter',
      WRITE_ARTICLE: '/write-article/:articleId',
      SAVE_ARTICLE: '/write-article/:articleId/save',
      CREATE_ARTICLE: '/create-article'
    },
    EDITOR: {
      PATH: '/editor',
      PREVIEW: '/:articleId/preview',
      APPROVE: '/:articleId/approve'
    },
    ADMIN: {
      PATH: '/admin',
      USERS: {
        PATH: '/users',
        REPORTERS: '/reporters',
        EDITORS: '/editors',
        READERS: '/readers'
      }
    }
  },
  AUTHENTICATION: {
    LOGIN: '/login',
    REGISTER: '/register',
    GITHUB: '/login/github',
    LOGOUT: '/logout',
    GITHUB_CALLBACK: '/login/github/callback'
  }
};
