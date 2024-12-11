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
        REPORTERS: {
          PATH: '/reporters',
          CREATE_REPORTER: '/create-reporter',
          UPDATE_REPORTER: '/update-reporter',
          DELETE_REPORTER: '/delete-reporter/:reporterId'
        },
        EDITORS: {
          PATH: '/editors',
          CREATE_EDITOR: '/create-editor',
          UPDATE_EDITOR: '/update-editor',
          DELETE_EDITOR: '/delete-editor/:editorId'
        },
        READERS: {
          PATH: '/readers',
          UPGRADE_READER: '/upgrade-reader/:_id'
        }
      },
      ARTICLES: {
        PATH: '/',
        APPROVE: '/:articleId/approve',
        SUBSCRIPTION: '/:articleId/subscription',
        DELETE: '/:articleId/delete'
      },
      SECTION: {
        PATH: '/sections',
        CREATE_SECTION: '/create-section',
        UPDATE_SECTION: '/update-section',
        DELETE_SECTION: '/delete-section/:sectionId'
      },
      TAGS: {
        PATH: '/tags',
        CREATE_TAG: '/create-tag',
        UPDATE_TAG: '/update-tag',
        DELETE_TAG: '/delete-tag/:tagId'
      }
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
