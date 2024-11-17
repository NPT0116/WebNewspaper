export const PATH = {
  HOME: '/',
  ACCOUNT: {
    PATH: '/account',
    OUTLET: {
      login: '/login',
      register: '/register',
      logout: '/logout',
      github: '/github/login',
      githubCallback: '/github/login/callback'
    }
  },
  POST: {
    PATH: '/post',
    OUTLET: {
      detail: '/:id'
    }
  }
};
