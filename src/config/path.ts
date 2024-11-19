export const PATH = {
  HOME: '/',
  ACCOUNT: {
    BASE: '/account',
    OUTLET: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      GITHUB: {
        LOGIN: '/github/login',
        CALLBACK: '/github/login/callback'
      }
    }
  },

  API: {
    BASE: '/api',
    SECTION: {
      BASE: '/sections', // lấy list các sections
      DETAILS: '/:section', // lấy list các bài viết thuộc 1 section
      ARTICLE: '/:sectionId',
      SECTION_TREE: '/tree'
    },
    ARTICLE: {
      BASE: '/articles',
      DETAILS: '/:articleSlug',
      CREATE_ARTICLE: '/create',
      UPDATE_ARTICLE: '/:articleId/update'
    },
    TAG: {
      BASE: '/tags'
    },
    UPLOAD: {
      BASE: '/upload-image'
    },
    AUTHOR: {
      ARTICLE: '/author/articles'
    },
    REPORTER: {
      BASE: '/:reporterId',
      SECTION: '/:reporterId/section',
      TAG: '/:reporterId/tag',
      QUERY: '/query'
    }
  },
  POST: {
    PATH: '/post',
    OUTLET: {
      edit: '/edit',
      detail: '/:id'
    }
  }
};
