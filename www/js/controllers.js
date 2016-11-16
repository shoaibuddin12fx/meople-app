angular.module('starter.controllers', [])

.controller('mainCtrl', function($scope,$ionicPlatform, $ionicModal,$ionicLoading, $timeout, $state, $window, $ionicHistory, createDBentry, authlogin, getProfileInfo, $cordovaNetwork, $q) {

  	var verify = authlogin.verify();

	if (verify) {
	  $state.go('app.profile');
    } else {
	  $scope.loginSuccessful = function(){
		  $ionicLoading.hide();
			$scope.NetworkMsg = "Login successful ! ... redirecting";
			$timeout(function() {$state.go('app.profile');}, 2000);
		  }
	  $scope.loginFailed= function(){
		  $ionicLoading.hide();
			$scope.NetworkMsg = "Login Failed!";
			$scope.Signin = "Sign in";
		  }

	  $scope.sociallogin = function(social){
		     $ionicLoading.show({
				  template: 'loading ...'
				});
			  $timeout(function() {
			  authlogin.sociallogin(social, $q)
			  .then(function(authData){
				  createDBentry.socialEntry(authData, social, $q)
				  .then($scope.loginSuccessful);
				  },$scope.loginFailed);

			  })

	  }// sociallogin function ends



    }

})
.controller('AppCtrl', function($scope,$ionicPlatform, $ionicModal,$ionicLoading, $stateParams, $timeout, $state, $window, $ionicHistory, createDBentry, authlogin, getProfileInfo, $q) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.mainLogo = 'img/nat.jpg';

  $scope.Signin = "Sign in";
  $scope.NetworkMsg = '';
  $scope.ToggleNew = "New Account";
   $scope.returnToLogin = function(){$state.go('main');};





  // Form data for the login modal
  $scope.loginData = {};

  var verify = authlogin.verify();
	if (verify) {

      $scope.NetworkMsg = "authenticating ...";
	  $timeout(function() {	$state.go('app.profile');}, 2000);
    } else {
      $scope.NetworkMsg = "";
    }

  // Form data for the login modal
  $scope.loginData = {};

  $scope.logout = function(){
	  authlogin.logout();
	  $scope.NetworkMsg = "";
	  $ionicHistory.clearCache();
	  $state.go('login',{}, {reload: true});
	   $ionicLoading.hide();

	  }

  $scope.loginSuccessful = function(){
	  $ionicLoading.hide();
		$scope.NetworkMsg = "Login successful ! ... redirecting";
		$timeout(function() {$state.go('app.profile');}, 2000);
	  }
  $scope.loginFailed= function(){
	  $ionicLoading.hide();
	  	$scope.NetworkMsg = "Login Failed!";
		$scope.Signin = "Sign in";
	  }
  // Perform the login action when the user submits the login form


  $scope.doLogin = function() {

	  $ionicLoading.show({
		  template: 'loading ...'
		});

	  $scope.Signin = "Please Wait";
	  authlogin.emaillogin($scope.loginData.username, $scope.loginData.password, $q)
	  .then($scope.loginSuccessful,$scope.loginFailed);


  }; // dologin function ends

  $scope.sociallogin = function(social){
	   $ionicLoading.show({
		  template: 'loading ...'
		});
	  authlogin.sociallogin(social, $q)
	  .then(function(authData){
		  createDBentry.socialEntry(authData, social, $q)
		  .then(function(){
			  getProfileInfo.checkDob(authData, $q)
			  	.then($scope.loginSuccessful,$scope.needDob)
			  })
			.then($scope.loginSuccessful,$scope.loginSuccessful);

		  },$scope.loginFailed);

	  }// sociallogin function ends


  })
