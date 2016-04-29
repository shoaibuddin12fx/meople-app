// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova','firebase', 'ngMap', 'ionic.contrib.ui.tinderCards', 'ionic-datepicker','ionic-timepicker', 'jett.ionic.filter.bar'])

.run(function($ionicPlatform) {
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar){
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
  });


})
.run(function($ionicPlatform, $cordovaSplashscreen, $ionicPopup, $rootScope, $cordovaNetwork) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 3500)  
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  
  $ionicConfigProvider.tabs.position('top');
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'      
      
  })
  .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
	  controller: 'mainCtrl'      
      
          
    })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
	  controller: 'AppCtrl'
    })
  .state('new-login', {
      url: '/new-login',
      templateUrl: 'templates/new-login.html',
	  controller: 'NewLoginCtrl'
    })
  .state('reset-password', {
      url: '/delete-login/:id',
      templateUrl: 'templates/del-login.html',
	  controller: 'DeleteLoginCtrl'
    })
  .state('delete-login', {
      url: '/delete-login',
      templateUrl: 'templates/del-login.html',
	  controller: 'DeleteLoginCtrl'
    })		
  .state('terms', {
      url: '/terms',
      templateUrl: 'templates/terms.html'	  
    })
   .state('app.profile', {
      url: '/profile',
	  views: {
        'menuContent': {
          templateUrl: 'templates/pre-profile.html',
		  controller: 'PreProfileCtrl'
		  }
      }
    })
  .state('app.profile-edit', {
      url: '/profile/edit',
	  views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
		  controller: 'ProfileCtrl'
		  }
      }
    })
  .state('app.profile-hobbies', {
      url: '/profile/edit/:hobbies',
	  views: {
        'menuContent': {
          templateUrl: 'templates/profile-hobbies.html',
		  controller: 'ProfileCtrl'
		  }
      }
    })  	
  .state('app.setting', {
      url: '/setting',
	  views: {
        'menuContent': {
          templateUrl: 'templates/setting.html',
		  controller: 'settingCtrl'
		  }
      }
    })
  .state('app.inbox', {
    url: '/inbox',
    views: {
      'menuContent': {
        templateUrl: 'templates/reference.html',
		controller: 'inboxCtrl'
      }
    }
  })
  .state('app.inboxprofile', {
    url: '/inbox/:uid',
    views: {
      'menuContent': {
        templateUrl: 'templates/publicprofile.html',
		controller: 'AddRequestCtrl'
      }
    }
  })
  .state('app.chatlist', {
    url: '/chat',
    views: {
      'menuContent': {
        templateUrl: 'templates/chatlist.html',
		controller: 'chatCtrl'
      }
    }
  })
 .state('app.chat', {
    url: '/chat/:uid',
    views: {
      'menuContent': {
        templateUrl: 'templates/chat.html',
		controller: 'ichatCtrl'
      }
    }
  })
  .state('app.td-cards', {
    url: '/td-cards',
    views: {
      'menuContent': {
        templateUrl: 'templates/td-cards.html',
		controller: 'cardsCtrl'
      }
    }
  })
  .state('app.activity-option', {
    url: '/activities',
    views: {
      'menuContent': {
        templateUrl: 'templates/activity-option.html',
		controller: 'ActOptionCtrl'
      }
    }
  })
  .state('app.activity-sent', {
    url: '/activities-sent/sent',
    views: {
      'menuContent': {
        templateUrl: 'templates/activities-push.html',
		controller: 'ActPushCtrl'
      }
    }
  })  
  .state('app.activities', {
    url: '/activities/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/activities.html',
		controller: 'ActCtrl'
      }
    }
  })
  .state('app.group-activities', {
    url: '/group-activities/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/group-search-activities.html',
		controller: 'GroupSearchActCtrl'
      }
    }
  })
  .state('app.group-activities-list', {
    url: '/group-activities-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/group-search-activities-list.html',
		controller: 'GroupSearchActCardCtrl'
      }
    }
  })  
  .state('app.search-activities', {
    url: '/activities-search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search-activities.html',
		controller: 'SearchActCtrl'
      }
    }
  })
  .state('app.search-activities-list', {
    url: '/activities-search/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/activities.html',
		controller: 'ActCtrl'
      }
    }
  })
  .state('app.create-activities', {
    url: '/create-activities/:type/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/create-activities.html',
		controller: 'CreateActCtrl'
      }
    }
  })
  .state('app.view-activities', {
    url: '/view-activities/:ackey',
    views: {
      'menuContent': {
        templateUrl: 'templates/view-activities.html',
		controller: 'ViewActCtrl'
      }
    }
  })
  .state('app.view-join-activities', {
    url: '/view-activities/:ackey/join',
    views: {
      'menuContent': {
        templateUrl: 'templates/view-join-activities.html',
		controller: 'ViewActCtrl'
      }
    }
  })

  .state('app.view-activities-group', {
    url: '/view-activities/:ackey/group/:uid',
    views: {
      'menuContent': {
        templateUrl: 'templates/view-activities-group.html',
		controller: 'ViewActGroupCtrl'
      }
    }
  })		
  .state('app.discover', {
    url: '/discover',
    views: {
      'menuContent': {
        templateUrl: 'templates/discover.html',
		controller: 'DiscoverCtrl'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
		controller: 'SearchCtrl'
      }
    }
  })
    .state('app.searchprofile', {
    url: '/search/:uid',
    views: {
      'menuContent': {
        templateUrl: 'templates/publicprofile.html',
		controller: 'PublicProfileCtrl'
      }
    }
  })
  .state('app.photo-like', {
    url: '/photo-like/:uid?picture',
    views: {
      'menuContent': {
        templateUrl: 'templates/photo-like.html',
		controller: 'photoCtrl'
      }
    }
  })
  .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');
});
