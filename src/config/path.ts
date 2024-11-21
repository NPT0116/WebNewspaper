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
  ARTICLE: {},
  API: {
    BASE: '/api',
    SECTION: {
      BASE: '/sections', // lấy list các sections
      DETAILS: '/:section', // lấy list các bài viết thuộc 1 section
      SLUG: '/:sectionSlug',
      SECTION_TREE: '/tree'
    },
    ARTICLE: {
      BASE: '/articles',
      DETAILS: '/:articleSlug',
      CREATE_ARTICLE: '/create',
      UPDATE_ARTICLE: '/:articleId/update',
      COMMENTS: '/:articleSlug/comments'
    },
    TAG: {
      BASE: '/tags'
    },
    UPLOAD: {
      BASE: '/upload-image'
    },
    LANDINGPAGE: {
      BASE: '/landingpage'
    },
    AUTHOR: {
      ARTICLE: '/author/articles'
    },
    // /api/reporter/section
    REPORTER: {
      SECTION: '/reporter/section',
      ARTICLE: '/reporter/:articleId',
      TAG: '/reporter/tag',
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
