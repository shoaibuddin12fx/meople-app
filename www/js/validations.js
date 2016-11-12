angular.module('starter.validations', [])
.directive('email', function($http, $q, $timeout) {
	return{
	
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
		  ctrl.$validators.email = function(modelValue, viewValue) {
			if (ctrl.$isEmpty(modelValue)) {
			  // consider empty models to be invalid
			  return true;
			}
			
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (re.test(viewValue)) {
			  // it is valid
			  return true;
			}
	
			// it is invalid
			return false;
		  };
		}
	
	}


})
.directive('minmax', function($http, $q, $timeout) {
	return{
	
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
		  ctrl.$validators.minmax = function(modelValue, viewValue) {
			if (ctrl.$isEmpty(modelValue)) {
			  // consider empty models to be invalid
			  return true;
			}
			
			if (viewValue.length > 2 || viewValue.length < 11 ) {
			  // it is valid
			  return true;
			}
	
			// it is invalid
			return false;
		  };
		}
	
	}

})
.directive('resize', function ($window) {
    return function (scope) {
        scope.width = $window.innerWidth;
        scope.height = $window.innerHeight;
        angular.element($window).bind('resize', function () {
            scope.$apply(function () {
                scope.width = $window.innerWidth;
                scope.height = $window.innerHeight;
            });
        });
        };
    })
;
