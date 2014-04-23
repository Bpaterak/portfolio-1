'use strict';

/**
 * This entire site is coded in AngularJS. Inspect the code on GitHub: https://github.com/TCotton/portfolio
 */
angular.module('portfolioApp', ['AppConstants', 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngTouch', 'ngAnimate', 'HashBangURLs', 'portfolioAppConfig'])
  .config(function ($routeProvider, $httpProvider) {

    // Needed for CORS
    // http://better-inter.net/enabling-cors-in-angular-js/
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/work-projects', {
        templateUrl: 'views/my_work.html'
      })
      .when('/work-projects/:workPage', {
        templateUrl: 'views/work_page.html',
        controller: 'WorkPageCtrl'
      })
      .when('/side-projects', {
        templateUrl: 'views/side_projects.html'
      })
      .when('/side-projects/:projectsPage', {
        templateUrl: 'views/projects_page.html',
        controller: 'ProjectsPageCtrl'
      })
      .when('/about-me', {
        templateUrl: 'views/about_me.html'
      })
      .when('/contact-me', {
        templateUrl: 'views/contact_me.html',
        controller: 'FormCtrl as AdminFormCtrl'
      })
      .when('/blog/', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl'
      })
      .when('/blog/:blogId/:blogPage', {
        templateUrl: 'views/blog_page.html',
        controller: 'BlogArticleCtrl'
      })
      .when('/login', {
        templateUrl: 'views/admin/login.html',
        controller: 'LoginCtrl as AdminLogin'
      })
      .when('/admin/user-details', {
        templateUrl: 'views/admin/user_details.html',
        controller: 'UserDetailsCtrl as AdminUserDetailsCtrl'
      })
      .when('/admin/blog-details', {
        templateUrl: 'views/admin/blog_details.html',
        controller: 'EditBlogCtrl as AdminEditBlogCtrl'
      })
      .when('/admin/add-blog', {
        templateUrl: 'views/admin/add_blog.html',
        controller: 'AddBlogCtrl as AdminAddBlogCtrl'
      })
      .when('/admin/', {
        templateUrl: 'views/admin/admin.html'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