.controller('NewLoginCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $stateParams, $state, $location,$ionicPlatform, $interval, $firebaseAuth,$ionicHistory, createUser,createDBentry, authlogin, getProfileInfo, $cordovaCamera, $cordovaGeolocation, actInfo, $q) {










	  // Create the login modal that we will use later
	  $ionicModal.fromTemplateUrl('templates/date.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;
		//$scope.modal.show();
	  });
	   $scope.returnToLogin = function(){$ionicHistory.goBack();};
	  // datepickerCustom function
	  $scope.dobValue = 'Date of Birth';

	  $scope.showSubmit = true;

	  $scope.datepickerObject = {
		  callback: function (val) {    //Mandatory
			getProfileInfo.validatedob(val, $q)
				.then(function(res){
					$scope.dobValue = res.dob;
					$scope.yAge = res.age;
					// $scope.modal.hide();
					$scope.showSubmit = false;
					},function(res){
						var alertPopup = $ionicPopup.alert({
							 title: '',	 template: 'your age must be 18 years or above'
						   });
						   alertPopup.then(function(res){});
						});
		  }
		}






	// datepickerCustom function ends

	 // Return to -login

	 $scope.mainLogo = 'img/nat.jpg';
	 $scope.NetworkMsg = "";
	 $scope.Signin = "Register";




	 // Redirect via login success
	 $scope.loginSuccessful = function(){
		$scope.NetworkMsg = "Registeration successful ! ... redirecting";
		$timeout(function() {$state.go('app.profile');}, 2000);
	  }

	 // Redirect via login failed
  	 $scope.loginFailed= function(){
	  	$scope.NetworkMsg = "Registeration Failed!";
		$scope.Signin = "Register";
	  }


  $scope.NewloginData = {};
  $scope.NewloginData.image = "img/photo.png";

  $scope.changeLogo = function(key){

		//console.log("its great" + key);
		//var userReference = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/profile/"+key);

			var options = {
				quality : 75,
				destinationType : Camera.DestinationType.DATA_URL,
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				targetWidth: 500,
				targetHeight: 500,
				saveToPhotoAlbum: false
			};
			$cordovaCamera.getPicture(options).then(function(imageData) {
				$scope.NewloginData.image = imageData;
            	$scope.NewloginData.NetworkMsg = imageData;
			}, function(error) {
				alert("Image has not uploaded");
			});

		}











  function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}


  actInfo.getLocation("authData", $q, $cordovaGeolocation)
  	.then(function(loc){
		console.log(loc.lat);
		$scope.loc = {lat: loc.lat, long: loc.long}


		})






  $scope.doRegister = function(){

			  var email = $scope.NewloginData.username;
			  var password = $scope.NewloginData.password;
			  var fullname = $scope.NewloginData.fullname;
			  var dob = $scope.dobValue.getTime();
			  var age = $scope.yAge;
			  var picture = $scope.NewloginData.image;
			  var location = $scope.loc;


		if(picture == "img/photo.png"){
			$ionicPopup.alert({ template: 'please upload a picture'});
		}else if(!validateEmail(email)){
			$ionicPopup.alert({ template: 'email format incorrect'});
		}else if(email == null || password == null || fullname == null){

		}else if($scope.loc == null){

			}
		else{

			  $scope.Signin = "Working...";
			  $scope.NetworkMsg = "Connecting ...";

			 createUser.checkmailexist(email, $q)
				.then(function(iuser){

					if(!iuser){


						 if($scope.NewloginData.checked){var gender = "male"}
						 if(!$scope.NewloginData.checked){var gender = "female"}

						  var regData = {email:email,fullname:fullname,dob:dob,age:age,gender:gender,picture:picture, location: location};
						  //console.log(regData);
						  createUser.emaillogin(email, password, $q)
						  .then(function(authData){
								createDBentry.emailEntry(authData,  regData, $q)
								.then(authlogin.emaillogin(email, password, $q),$scope.loginSuccessful);
						  },function(authData){
						   // console.log(authData)
						  });
					}else{

						$ionicPopup.alert({ template: 'email already exist'});
						$scope.Signin = "REGISTER";

						}
				})












		}




  };  // doRegister function ends


    // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/terms.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeTerms = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.terms = function() {
    $scope.modal.show();
  };



})
.controller('DeleteLoginCtrl', function($scope, $ionicModal, $timeout, $stateParams, $ionicHistory, $state, $firebaseAuth, getProfileInfo, authlogin, $q) {



	 // Return to -login
	 $scope.mainLogo = 'img/nat.jpg';
	 $scope.id = $stateParams.id;
	 $scope.NetworkMsg = "please provide exact email and password";
	 $scope.Signin = "delete";
	 $scope.returnToLogin = function(){$ionicHistory.goBack();};
	 $scope.NewloginData = {};
	 var authData = authlogin.verify();
     if (authData && $stateParams.id != "change" ) {


  	 $scope.doRegister = function(){
		  $scope.Signin = "Working...";
		  $scope.NetworkMsg = "Connecting ...";

		  var email = $scope.NewloginData.username;
		  var password = $scope.NewloginData.password;

		  getProfileInfo.emaildeleteProfile(authData, email, password, $q)
		  .then(function(response){$scope.NetworkMsg = response; $state.go('login');},
		  		function(response){$scope.Signin = "delete";$scope.NetworkMsg = response}

		  );
	  };  // doRegister function ends



	 }// end if authData
	 else if(authData && $stateParams.id == "change" ){

		 $scope.show = true;
		 $scope.Signin = "change";
		 $scope.NetworkMsg = "please provide exact email and new password";

		 $scope.doRegister = function(){
		  $scope.Signin = "Working...";
		  $scope.NetworkMsg = "Connecting ...";

		  var email = $scope.NewloginData.username;
		  var password = $scope.NewloginData.password;
		  var newpassword = $scope.NewloginData.newpassword;


		  getProfileInfo.changePassword(email, password, newpassword, $q)
			  .then(function(response){
					$scope.NetworkMsg = response;
					$timeout(function() {$ionicHistory.goBack();}, 1000);

				  },
					function(response){$scope.Signin = "change";$scope.NetworkMsg = response}

			  );
		  };  // doRegister function ends




		}
	 else if($stateParams.id == "reset"){

		 $scope.hide = true;
		 $scope.Signin = "Reset";
		 $scope.NetworkMsg = "please provide exact email";

		 $scope.doRegister = function(){
		  $scope.Signin = "Working...";
		  $scope.NetworkMsg = "Connecting ...";

		  var email = $scope.NewloginData.username;

		  getProfileInfo.resetPassword(email, $q)
			  .then(function(response){
					$scope.NetworkMsg = response;
					$timeout(function() {$ionicHistory.goBack();}, 1000);

				  },
					function(response){$scope.Signin = "Reset";$scope.NetworkMsg = response}

			  );
		  };  // doRegister function ends




		}
	else{$state.go('login');}





})
.controller('SearchCtrl', function($scope,$state, $stateParams, $q, $ionicLoading, $firebaseObject, getProfileInfo, authlogin, $ionicFilterBar, searchInfo, actInfo) {

	var filterBarInstance;
    var authData = authlogin.verify();


	$scope.gotoPublicProfile = function(tkey){
		$state.go('app.searchprofile', {uid: tkey})
		}














	searchInfo.getmyCLocation(authData, $q)
		.then(function(res){
			    $scope.myC = {x:res.lat,y:res.long};
			})
	$scope.SearchMale = {checked:false};
	$scope.SearchTick = function(){
		$scope.wait = "... loading";
		searchInfo.getuserListByGender(authData, $scope.SearchMale.checked, $q)
			.then(function(res){
				console.log(res);

				searchInfo.getmyCLocation(authData, $q)
				.then(function(res){
						$scope.myC = {x:res.lat,y:res.long};
					})



				angular.forEach(res, function(value, key) {
							   value['distance'] = "...";

								    })
									$scope.ilist = res;
									$scope.wait = "";

									$ionicLoading.hide();
									return res;
				}).then(function(res){
					console.log("got it");


				angular.forEach($scope.ilist, function(value, key) {

							   // calculate distance
							    var x1 = $scope.myC.x;
								var x2 = value.profile.location.lat;
								var y1 = $scope.myC.y;
								var y2 = value.profile.location.long;

								actInfo.getDistance(x1,y1,x2,y2,$q)
									.then(function(res){
										value['distance'] = Math.round(res) + " km away";
										})
								    });
					console.log(res);



					})



		}; $scope.SearchTick();









    $scope.showFilterBar = function (){
      filterBarInstance = $ionicFilterBar.show({
		ilist: $scope.ilist,
        update: function (filteredItems, filterText) {
		  if (filterText){
			//console.log(filterText);
			searchInfo.getuserList(authData, $q, filterText)
				.then(function(res){

						/*angular.forEach(res, function(value, key) {

							   // calculate distance
							    var x1 = $scope.myC.x;
								var x2 = value.profile.location.lat;
								var y1 = $scope.myC.y;
								var y2 = value.profile.location.long;

								actInfo.getDistance(x1,y1,x2,y2,$q)
									.then(function(res){
										value['distance'] = Math.round(res);
										})
								    });*/
									$scope.ilist = res;

					});
					;
			/*searchInfo.getactList(authData, $q, filterText)
				.then(function(main){
						$scope.acts = main;
						//console.log(main);
					});*/


          }
        }
      });
    };

	$scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 500);
    };


})
.controller('PreProfileCtrl', function($scope, $state,$ionicPopup, $stateParams, $q, $firebaseObject, getProfileInfo, authlogin, BeFriend, $ionicHistory, $firebaseArray, $rootScope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, getGlobals, $cordovaGeolocation, $ionicLoading, actInfo, $http) {

    $scope.setProfile = false;

    // initially get the variables
	var authData = authlogin.verify();
	if (authData) {
    $scope.id = authData.uid;
	 $ionicLoading.show({ template: 'loading ...' });
	 actInfo.SetMyCoords(authData, $q, $cordovaGeolocation)
	 .then(function(){
		getProfileInfo.myProfile(authData, $q)
		 .then(function(Profile){ $scope.profile = Profile; })
			.then(function(){ $ionicLoading.hide(); });

		 })



	} // end if authData
	else{
		$state.go('login');
		}



})
.controller('ProfileCtrl', function($scope, $state,$ionicPopup, $stateParams, $q, $firebaseObject, getProfileInfo, authlogin, BeFriend, $ionicHistory, $firebaseArray, $ionicModal, $rootScope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, getGlobals, $cordovaGeolocation,$ionicSlideBoxDelegate, $ionicLoading, actInfo, NgMap,  $http,  $ionicTabsDelegate) {

	$scope.selectTabWithIndex = function(index) {
		$ionicTabsDelegate.select(index);
	  }
	$scope.filter = { edit :false, text:"Edit Profile"};
	$scope.toggleFilter = function(){
		if($scope.filter.edit){	$scope.filter.edit = false; $scope.filter.text = "Edit Profile";}
		else{ $scope.filter.edit = true; $scope.filter.text = "Done"}
		}



	$scope.getLimits = function (array) {

			var c = Object.keys(array).length - 1;
			return c;
        };



    // initially get the variables
	var authData = authlogin.verify();
	if (authData) {
    $scope.id = authData.uid;
	$ionicLoading.show({ template: 'loading ...' });

	getProfileInfo.myProfile(authData, $q)
	 .then(function(res){
		     console.log(res);
			 $scope.bindInterestLive();
			 $scope.getGroups();
			 $ionicLoading.hide();
			 $scope.setProfileInfo();
			 //$scope.geoLocation();
		 })


	$scope.bindInterestLive = function(){
		var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid);
		 // sync as object
		 var syncObject = $firebaseObject(ref);
		 $scope.ilist = syncObject;
		 // three way data binding
  		 syncObject.$bindTo($scope, 'ilist');
		 //console.log($scope.ilist);
		}






	 $http.get('lang/global.json').success(
						function(global){
							$scope.listAct = global.hobbies2;
							$ionicSlideBoxDelegate.update();
						}
					).then($ionicSlideBoxDelegate.update());



	 $scope.getGroups = function(){
		  var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/profile");
		  //getGlobals.sethobbies(authData,$q);
		  //getGlobals.setlanguages(authData,$q);

	 	  $scope.hobValue = function(lang, state, icon){
			  if(state == 1 ){ console.log('true')
				ref.child('hobbies').once("value", function(snapshot){
                    var count = snapshot.numChildren();
                    if(count <= 6){ ref.child('hobbies').child(lang).set(icon); }
					else{
						var alertPopup = $ionicPopup.alert({
						 title: '',
						 template: 'can only select six (6) hobbies'
					   });
					   alertPopup }
                })
            }
			  else{
				  ref.child('hobbies').child(lang).set(null);  }
			}

		  $scope.selectedChanged = function(key, value){
			  console.log(key, value);
			  ref.child(key).set(value);
			  }



	  }


	$scope.changeLogo = function(key){

		//console.log("its great" + key);
		var userReference = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/profile/"+key);

			var options = {
				quality : 75,
				destinationType : Camera.DestinationType.DATA_URL,
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				targetWidth: 500,
				targetHeight: 500,
				saveToPhotoAlbum: false
			};
			$cordovaCamera.getPicture(options).then(function(imageData) {
				userReference.set(imageData).then(function() {
                alert("Image has been uploaded");
            });
			}, function(error) {
				alert("Image has not uploaded");
			});

		}

	$scope.loading = "";

	$scope.images = [];
	var userReference = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid);
    var syncObject = $firebaseObject(userReference.child("images"));
	$scope.imagelist = syncObject;
	syncObject.$bindTo($scope, 'imagelist');



    $scope.photoUpload = function() {
		var imagesReference = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/images");
		imagesReference.once("value", function(snapshot) {
			var a = snapshot.numChildren();

			if(a >= 10){ alert("Image upload limit reached ... remove few images first");}
			else{
				 var options = {
					quality : 75,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit : true,
					encodingType: Camera.EncodingType.JPEG,
					popoverOptions: CameraPopoverOptions,
					targetWidth: 500,
					targetHeight: 500,
					saveToPhotoAlbum: false
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					imagesReference.push({image: imageData}).then(function() {
						alert("Image has been uploaded");
					});
				}, function(error) {
					console.error(error);
				});

			} // else ends


			});


    } 	// scope.photoUpload ends


	$scope.removeImage = function(key){
		userReference.child("images").child(key).remove();
		}


	$scope.setProfileInfo = function(){

			//select Globals from json file
				 $http.get('lang/global.json').success(
						function(global){
							$scope.listAct = global.hobbies2;
							$scope.languages = {
								repeatSelect: null,
								availableOptions: global.languages}

							$scope.geducation = {
								repeatSelect: null,
								availableOptions: global.Education}

							$scope.gsta = {
								repeatSelect: null,
								availableOptions: global.Status}
						}
					);
				 //select nationality in profile
				$http.get('lang/countries.json').success(
						function(nat){
							$scope.gnationality = {
								repeatSelect: null,
								availableOptions: nat}
						}
					);






		};

		$scope.getProfileInfoValues = function(){
			var e = $scope.geducation.value;
			var n = $scope.gnationality.repeatSelect;
			var s = $scope.gsta.repeatSelect;
			console.log(e,n,s)
			if(e != null && n != null && s != null ){
				getProfileInfo.setEnsInfo(authData, $q, e, n, s)
					.then(function(res){
						   $scope.closeModal();
					})

			}else{
				var alertPopup = $ionicPopup.alert({
						 title: '',
						 template: 'complete The Form'
					   });
					   alertPopup
				}
		}


	// edit my map location
	$scope.mapedit = false;

	$scope.mapTabSelected = function(){

		NgMap.getMap({id:'actMapLoc'}).then(function(map) {

					var setCoords;
					console.log($scope.ilist.profile.location);

					$scope.coords = { lat:$scope.ilist.profile.location.lat,
									  long:$scope.ilist.profile.location.long };
					$scope.marker = $scope.coords;


					$scope.edit_my_location = function(){
						$scope.mapedit = true;

						var c = map.getCenter();
						$scope.marker2 = {lat:c.lat(), long:c.lng()};

						$scope.centerChanged = function(event) {
							var c = map.getCenter();
							$scope.marker2 = {lat:c.lat(), long:c.lng()};
							setCoords = {lat:c.lat(), long:c.lng()};

						}





					}

					$scope.set_my_location = function(){
						$scope.mapedit = false;
						$scope.ilist.profile.location = $scope.marker2;
						$scope.ilist.profile.location.user_set = true;
						$scope.coords = $scope.ilist.profile.location;
						$scope.marker = $scope.ilist.profile.location;


						$scope.marker = $scope.coords;
						alertPopup = $ionicPopup.alert({template: 'new location set' });

						//actInfo.setTheActivityLocation(authData, $q, $stateParams.ackey, $scope.marker)
							//.then(function(res){

								// })


					}
					
					$scope.showMyDirections = function(){
						if($scope.showDirections == true){
							$scope.showDirections = false;
						}else{
							$scope.showDirections = true;
						}
						
					}
					









					})
	}























	$ionicModal.fromTemplateUrl('templates/edit-profile.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;

	  });
	  $scope.openModal = function() {
		$scope.setProfileInfo();
		$scope.modal.show();
	  };
	  $scope.closeModal = function() {
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
		// Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
		// Execute action
	  });














	} // end if authData
	else{
		$state.go('login');
		}



})
.controller('chatCtrl', function($scope,$state, $stateParams, $q, $firebaseObject, getProfileInfo, authlogin, BeFriend) {

	var authData = authlogin.verify();
	BeFriend.dummyRequest(authData, $q)
	 .then(function(authData){$scope.ProfilesList(authData)});

	$scope.ProfilesList = function(authData){
		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/BeFriend");
		 var c = ref.orderByChild('type').equalTo('friend');

		 // sync as object for sync as sent
		 var syncObject = $firebaseObject(c);
		 $scope.inboxlist = syncObject;
  		 syncObject.$bindTo($scope, 'chatlist');

		} // profilesList function ends

	$scope.deleteRequest = function(inboxlist, index, frienduid) {
		/*
		BeFriend.deleteRequest(authData, frienduid, $q)
		*/
		console.log("delete chat not yet made");
	}; // showConfirm ends


})
.controller('ichatCtrl', function($scope,$state, $stateParams, $q, $ionicLoading, $firebaseObject, getProfileInfo, authlogin, BeFriend, chatlink, $cordovaCamera, $ionicScrollDelegate) {

	$scope.wait = "loading ... please wait";


	$ionicLoading.show({
		  template: 'loading ...'
		});

	var authData = authlogin.verify();
	$scope.pid = {
		fuid : $stateParams.uid,
		muid : authData.uid
		}

	$scope.checkPuid = function(uid){
		if(uid == authData.uid){return "self";}
		if(uid == $stateParams.uid){return "other";}
		}

	getProfileInfo.publicProfile($stateParams.uid, $q)
				.then(function(aprofile){ $scope.aprofile = aprofile });

	getProfileInfo.myProfile(authData, $q)
	 .then(function(Profile){ $scope.profile = Profile });

	chatlink.uuidCheck(authData, $stateParams.uid, $q)
	.then(function(response){$scope.uuid = response.uuid},function(){$scope.addtoChat()})
	.then(function(){$scope.syncChat()})
	.then(function(){
		$ionicLoading.hide();
		$ionicScrollDelegate.scrollBottom(false);

		});


	$scope.addtoChat = function(){
		chatlink.AddToChat(authData, $stateParams.uid, $q)
			.then(function(response){
				$scope.uuid = response;})

	}



	$scope.syncChat = function(){


		 var uuid = $scope.uuid;
		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/chats/"+uuid+"/conversation");


		 // sync as object for sync as sent
		 var syncObject = $firebaseObject(ref);
		 $scope.convlist = syncObject;
  		 syncObject.$bindTo($scope, 'convlist');

		 $scope.$watch('convlist', function(newValue, oldValue) {
			$ionicScrollDelegate.scrollBottom(false);
			$scope.wait = "";
			 $ionicLoading.hide();
		  }, true);



		} // profilesList function ends









	$scope.msg = {};
	$scope.sendmsg = function(){
		chatlink.pushmsg(authData, $stateParams.uid, $q, $scope.msg.text, $scope.uuid)
		.then(function(){$scope.msg = {};
		});
		}
    $scope.sendMsgImage = function(){
                var options = {
					quality : 75,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit : true,
					encodingType: Camera.EncodingType.JPEG,
					popoverOptions: CameraPopoverOptions,
					targetWidth: 300,
					targetHeight: 300,
					saveToPhotoAlbum: false
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {

                    chatlink.pushImg(authData, $stateParams.uid, $q, imageData, $scope.uuid)
                        .then(function(){$scope.msg = {}; });
				}, function(error) {
					console.error(error);
				});
    }


})
.controller('ActOptionCtrl', function($scope,$state, $stateParams, authlogin, $firebaseObject,actInfo, $ionicLoading, $timeout, $q) {

	var authData = authlogin.verify();
	$scope.show = false;
	if(authData){
        $scope.authID = authData.uid;
		var userReference = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/sos");
		userReference.once("value", function(snap){
			var a = snap.exists();
			if(a){
				$scope.sosExist = true;
				$scope.sosKey = snap.val();
				//console.log(snap.val());
				}

			});


		$scope.deleteSos = function(sosKey){
			$scope.delmsg = "removing ...";
			userReference.set(null);
			$timeout(function() { $scope.sosExist = false; $scope.delmsg = ""; 	});



			}

		$scope.gotoActivity = function(sosKey){
			//console.log(sosKey);
			$state.go('app.view-activities', {ackey:sosKey});

			}


	}





})
.controller('ActCtrl', function($scope,$state, $stateParams,$ionicHistory, authlogin, actInfo, $ionicLoading, searchInfo, $q) {

	var authData = authlogin.verify();
	$scope.id = $stateParams.id;
	if(authData){

	$scope.Run = function(){
			actInfo.getActivity($stateParams.id, $q)
					.then(function(res){$scope.acts = res });
		};$scope.Run();


			if(authData.uid == $stateParams.id){}

	$scope.RefreshView = function(){
 		$scope.Run();
		$scope.$broadcast('scroll.refreshComplete');

		}

	$scope.Redirect = function(tkey){
		$ionicHistory.clearHistory();
		$state.go('app.view-activities', {ackey:tkey})

		}


	}



})
.controller('ActPushCtrl', function($scope,$state, $stateParams, authlogin, actInfo, $ionicLoading, searchInfo, $q) {

	var authData = authlogin.verify();
	$ionicLoading.show({ template: 'loading ...' });
	if(authData){
	$scope.uid = authData.uid;

	$scope.getReq = function(){

				actInfo.getSentActivityRequests(authData, $q)
					.then(function(res){console.log(res); $scope.acts = res;});
					$ionicLoading.hide();
	};$scope.getReq();


	$scope.RefreshView = function(){

		$scope.getReq();
		$scope.$broadcast('scroll.refreshComplete');


		}
	}



})
.controller('SearchActCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, authlogin, searchInfo,  $timeout, $http) {

	var authData = authlogin.verify();
	$scope.myuid = authData.uid;
	$scope.refreshList = function(){
	searchInfo.getactList(authData, $q)
		.then(function(data){
			$scope.acts = data;
			$scope.$broadcast('scroll.refreshComplete');
			})
	} ;$scope.refreshList();

    $scope.dobValue = null;
	$scope.datepickerObject = {
		callback: function (val) { //Mandatory
            $scope.dobValue = val;
			var unixtime = val.getTime();
			searchInfo.getactListByDate(authData, $q, unixtime)
				.then(function(data){$scope.acts = data;})


        }
    };





})
.controller('GroupSearchActCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, getProfileInfo, getGlobals, authlogin, $ionicPopup, searchInfo,  $timeout, $http) {

	var authData = authlogin.verify();
	$ionicLoading.show({ template: 'loading ...' });
  	$scope.showMap = false;
	getProfileInfo.myProfile(authData, $q)
	 .then(function(Profile){
		 $scope.profile = Profile;
		 })

	$scope.dobValue = null;
	$scope.NewActData = {};

	$ionicLoading.hide();


	//$scope.language = {value: 'english'}
    //select languages from json file
        $http.get('lang/global.json').success(
            function(global){
                $scope.languages = {
                    repeatSelect: null,
                    availableOptions: global.languages
                }
				$scope.cActivityList = {
                    repeatSelect: null,
                    availableOptions: global.hobbies2
                };
            }
        );




	//select nationality in profile
        $http.get('lang/countries.json').success(
            function(nat){
                $scope.gnationality = {
                    repeatSelect: null,
                    availableOptions: nat
                }
            }
        );

	$scope.createActivity = function(){
		var actype = $scope.cActivityList.repeatSelect;
		var acdate = $scope.dobValue;
        var aclang = $scope.languages.repeatSelect;
        var acnat = $scope.gnationality.repeatSelect;

         var actData = {
                type : actype,
                date : acdate,
                language: aclang,
                nationality: acnat,
			};


        if(actype == null || aclang == null || acnat == null  || (acdate == null || acdate == "No date selected") ){

            var alertPopup = $ionicPopup.alert({
					 title: '',
					 template: 'Complete the form'
				   });
				   alertPopup


        }else{
            window.localStorage['group_search'] = JSON.stringify(actData);
			$state.go('app.group-activities-list');


        }

	}


		$scope.datepickerObject = {
		  callback: function (val) {  //Mandatory
			datePickerCallback(val);
		  }

		};
		var datePickerCallback = function (val) {
		  if (typeof(val) === 'undefined') {
			$scope.dobValue = 'No date selected';
		  } else {
			$scope.dobValue = val.getTime();
		  }
		}





})
.controller('GroupSearchActCardCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, getProfileInfo, getGlobals, authlogin, $ionicPopup, searchInfo,  $timeout, $http) {

  var authData = authlogin.verify();
  getProfileInfo.myProfilePicture(authData, $q)
		.then(function(image){ $scope.profileImage = image;	});

  var group_search_param = JSON.parse(window.localStorage['group_search']);
  var cardTypes = [];

  searchInfo.grouptdSearch(authData, $q, group_search_param)
  	.then(function(res){
		$ionicLoading.show({ template: 'loading ...' });
		angular.forEach(res, function(value, key){
			searchInfo.isGroupRequested(authData, key, $q)
				.then(function(resolve){
				//console.log(resolve);
				if( !resolve &&
						( group_search_param.type == value.act.type
							&& group_search_param.date == value.act.date
								&& group_search_param.language == value.act.language )
				  ){


							cardTypes.push({key:key,value:value});
							$scope.inCards(cardTypes);

							}

					})// the result is pushed



			})

		$ionicLoading.hide();

		})



		$scope.inCards = function(cardTypes){
			  //console.log(cardTypes);
			  $scope.cards = {
				master: Array.prototype.slice.call(cardTypes, 0),
				active: Array.prototype.slice.call(cardTypes, 0),
				discards: [],
				liked: [],
				disliked: []
			  }

			  $scope.cardDestroyed = function(index) {
				$scope.cards.active.splice(index, 1);
			  };

			  $scope.addCard = function() {
				var newCard = cardTypes[0];
				$scope.cards.active.push(angular.extend({}, newCard));
			  }

			  $scope.refreshCards = function() {

				var q = $q.defer();
				var promise = q.promise;
				promise.then(function(){
						angular.forEach($scope.cards.master, function(value, key){
							//console.log(key, value);
								if(value.remove){$scope.cards.master.splice(key,1);}
							})
					}).then(function(){
						// Set $scope.cards to null so that directive reloads
							$scope.cards.active = null;
							$timeout(function() {
							  $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
							});
						})
						q.resolve();
			  }

			  $scope.$on('removeCard', function(event, element, card) {
				var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
				$scope.cards.discards.push(discarded);
			  });

			  $scope.cardSwipedLeft = function(index) {
				//console.log('LEFT SWIPE', index);
				var card = $scope.cards.active[index];
				$scope.cards.disliked.push(card);

			  };

			  $scope.setCount = function(index){
				  $scope.count = index;
				  }

			  $scope.cardSwipedRight = function(index) {
				//console.log('RIGHT SWIPE', index);
				var card = $scope.cards.active[index];
				searchInfo.sendGroupRequest(authData, card.key, $q)
					.then(function(res){
						card['remove'] = true;
						$scope.cards.liked.push(card);
						})

			  };

			  $scope.BcardSwipedLeft = function(index) {
				//console.log('LEFT SWIPE', index);
				var card = $scope.cards.active[index];
				//alert(card.key);
				$scope.cards.disliked.push(card);
				$scope.cards.active.splice(index, 1);


			  };

			  $scope.BcardSwipedRight = function(index) {
				//console.log('RIGHT SWIPE', index);
				var card = $scope.cards.active[index];
				searchInfo.sendGroupRequest(authData, card.key, $q)
					.then(function(res){
						card['remove'] = true;
						$scope.cards.liked.push(card);
						$scope.cards.active.splice(index, 1);
						})

			  };



		}






})
.controller('CreateActCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, getProfileInfo, authlogin, actInfo, getGlobals, $cordovaGeolocation, $ionicPopup,$ionicHistory,$ionicModal, NgMap, $timeout, $http) {

	var authData = authlogin.verify();
	$ionicLoading.show({ template: 'loading ...' });
  	$scope.showMap = false;
	getProfileInfo.myProfile(authData, $q)
	 .then(function(Profile){
		 $scope.profile = Profile;
		 $ionicLoading.hide();
		 })

	//select Globals from json file
	$http.get('lang/global.json').success(
						function(global){

							$scope.cActivityList = {
								repeatSelect: null,
								availableOptions: global.hobbies2};

							$scope.languages = {
								repeatSelect: null,
								availableOptions: global.languages}

							$scope.CarTypeList = {
								repeatSelect: null,
								availableOptions: global.CarTypes};

							$scope.geducation = {
								repeatSelect: null,
								availableOptions: global.Education}

							$scope.AccTypeList = {
								repeatSelect: null,
								availableOptions: global.AccTypes};

						}
					);
	//select nationality in profile
	$http.get('lang/countries.json').success(
						function(nat){
							$scope.gnationality = {
								repeatSelect: null,
								availableOptions: nat}
						}
					);


	$ionicModal.fromTemplateUrl('templates/mapd.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
		$scope.modal = modal;

	  });
	  $scope.openModal = function(m) {
		$scope.modal.show();
		$scope.getMap(m);

	  };

	  $scope.closeModal = function() {
		$scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
		$scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
		// Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
		// Execute action
	  });



	// parameters
	$scope.sos = {checked:false, distance:500}
	$scope.AcType = $stateParams.type;
	$scope.dobValue = null;
	$scope.timeValue = null;
	$scope.NewActData = {};
	$scope.ageGroup = {value: 'any'};
    $scope.rPersons = {value: 2}
    $scope.Lookingfor = {value: 'female'}
	$scope.activ = {person:"host"}
	$scope.accom = {person:"host"}
	$scope.poolcar = {person:"driver"}
	$scope.CarCapacity = {value: null}
	$scope.HomeCapacity = {value: null}
	$scope.AvailableHours = {value:null}
	$scope.PerPersonCharges = {value: null}
	$scope.NoPlaces = {value: null}
	$scope.marker1 == null;
	$scope.marker2 == null;

    // calling function
	$scope.createActivity = function(){

		if($scope.AcType == 'activity'){

			if($scope.NewActData.actname == null || $scope.gnationality.repeatSelect == null ||
			   $scope.NewActData.city == null || $scope.marker == null ||
			   ($scope.timeValue == null || $scope.timeValue == "Time not selected") ||
			   ($scope.dobValue == null || $scope.dobValue == "No date selected") ||
			   $scope.cActivityList.repeatSelect == null || $scope.ageGroup.value == null ||
			   $scope.languages.repeatSelect == null || $scope.Lookingfor.value == null ||
			   $scope.rPersons.value == null){

				var alertPopup = $ionicPopup.alert({
						 title: '',
						 template: 'Complete the activity form'
					   }); alertPopup
			}else{

				var actData = {
					params:{its:$scope.AcType, itsfor:'person'},
					Name : $scope.NewActData.actname,
					nationality: $scope.gnationality.repeatSelect,
					type : $scope.cActivityList.repeatSelect,
					city : $scope.NewActData.city,
					date : $scope.dobValue,
					time : $scope.timeValue,
					ageGroup: $scope.ageGroup.value,
					language: $scope.languages.repeatSelect,
					lookingFor: $scope.Lookingfor.value,
					persons: $scope.rPersons.value
				};

				var array = {
					sos: $scope.sos.checked,
					sosDistance: $scope.sos.distance,
					lat: $scope.marker.lat,
					long:$scope.marker.long,
					members:true,
					act:actData,
					uid:authData.uid,
					ownerName:$scope.profile.profile.name,
					picture:$scope.profile.profile.picture
				}


				$scope.CreateEntry(array);



				}






		} // end if for activity


		if($scope.AcType == 'accomodation'){


			if($scope.NewActData.actname == null || $scope.gnationality.repeatSelect == null ||
			   $scope.NewActData.city == null || $scope.marker1 == null ||
			   $scope.dobValue == null || $scope.dobValue == "No date selected"
			   // || $scope.cActivityList.repeatSelect == null
			   || $scope.AccTypeList.repeatSelect == null
			   || ($scope.accom.person == 'host' && ($scope.PerPersonCharges.value == null || $scope.HomeCapacity.value == null))
			   || ($scope.accom.person == 'traveller' && $scope.marker2 == null )){

				var alertPopup = $ionicPopup.alert({template: 'Complete the form'}); alertPopup

			}else{

				if($scope.accom.person == 'host'){

						var actData = {
								params:{its:$scope.AcType,itsfor:$scope.accom.person},
								Name : $scope.NewActData.actname,
								nationality: $scope.gnationality.repeatSelect,
								city : $scope.NewActData.city,
								date : $scope.dobValue,
								type : "Accomodation",
								acctype : $scope.AccTypeList.repeatSelect,
								charges : $scope.PerPersonCharges.value,
								capacity : $scope.HomeCapacity.value,
							};

					   var array = {
						       sos: $scope.sos.checked,
							   sosDistance: $scope.sos.distance,
							   lat: $scope.marker1.lat,
							   long:$scope.marker1.long,
							   members:true,
							   act:actData,
							   uid:authData.uid,
							   ownerName:$scope.profile.profile.name,
							   picture:$scope.profile.profile.picture }

						$scope.CreateEntry(array);


				} // if host

				if($scope.accom.person == 'traveller'){

					   var actData = {
								params:{its:$scope.AcType,itsfor:$scope.accom.person},
								Name : $scope.NewActData.actname,
								nationality: $scope.gnationality.repeatSelect,
								city : $scope.NewActData.city,
								date : $scope.dobValue,
								type : "Accomodation",
								acctype : $scope.AccTypeList.repeatSelect
							};

					   var array = {
						       sos: $scope.sos.checked,
							   sosDistance: $scope.sos.distance,
							   lat: $scope.marker1.lat,
							   long:$scope.marker1.long,
							   lat2: $scope.marker2.lat,
							   long2:$scope.marker2.long,
							   members:true,
							   act:actData,
							   uid:authData.uid,
							   ownerName:$scope.profile.profile.name,
							   picture:$scope.profile.profile.picture }

						$scope.CreateEntry(array);


						} // if traveller

			} // outer else



		} // end if for accomodation




		if($scope.AcType == 'carpool'){


			if($scope.NewActData.actname == null || $scope.gnationality.repeatSelect == null ||
			   $scope.NewActData.city == null || $scope.marker1 == null ||
			   $scope.dobValue == null || $scope.dobValue == "No date selected"
			   // || $scope.cActivityList.repeatSelect == null
			   || $scope.CarTypeList.repeatSelect == null ||
			   ($scope.poolcar.person == 'driver' &&
			   		($scope.timeValue == null || $scope.timeValue == "Time not selected" ||
					$scope.PerPersonCharges.value == null || $scope.NoPlaces.value == null))
			   || ($scope.poolcar.person == 'passenger' && $scope.marker2 == null )){

				var alertPopup = $ionicPopup.alert({template: 'Complete the form'}); alertPopup

			}else{

				if($scope.poolcar.person == 'driver'){

						var actData = {
								params:{its:$scope.AcType,itsfor:$scope.poolcar.person},
								Name : $scope.NewActData.actname,
								nationality: $scope.gnationality.repeatSelect,
								city : $scope.NewActData.city,
								date : $scope.dobValue,
								time : $scope.timeValue,
								type : "Carpool",
								cartype : $scope.CarTypeList.repeatSelect,
								charges : $scope.PerPersonCharges.value,
								places : $scope.NoPlaces.value,
								time : $scope.timeValue
							};

					   var array = {
						       sos: $scope.sos.checked,
							   sosDistance: $scope.sos.distance,
							   lat: $scope.marker1.lat,
							   long:$scope.marker1.long,
							   members:true,
							   act:actData,
							   uid:authData.uid,
							   ownerName:$scope.profile.profile.name,
							   picture:$scope.profile.profile.picture }

						$scope.CreateEntry(array);


				} // if host

				if($scope.poolcar.person == 'passenger'){

					   var actData = {
								params:{its:$scope.AcType,itsfor:$scope.poolcar.person},
								Name : $scope.NewActData.actname,
								nationality: $scope.gnationality.repeatSelect,
								city : $scope.NewActData.city,
								date : $scope.dobValue,
								type : "Carpool",
								cartype : $scope.CarTypeList.repeatSelect
							};

					   var array = {
						       sos: $scope.sos.checked,
							   sosDistance: $scope.sos.distance,
							   lat: $scope.marker1.lat,
							   long:$scope.marker1.long,
								lat2: $scope.marker2.lat,
								long2:$scope.marker2.long,
							   members:true,
							   act:actData,
							   uid:authData.uid,
							   ownerName:$scope.profile.profile.name,
							   picture:$scope.profile.profile.picture }

						$scope.CreateEntry(array);


						} // if traveller

			} // outer else



		} // end if for poolcar



	} // end of createActivity()

	$scope.CreateEntry = function(array){


		$ionicLoading.show({ template: 'working ...' });
			actInfo.setActivity(authData, $q, array)
				.then(function(param){
					actInfo.setOwnerAsMember(authData, $q, array, param)

                .then(function(res){

						if(!res.sos){


							$ionicLoading.hide();
							var alertPopup = $ionicPopup.alert({template: 'Activity created' });
							alertPopup.then(function(){
							   $scope.NewActData = {};
							   $state.go('app.activities',{'id':authData.uid})
							   })

							}else{
							$ionicLoading.show({ template: 'sending sos ...' });
							actInfo.sendActivityAsSos(authData, $q, $scope.marker, res)
								.then(function(response){
									$ionicLoading.hide();
									var alertPopup = $ionicPopup.alert({template: 'Activity created' });
									alertPopup.then(function(){
									   $scope.NewActData = {};
									   $state.go('app.activities',{'id':authData.uid})
									   })
								})
							}
					});
			})
		} // end CreateEntry()



	$scope.getMap = function(m){


		actInfo.getLocation(authData, $q, $cordovaGeolocation)
		 	.then(function(res){
				$scope.coords = { lat: res.lat, long: res.long};

				})
		NgMap.getMap({id:'foomap'}).then(function(map) {
				var c = map.getCenter();
				$scope.marker = {lat:c.lat(), long:c.lng()};
			$scope.centerChanged = function(event) {
				var c = map.getCenter();
				$scope.marker = {lat:c.lat(), long:c.lng()};

				if(m == 'm1'){ $scope.marker1 = $scope.marker; }
				if(m == 'm2'){ $scope.marker2 = $scope.marker; }


			}
		})

		} // getMap ends




	   // datepicker
	   $scope.datepickerObject = {
		  callback: function (val) {  //Mandatory
			datePickerCallback(val);
		  }

		};
		var datePickerCallback = function (val) {
		  if (typeof(val) === 'undefined') {
			$scope.dobValue = 'No date selected';
		  } else {
			$scope.dobValue = val.getTime();
		  }
		} // datepicker ends

		//timepicker
		$scope.timePickerObject = {
			  callback: function (val) {    //Mandatory
				timePickerCallback(val);
			  }
		};
			function timePickerCallback(val) {
			  if (typeof (val) === 'undefined') {
				$scope.timeValue = 'Time not selected';
			  } else {
				var selectedTime = new Date(val * 1000);
				$scope.timeValue = selectedTime.getUTCHours() + ':'+ selectedTime.getUTCMinutes();

			  }
			} // timepicker ends


})
.controller('ViewActCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, $ionicModal, getProfileInfo, authlogin, actInfo, getGlobals, $cordovaGeolocation, $cordovaCamera, $ionicPopup,$ionicHistory, NgMap, searchInfo, $http, chatlink, $ionicTabsDelegate) {


	$scope.selectTabWithIndex = function(index) {
		$ionicTabsDelegate.select(index);
	  }
	$scope.filter = { edit :false, text:"edit"};
	$scope.toggleFilter = function(){
		if($scope.filter.edit){	$scope.filter.edit = false; $scope.filter.text = "edit";}
		else{$scope.filter.edit = true; $scope.filter.text = "done";}

	}


    $ionicLoading.show({ template: 'loading ...' });
	var authData = authlogin.verify();



		$scope.ackey = $stateParams.ackey;
		$scope.uid = authData.uid;
		$scope.editLabel = "Move/Drag";
		$scope.m_icon = "ion-chevron-up";

		$scope.bindActivityLive = function(){
			 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/activities/"+$stateParams.ackey);
			 // sync as object
			 var syncObject = $firebaseObject(ref);
			 $scope.res = syncObject;
			 // three way data binding
			 syncObject.$bindTo($scope, 'res');

			}

		$scope.isMemberFunc = function(){
				angular.forEach($scope.res.members, function(value, key){
					console.log(key, value);
					if(key == authData.uid && value.type == "request"){
						$scope.status = "pending";
						}
					if(key == authData.uid && value.type != "request"){
						$scope.isMember = true;
						}
					})

			}

		$http.get('lang/global.json').success(
						function(global){
							$scope.cActivityList = {
								repeatSelect: null,
								availableOptions: global.hobbies2};
							$scope.CarTypeList = {
								repeatSelect: null,
								availableOptions: global.CarTypes};
							$scope.AccTypeList = {
								repeatSelect: null,
								availableOptions: global.AccTypes};
						}
					).then($scope.bindActivityLive())
					.then(function(){

				//actInfo.getTheActivity(authData, $q, $stateParams.ackey)
				// $scope.res = res;

				//console.log($scope.res.uid, authData.uid )

				angular.forEach($scope.res.members, function(value, key){
					console.log(key, value);
					if(key == authData.uid && value.type == "request"){
						$scope.status = "pending";
						}
					if(key == authData.uid && value.type != "request"){
						$scope.isMember = true;
						}
					})

				$scope.mapedit = false;

				NgMap.getMap({id:'actMapLoc'}).then(function(map) {
					if($scope.res.lat2 != null){
							$scope.marker = {lat:$scope.res.lat, long:$scope.res.long};
							$scope.marker2 = {lat:$scope.res.lat2, long:$scope.res.long2};
							$scope.twoMarkers = true;
						}


					console.log($scope.res);
					$scope.coords = { lat:$scope.res.lat, long:$scope.res.long };

					if($scope.res.uid == authData.uid){

						$scope.show = true;

					var setCoords;

					$scope.coords = { lat:$scope.res.lat, long:$scope.res.long };
					$scope.marker = $scope.coords;


					$scope.edit_my_location = function(){
						$scope.mapedit = true;

						var c = map.getCenter();
						$scope.marker3 = {lat:c.lat(), long:c.lng()};

						$scope.centerChanged = function(event) {
							var c = map.getCenter();
							$scope.marker3 = {lat:c.lat(), long:c.lng()};
							setCoords = {lat:c.lat(), long:c.lng()};

						}





					}

					$scope.set_my_location = function(){
						$scope.mapedit = false;
						$scope.marker = $scope.marker3;
						$scope.coords = $scope.marker3;

						actInfo.setTheActivityLocation(authData, $q, $stateParams.ackey, $scope.marker)
							.then(function(res){
								var alertPopup = $ionicPopup.alert({template: 'new location set' });
								alertPopup  })


					}












					


					}else{
						$scope.show = false;
						$scope.marker = $scope.coords;

						}



					})

				$ionicLoading.hide();

					})

	  $scope.getMap = function(){


		actInfo.getLocation(authData, $q, $cordovaGeolocation)
		 	.then(function(res){
				$scope.coords = { lat: res.lat, long: res.long};

				})
		NgMap.getMap({id:'foomap'}).then(function(map) {
				var c = map.getCenter();
				$scope.marker = {lat:c.lat(), long:c.lng()};
			$scope.centerChanged = function(event) {
				var c = map.getCenter();
				$scope.marker = {lat:c.lat(), long:c.lng()};
			}
		})

		} // getMap ends

	  $scope.AcceptMember = function(tkey){

		  searchInfo.AcceptGroupMemberRequest(tkey, $stateParams.ackey, $q)
		  	.then(function(){
				var alertPopup = $ionicPopup.alert({
							 template: 'Request Accepted'
						   		}); alertPopup
				})
		  }

	  $scope.DeleteMember = function(tkey, type){
		  searchInfo.RemoveGroupMember(tkey, $stateParams.ackey, type, $q)
		  	.then(function(){
				var alertPopup = $ionicPopup.alert({
							 template: type + 'deleted'
						   		}); alertPopup
				})
		  }

	  $scope.NewActData = {};
	  $scope.updateActivity = function(){
		var actype = $scope.cActivityList.repeatSelect;
        var accity = $scope.NewActData.city;
		var acdate = $scope.dobValue;
		var actime = $scope.timeValue;

         var actData = {
                type : actype,
                city : accity,
                date : acdate,
                time : actime
        	};


        console.log(actData);
        if(actype == null || accity == null ||
           (actime == null || actime == "Time not selected") ||
           (acdate == null || acdate == "No date selected") ){

            var alertPopup = $ionicPopup.alert({
					 title: '',
					 template: 'Complete the form'
				   });
				   alertPopup
				   return false;


        }else{

            actInfo.updateTheActivity(authData, $q, $stateParams.ackey, actData)
                .then(function(res){
                        var alertPopup = $ionicPopup.alert({template: 'Activity updates' });
                       	alertPopup.then(function(){
                           //$scope.closeModal();
						   return true;
                           })
                    });



        }

	} // updateActivity() ends

	   // A confirm dialog
	  $scope.showConfirm = function(){
		   var confirmPopup = $ionicPopup.confirm({
			 title: 'Remove Request',
			 template: 'Are you sure you want to remove from this group'
		   });

		   confirmPopup.then(function(res) {
				 if(res) { actInfo.removeMeFromActivity(authData, $stateParams.ackey, $q)
				 			.then(function(res){ $scope.status = "clear";})
			 }
		   });
		 };

	  $scope.confirmMemberRequest = function(){
		  var confirmPopup = $ionicPopup.confirm({
			 title: 'Remove Request',
			 template: 'Are you sure you want to remove from this group'
		   });

		   confirmPopup.then(function(res) {
				 if(res) {
				 		/*actInfo.removeMeFromActivity(authData, $stateParams.ackey, $q)
				 			.then(function(res){ console.log}) */
			 		}
		   });
		  }


	  $scope.JoinDateCheck = {  value1 : true, value2 : true };
	  $scope.CarCapacity = {value: null}
	  $scope.HomeCapacity = {value: null}
	  $scope.AvailableHours = {value:null}
	  $scope.PerPersonCharges = {value: null}

	  $scope.sendRequestAs = function(JoinAs){



		if( (JoinAs == 'driver' && $scope.JoinDateCheck.value1 == false)
				|| ( JoinAs == 'driver' && ($scope.JoinDateCheck.value1 == false || $scope.JoinDateCheck.value2 == false ) )
				|| ( JoinAs == 'host' && $scope.JoinDateCheck.value1 == false )
		 ){
			var alertPopup = $ionicPopup.alert({
					 template: 'you must be available at date and time'
				   });alertPopup
			}
		else if(
			   (JoinAs == 'driver' &&
			   ($scope.CarTypeList.repeatSelect == null || $scope.CarCapacity.value == null ||
			   $scope.AvailableHours.value == null || $scope.PerPersonCharges == null )) ||

			   (JoinAs == 'passenger' && $scope.AvailableHours.value == null ) ||

			   (JoinAs == 'host' &&
			   ($scope.AccTypeList.repeatSelect == null || $scope.HomeCapacity.value == null ||
			   $scope.AvailableHours.value == null || $scope.PerPersonCharges == null ))


			  ){

				var alertPopup = $ionicPopup.alert({
						 template: 'Complete the form'
					   }); alertPopup

			}else{
					var JoinActData = {
							carType : $scope.CarTypeList.repeatSelect,
							carCapacity : $scope.CarCapacity.value,
							homeCapacity : $scope.HomeCapacity.value,
							homeType : $scope.AccTypeList.repeatSelect,
							AvailaleHours : $scope.AvailableHours.value,
							charges: $scope.PerPersonCharges.value,
							location: $scope.marker
						};

					searchInfo.sendGroupDetailRequest(authData, $stateParams.ackey, JoinActData, JoinAs,  $q)
						.then(function(res){

							var alertPopup = $ionicPopup.alert({
							 template: 'Request Sent'
						   		}); alertPopup.then(function(){ $scope.status = "pending"; $scope.closeModal()});


						})


			}









	}





	  $ionicModal.fromTemplateUrl('templates/edit-activity.html', {
			scope: $scope,
			animation: 'slide-in-up'
		  }).then(function(modal) {
			$scope.modal = modal;
		  });
		  $scope.openModal = function() {
			$scope.modal.show();
		  };

	 $ionicModal.fromTemplateUrl('templates/join-activity.html', {
			scope: $scope,
			animation: 'slide-in-up'
		  }).then(function(modal) {
			$scope.JoinModal = modal;
		  });
		  $scope.joinActivityAs = function() {
			$scope.JoinModal.show();
		  };

	 $ionicModal.fromTemplateUrl('templates/mapdd.html', {
			scope: $scope,
			animation: 'slide-in-up'
		  }).then(function(modal) {
			$scope.MapModal = modal;
		  });
		  $scope.OpenMapModal = function() {
			$scope.MapModal.show();
			$scope.getMap();

		  };

	  $scope.Alertinfo = function(Data){
		  $scope.AlertinfoData = Data;
		  var alertPopup = $ionicPopup.alert({
				template: '<span ng-repeat="(k,v) in AlertinfoData"> {{k}} - {{v}}</span>'
						   		}); alertPopup
		  }



		  $scope.closeModal = function() {
			$scope.modal.hide();
			$scope.JoinModal.hide();
		  };
		  $scope.closeMapModal = function() {
			$scope.MapModal.hide();
		  };




		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
			$scope.modal.remove();
			$scope.JoinModal.remove();

		  });






	 $scope.datepickerObject = {
		  callback: function (val) {  //Mandatory
			datePickerCallback(val);
		  }

		};
		var datePickerCallback = function (val) {
		  if (typeof(val) === 'undefined') {
			$scope.dobValue = 'No date selected';
		  } else {
			$scope.dobValue = val.getTime();
		  }
		}

	 //timepicker
		$scope.timePickerObject = {
			  callback: function (val) {    //Mandatory
				timePickerCallback(val);
			  }
		};
			function timePickerCallback(val) {
			  if (typeof (val) === 'undefined') {
				$scope.timeValue = 'Time not selected';
			  } else {
				var selectedTime = new Date(val * 1000);
				$scope.timeValue = selectedTime.getUTCHours() + ':'+ selectedTime.getUTCMinutes();

			  }
			}

	$scope.gotoPublicProfile = function(tkey){
		$state.go('app.searchprofile', {uid:tkey})
		}

	$scope.checkPuid = function(uid){
		if(uid == authData.uid){return "self";}
		else{return "other"}
		}


	$scope.msg = {};
	$scope.sendmsg = function(){
		chatlink.pushGroupmsg(authData.uid, $stateParams.ackey, $scope.msg.text, $q)
		.then(function(){$scope.msg = {};
		});
		}
    $scope.sendMsgImage = function(){
                var options = {
					quality : 75,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
					allowEdit : true,
					encodingType: Camera.EncodingType.JPEG,
					popoverOptions: CameraPopoverOptions,
					targetWidth: 300,
					targetHeight: 300,
					saveToPhotoAlbum: false
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {

                    chatlink.pushGroupImg(authData.uid, $stateParams.ackey, imageData, $q)
                        .then(function(){$scope.msg = {}; });
				}, function(error) {
					console.error(error);
				});
    }

	$scope.removeAct = function(key){
		actInfo.removeActivity(key, $q)
			.then(function(res){});
		}

})
.controller('ViewActGroupCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, getProfileInfo, authlogin, actInfo, getGlobals, $cordovaGeolocation, $ionicPopup,$ionicHistory, chatlink, $ionicScrollDelegate) {

	$ionicLoading.show({  template: 'loading ...'	});
	var authData = authlogin.verify();
	actInfo.getTheActivity(authData, $q, $stateParams.ackey)
			.then(function(res){
				$scope.res = res;
				$ionicLoading.hide();
				$scope.syncChat();
					})


	$scope.syncChat = function(){
		 var uuid = $scope.uuid;
		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/activities/"+$stateParams.ackey+"/conversation");
		 // sync as object for sync as sent
		 var syncObject = $firebaseObject(ref);
		 $scope.convlist = syncObject;
  		 syncObject.$bindTo($scope, 'convlist');

			 $scope.$watch('convlist', function(newValue, oldValue) {
				$ionicScrollDelegate.scrollBottom(false);
				 $ionicLoading.hide();
			  }, true);

		} // profilesList function ends

	$scope.msg = {};
	$scope.sendmsg = function(){

		actInfo.addActMember(authData, $stateParams.ackey, $q)
			.then(function(res){console.log(res)})

		chatlink.pushGroupmsg($stateParams.uid, $stateParams.ackey, $scope.msg.text, $q)
			.then(function(){$scope.msg = {};});
		}


})
.controller('inboxCtrl', function($scope,$ionicPopup, $state, $stateParams, $q, $firebaseObject, BeFriend, getProfileInfo, authlogin) {

	var authData = authlogin.verify();
	BeFriend.dummyRequest(authData, $q)
	 .then(function(authData){$scope.ProfilesList(authData)});

	$scope.ProfilesList = function(authData){
		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/BeFriend");
		 var c = ref.orderByChild('type').equalTo('request');
		 var d = ref.orderByChild('type').equalTo('sent');
		 var e = ref.orderByChild('type').equalTo('friend');
		 // sync as object for sync as sent
		 var syncObject = $firebaseObject(c);
		 $scope.inboxlist = syncObject;
  		 syncObject.$bindTo($scope, 'inboxlist');
		 // sync as object for sync as sent
		 var syncObject2 = $firebaseObject(d);
		 $scope.inboxlistd = syncObject2;
  		 syncObject2.$bindTo($scope, 'inboxlistd');
		 //sync as object friend
		 var syncObject3 = $firebaseObject(e);
		 $scope.inboxlistf = syncObject3;
  		 syncObject3.$bindTo($scope, 'inboxlistf');
		} // profilesList function ends

	$scope.gotoPublicProfile = function(tkey){
		$state.go('app.searchprofile', {uid:tkey})
		}

	$scope.AcceptRequest = function(inboxlist, index, frienduid) {
		BeFriend.asFriendRequest(authData, frienduid, $q)
	}; // showConfirm ends
	$scope.deleteRequest = function(inboxlist, index, frienduid) {
		BeFriend.deleteRequest(authData, frienduid, $q)
	}; // showConfirm ends

})
.controller('AddRequestCtrl', function($scope, $state,$ionicPopup, $stateParams, $q,$timeout, $firebaseObject, BeFriend, getProfileInfo, authlogin) {

	var authData = authlogin.verify();
	var uid = $stateParams.uid;
	$scope.id = uid;
	getProfileInfo.publicProfile(uid, $q)
				.then(function(aprofile){ $scope.setValuesToProfile(aprofile) }).
				then(function(){$scope.ProfilesList()});

	$scope.setValuesToProfile = function(Profile){

			$scope.ilist = Profile;
			$scope.loading = "";
		} // setValuesToProfile ends
	$scope.showInfo = function(){
		// An alert dialog
			   var alertPopup = $ionicPopup.alert({
				 title: 'About me',
				 template: 'Age: ' + $scope.ilist.profile.age + '<br/>Gender: ' + $scope.ilist.profile.gender
			   });
		} // showInfo ends

	// check request is done
	BeFriend.checkRequest(authData, $stateParams.uid, $q)
			.then(function(response){

				$scope.chicon = "fa-arrow-circle-left";
				$scope.cBlock = "search again";
				$scope.chlink = "search";
				if(response){$scope.hicon = "fa-check-circle-o";$scope.htext = "Request sent";}
				else{$scope.hicon = "fa-smile-o";$scope.htext = "Let's Hang";}
				 });

	// check request is done
	BeFriend.CheckFriendRequest(authData, $stateParams.uid, $q)
			.then(function(response){
				$scope.type = response;

				$scope.chicon = "fa-arrow-circle-left";
				$scope.cBlock = "search again";
				$scope.chlink = "search";
				switch(response){
					case 'sent':
						$scope.hicon = "fa-check-circle-o";
						$scope.htext = "Request sent";
					break;
					case 'request':
						$scope.hicon = "fa-user-plus";
						$scope.htext = "Add friend";
					break;
					case 'block': break;
					case 'unblock': break;
					case 'friend':
						$scope.hicon = "fa-user-times";
						$scope.htext = "un-Friend";
						$scope.cBlock = "Lets Chat";
						$scope.chicon = "fa-comments-o";
						$scope.chlink = "chat/"+$stateParams.uid;
					break;	}
				});

	// customized lets hang function
	// lets hang button request function
	$scope.letsHang = function(){
		switch($scope.type){
					case 'sent':break;
					case 'request':
						BeFriend.asFriendRequest(authData, $stateParams.uid, $q)
						.then(function(response){
							$scope.hicon = "fa-user";
							$scope.htext = "Thanks ...";
							$timeout(function() {	$state.go('app.profile');}, 1000);
							});
					break;
					case 'block': break;
					case 'unblock': break;
					case 'friend':
						BeFriend.deleteRequest(authData, $stateParams.uid, $q)
						.then(function(response){
							$scope.hicon = "fa-user";
							$scope.htext = "Its OK";
							$timeout(function() {	$state.go('app.profile');}, 1000);
							});
					break;
					case 'unfriend': break;
					}
		} // letsHang ends

	$scope.ProfilesList = function(){
		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+uid);
		 var c = ref.child("BeFriend").orderByChild('type').equalTo('friend');
		 var d = ref.child("images");
		 var syncObject = $firebaseObject(c);
		 $scope.friendlist2 = syncObject;
		 syncObject.$bindTo($scope, 'friendlist2');

		 // sync as object for sync as sent
		 var syncObject = $firebaseObject(d);
		 $scope.imagelist = syncObject;
  		 syncObject.$bindTo($scope, 'imagelist');




		} // profilesList function ends




})
.controller('cardsCtrl', function($scope, $state,$ionicPopup, $stateParams, $q,$timeout, $firebaseObject, BeFriend, getProfileInfo, authlogin, $ionicLoading, TDCardDelegate, actInfo, $cordovaGeolocation, $document, searchInfo) {

  var authData = authlogin.verify();
  getProfileInfo.myProfilePicture(authData, $q)
		.then(function(image){
			$scope.profileImage = image;
			})
  var cardTypes = [];

  searchInfo.tdSearch(authData, $q)
  	.then(function(res){
		//console.log(res);
		$ionicLoading.show({ template: 'loading ...' });
		$scope.tewaks = res.tweaks;
		//console.log(res.result);console.log(res.tweaks);
		angular.forEach(res.result, function(value, key){
			//console.log(key,value);
			searchInfo.isFriend(authData, key, $q)
				.then(function(resolve){
				//console.log(resolve);
				if( !resolve && (
						(!res.tweaks.male
							&& value.profile.gender == "female"
								&& value.profile.age <= res.tweaks.maleage	)
					|| 	(res.tweaks.male
							&& value.profile.gender == "male"
								&& value.profile.age <= res.tweaks.maleage	))
					){
							//console.log(value);console.log(res.rest);
							actInfo.getDistance(res.rest.lat,res.rest.long,
													value.profile.location.lat,
													value.profile.location.long,  $q)
								.then(function(distance){
									value['distance'] = Math.round(distance);
									cardTypes.push({key:key,value:value});
									$scope.inCards(cardTypes);
								})
							}
					})
			})

		$ionicLoading.hide();

		})



		$scope.inCards = function(cardTypes){
			  console.log(cardTypes.length);
			  $scope.clength = cardTypes.length;
			  $scope.cards = {
				master: Array.prototype.slice.call(cardTypes, 0),
				active: Array.prototype.slice.call(cardTypes, 0),
				discards: [],
				liked: [],
				disliked: []
			  }
			  $scope.clength = $scope.cards.active.length;

			  $scope.cardDestroyed = function(index) {
				$scope.cards.active.splice(index, 1);
			  };

			  $scope.addCard = function() {
				var newCard = cardTypes[0];
				$scope.cards.active.push(angular.extend({}, newCard));
			  }

			  $scope.refreshCards = function() {

				var q = $q.defer();
				var promise = q.promise;
				promise.then(function(){
						angular.forEach($scope.cards.master, function(value, key){
							//console.log(key, value);
								if(value.remove){$scope.cards.master.splice(key,1);}
							})
					}).then(function(){
						// Set $scope.cards to null so that directive reloads
							$scope.cards.active = null;
							$timeout(function() {
							  $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
							  $scope.clength = $scope.cards.active.length;
							});


						})
						q.resolve();
			  }

			  $scope.$on('removeCard', function(event, element, card) {
				var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
				$scope.cards.discards.push(discarded);
			  });

			  $scope.cardSwipedLeft = function(index) {
				//console.log('LEFT SWIPE', index);
				var card = $scope.cards.active[index];
				$scope.cards.disliked.push(card);
				$scope.clength = $scope.clength - 1;
			  };

			  $scope.setCount = function(index){
				  $scope.count = index;
				  }

			  $scope.cardSwipedRight = function(index) {
				//console.log('RIGHT SWIPE', index);
				var card = $scope.cards.active[index];
				$scope.clength = $scope.clength - 1;
				BeFriend.sendRequest(authData, card.key, $q)
					.then(function(res){
						card['remove'] = true;
						$scope.cards.liked.push(card);
						});

			  };

			  $scope.BcardSwipedLeft = function(index) {
				//console.log('LEFT SWIPE', index);
				var card = $scope.cards.active[index];
				//alert(card.key);
				$scope.cards.disliked.push(card);
				$scope.cards.active.splice(index, 1);
				$scope.clength = $scope.clength - 1;
				console.log($scope.clength);


			  };

			  $scope.BcardSwipedRight = function(index) {
				//console.log('RIGHT SWIPE', index);
				var card = $scope.cards.active[index];
				$scope.clength = $scope.clength - 1;
				//alert(card.key);
				BeFriend.sendRequest(authData, card.key, $q)
					.then(function(res){
						card['remove'] = true;
						$scope.cards.liked.push(card);
						$scope.cards.active.splice(index, 1);

						});


			  };



		}




})
.controller('DiscoverCtrl', function($scope,$state, $stateParams, $q,$ionicLoading, $firebaseObject, getProfileInfo, authlogin) {

	 $ionicLoading.show({
		  template: 'loading ...'
		});

	var authData = authlogin.verify();
	$scope.cuid = authData.uid;
	getProfileInfo.profilesList($q)
	 .then(function(Profiles){$scope.ProfilesList(Profiles)});

	$scope.ProfilesList = function(Profiles){
		angular.forEach(Profiles, function(value, key) {
			$scope.ilist = Profiles;});
		$ionicLoading.hide();
		} // profilesList function ends


})
.controller('PublicProfileCtrl', function($scope, $state, $stateParams, $q, $firebaseObject, getProfileInfo, BeFriend, authlogin, $ionicPopup, $ionicHistory, photolink,$cordovaGeolocation, searchInfo, 	NgMap, actInfo, $ionicTabsDelegate) {

	$scope.selectTabWithIndex = function(index) {
		$ionicTabsDelegate.select(index);
	  }


	var authData = authlogin.verify();
	$scope.myuid = authData.uid;
	var uid = $stateParams.uid;
	$scope.id = uid;
	getProfileInfo.publicProfile(uid, $q)
				.then(function(aprofile){ console.log(aprofile);
					$scope.setValuesToProfile(aprofile); })
				.then(function(){
					$scope.ProfilesList();
					})
				.then(function(){
					$scope.isLiked();
					});;


	$scope.setValuesToProfile = function(Profile){
		// function of success
			$scope.ilist = Profile;
			$scope.loading = "";
			NgMap.getMap({id:'MyLocation'}).then(function(map) {
				$scope.coords = { lat: $scope.ilist.profile.location.lat, long: $scope.ilist.profile.location.long};
				})

			// calculate distance
			searchInfo.getmyCLocation(authData, $q)
				.then(function(myCoords){
					$scope.myC = {x:myCoords.lat, y:myCoords.long}

							    var x1 = $scope.myC.x;
								var x2 = $scope.ilist.profile.location.lat;
								var y1 = $scope.myC.y;
								var y2 = $scope.ilist.profile.location.long;

								actInfo.getDistance(x1,y1,x2,y2,$q)
									.then(function(res){
										$scope.myDistance = Math.round(res);
										})
			})


		} // setValuesToProfile ends



	$scope.showInfo = function(){
		// An alert dialog
			   var alertPopup = $ionicPopup.alert({
				 title: 'About me',
				 template: 'Age: ' + $scope.ilist.profile.age + '<br/>Gender: ' + $scope.ilist.profile.gender
			   });
		} // showInfo ends




	// check request is done
	BeFriend.checkRequest(authData, $stateParams.uid, $q)
			.then(function(response){

				$scope.chicon = "ion-chevron-left";
				$scope.cBlock = "search again";
				$scope.chlink = "search";
				if(response){

					BeFriend.CheckFriendRequest(authData, $stateParams.uid, $q)
						.then(function(check){
							$scope.htext = check;
							})

					$scope.hicon = "ion-checkmark-round"; //$scope.htext = "Request sent";

					}
				else{$scope.hicon = "ion-happy";$scope.htext = "Let's friend";}
				 });


	// lets hang button request function
	$scope.letsHang = function(){
		$scope.hicon = "ion-checkmark-round";
		$scope.htext = "sent";
			if (authData) {
			getProfileInfo.publicProfile($stateParams.uid, $q)
			.then(function(friendProfile){
				BeFriend.sendRequest(authData, $stateParams.uid, $q)
				.then(function(response){ //console.log(response)
				 });});
			} else {
			  //console.log("mistake");
			}
		} // letsHang ends

	$scope.ProfilesList = function(){

		 var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+$stateParams.uid);
		 //var c = ref.child("BeFriend").orderByChild('type').equalTo('friend');
		 var d = ref.child("images");
		 //var syncObject = $firebaseObject(c);
		 //$scope.friendlist2 = syncObject;
		 //syncObject.$bindTo($scope, 'friendlist2');

		 // sync as object for sync as sent
		 var syncObject2 = $firebaseObject(d);
		 $scope.imagelist = syncObject2;
  		 syncObject2.$bindTo($scope, 'imagelist');


		} // profilesList function ends

	$scope.isLiked = function(array){
		console.log(array);
		if(array != 'undefined'){
			angular.forEach(array, function(value, key){
				console.log(key, value)
				return true;
				})
			}
		else{
			return false;
			}
		}


	$scope.likePic = function(key, isChecked){

		var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"
					+$stateParams.uid+"/images/"+key);
		if(isChecked){
			ref.child('likes').child(authData.uid).set(true);
			}
		else{
			ref.child('likes').child(authData.uid).remove();
			}

		actInfo.countLikes($stateParams.uid, key, $q)
			.then(function(res){ })

		}
	$scope.preLiked = function(key){
		var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"
					+$stateParams.uid+"/images/"+key+"/likes");
		ref.once("value", function(snapshot){
			var hasChild = snapshot.hasChild(authData.uid)
			if(hasChild === true){console.log(true); return true ;}
			else{ console.log(false);return false;};
			})

		}

})
.controller('settingCtrl', function($scope, $state,$ionicPopup, $ionicModal, $stateParams, $q, $firebaseObject, getProfileInfo, authlogin, BeFriend, $ionicHistory, $firebaseArray, $rootScope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, getGlobals, $cordovaGeolocation, $ionicLoading, $timeout, actInfo, NgMap){

    $ionicLoading.show({ template: 'loading ...' });
	var authData = authlogin.verify();
    if (authData) {
	$scope.hasdob = false;
	// initially get the variables

	$scope.dobValue = 'Date of Birth';
	$scope.datepickerObject = {
		callback: function (val) { //Mandatory
			getProfileInfo.validatedob(val, $q)
			.then(function(res){
				      var dob = res.dob.getTime();
					  getProfileInfo.updateDob(authData, $q, dob, res.age);
					  $scope.hasdob = true;
				  },function(res){
						var alertPopup = $ionicPopup.alert({
							 title: '',	 template: 'your age must be 18 years or above'
						   });
						   alertPopup.then(function(res){});
						});
		  }
		};

	$scope.loading = "loading ...";
     getProfileInfo.checkDob(authData, $q)
	 .then(function(res){$scope.hasdob = true;},
	 		function(res){$scope.hasdob = false;})
	 .then(function(){
		 //$scope.geoLocation();
		 $scope.bindInterestLive();
		 $scope.getGroups();
		 $scope.searchTweaks();
		 $timeout(function() {$ionicLoading.hide();}, 1000);
		 });

	}else{
		$state.go('login');
		}


   // Create the login modal that we will use later
   $ionicModal.fromTemplateUrl('templates/mapd.html', {
				scope: $scope
			  }).then(function(modal) {
				$scope.modal = modal;
			  });

   $scope.closeTerms = function(){
				$scope.modal.hide();
				}

   $scope.logout = function(){
	  authlogin.logout();
	  $scope.NetworkMsg = "";
	  $ionicHistory.clearCache();
	  $state.go('login',{}, {reload: true});
	  $ionicLoading.hide();

	  }

  $scope.toggleGender = function(){
	  if($scope.ilist2.male == true){$scope.ilist2.male = false }
	  else{ $scope.ilist2.male = true}

	  }



  $scope.mapshow = function(){

		actInfo.getCoords(authData, $q)
		 	.then(function(res){
				 NgMap.getMap({id:'foomap'}).then(function(map) {
					  map.setZoom(11);
					  $scope.coords = {
						lat:res.lat,
						long: res.long
						}
					$scope.modal.show();
					});

				})

		}

	$scope.searchTweaks = function(){

		var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/searchTweaks");
		var syncObject = $firebaseObject(ref);
		$scope.ilist2 = syncObject;
		syncObject.$bindTo($scope, 'ilist2');
		}


	$scope.bindInterestLive = function(){
		var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/profile");
		var syncObject = $firebaseObject(ref);
		$scope.ilist = syncObject;
		syncObject.$bindTo($scope, 'ilist');
		} // end bindInterestLive

	$scope.getGroups = function(){
		  var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/"+authData.uid+"/profile");
		  getGlobals.sethobbies(authData,$q);
		  getGlobals.setlanguages(authData,$q);

		  $scope.groups = [];


		  getGlobals.languages(authData, $q)
			.then(function(res){
				$scope.languages = res;
			})

		  $scope.langValue = function(key){
			  getProfileInfo.setMyLanguage(authData, $q, key)
			  	.then(function(res){
					console.log(res);
					});
			}

		  /*
		   * if given group is the selected group, deselect it
		   * else, select the given group
		   */
		  $scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {$scope.shownGroup = null;}
			else {$scope.shownGroup = group;}
		  };
		  $scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		  };


	  }



	$scope.DeleteProfile = function(){

		var testLine = authData.uid;
		  if (testLine.indexOf("facebook") != -1 || testLine.indexOf("google") != -1 ) {
			  $scope.showConfirm();
			}else{
				$state.go('delete-login');
				}


	} // DeleteProfile ends


	$scope.resetPassword = function(){
		$state.go('reset-password', {id: "change"});
	} // DeleteProfile ends


	$scope.showConfirm = function() {
		 var confirmPopup = $ionicPopup.confirm({
		   title: 'Delete Profile',
		   template: 'Are you sure you want to delete your profile?'
		 });
		 confirmPopup.then(function(res) {
		   if(res) {
			 getProfileInfo.socialdeleteProfile(authData, $q)
			 	.then($scope.deleteSuccessful());

		   } else {
			 // console.log('You are not sure');
		   }
		 });
	}; // showConfirm ends

	$scope.deleteSuccessful = function(){
		  authlogin.logout();
		  $scope.NetworkMsg = "please sign in";
		  $ionicHistory.clearCache();
		  $state.go('login',{}, {reload: true});
		};



	})
.controller('mapCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, $stateParams,$ionicHistory, $state, $firebaseAuth, getProfileInfo, authlogin, $q, NgMap, $cordovaGeolocation, $rootScope, actInfo, $window) {

  /*$ionicLoading.show({ template: 'loading ...' });
  $scope.showMap = true;
  var authData = authlogin.verify();
	actInfo.getLocation(authData, $q, $cordovaGeolocation)
		.then(function(res){
				$scope.coords = {
				  lat : res.lat,
				  long : res.long}
				  console.log($scope.coords);
			$scope.showMap = true;
			$timeout(function() {$ionicLoading.hide();}, 2000);
			},function(res){
				alert(res);
				});
	*/

})
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

;
