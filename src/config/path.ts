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
