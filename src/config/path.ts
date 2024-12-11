export const PATH = {
  HOME: '/',
  LANDINGPAGE: {
    SEARCH_PAGE: '/search-page',
    SECTION: '/section/:sectionSlug',
    ARTICLE_DETAIL: '/section/:sectionSlug/article/:articleSlug',
    PROFILE: '/profile',
    WATCHED_ARTICLE: '/profile/watched-articles',
    SAVE_COMMENT: '/section/:sectionSlug/article/:articleSlug/save-comment'
  },
  DASHBOARD: {
    PATH: '/dashboard',
    PREVIEW: '/:articleId/preview',
    REPORTER: {
      PATH: '/reporter',
      WRITE_ARTICLE: '/write-article/:articleId',
      SAVE_ARTICLE: '/write-article/:articleId/save',
      CREATE_ARTICLE: '/create-article',
      SUBMIT_ARTICLE: '/:articleId/submit',
      DELETE: '/:articleId/delete'
    },
    EDITOR: {
      PATH: '/editor',
      PREVIEW: '/:articleId/preview',
      APPROVE: '/:articleId/approve',
      DELETE: '/:articleId/delete'
    },
    ADMIN: {
      PATH: '/admin',
      USERS: {
        PATH: '/users',
        REPORTERS: '/reporters',
        EDITORS: '/editors',
        READERS: {
          PATH: '/readers',
          UPGRADE_READER: '/upgrade-reader/:_id'
        }
      },
      ARTICLES: {
        PATH: '/',
        DELETE: '/:articleId/delete'
      },
      SECTION: '/sections',
      TAGS: '/tags'
    }
  },
  AUTHENTICATION: {
    LOGIN: '/login',
    REGISTER: '/register',
    GITHUB: '/login/github',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/login/forgot-password',
    SEND_OTP: '/login/send-otp',
    GITHUB_CALLBACK: '/login/github/callback'
  }
};
