// JavaScript Document

angular.module('starter.services', [])
.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
})
.factory('AppInit', function ($q, $cordovaSplashscreen, $ionicPlatform, $timeout) {
    return {
        splash: function() {

            var deferred = $q.defer();

                document.addEventListener("deviceready", function () {

                    var type = $cordovaNetwork.getNetwork();
                    var isOnline = $cordovaNetwork.isOnline();
                    var isOffline = $cordovaNetwork.isOffline();

                    // listen for Online event
                    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                      var onlineState = networkState;
                      alert(onlineState);
                      alert("you are online");
                      $timeout(function(){
                            $cordovaSplashscreen.hide();
                            deferred.resolve();
                        }, 3500);
                    })

                    // listen for Offline event
                    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                      var offlineState = networkState;
                      alert(offlineState);
                      alert("you are offline");
                    })

                  }, false);



            return deferred.promise;

        }
    };
})
.factory('authlogin', [ function($http, $q, createDBentry) {

	var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/");

	return{
		verify: function(){
			var authData = ref.getAuth();
			if(authData){ return authData;}
			else{ return false;}
			},
		logout:function(){
			ref.unauth();
			return true;
			},
		emaillogin:function(email, password, $q){
			var q = $q.defer();
			var flag = false;

			ref.authWithPassword({email:email, password:password},
				 function(error, authData) {
					  if (error) { q.reject(flag); }
					  else { flag = true; q.resolve(flag) }
				  });
			return q.promise;

			},
		sociallogin:function(social, $q){
			var q = $q.defer();
			var flag = false;
			ref.authWithOAuthPopup(social, function(error, authData) {
			  if (error) {q.reject(flag);}
			  else {flag = true; q.resolve(authData);}
			});
			return q.promise;
			}

	 }


	}])
.factory('createUser', ['$firebase',  function($http, $firebase, createDBentry) {
	var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/");

	return{
		checkmailexist:function(email, $q){
			var q = $q.defer();
			var flag = false;
			ref.child('users').orderByChild('profile/email').equalTo(email).once("value", function(snap) {
				var a = snap.exists();
					console.log(a);
					q.resolve(a);
    				});
			return q.promise;
			},
		emaillogin:function(email, password, $q){
			var q = $q.defer();
			var flag = false;
			ref.createUser({email:email,password:password},
			 function(error, authData) {
			  if (error) {q.reject(error);}
			  else {flag = true;q.resolve(authData); }
			});
			return q.promise;
			}


		}

	}])
.factory('createDBentry', ['$firebase',  function($http, $firebase, SubmitUserProfile) {

	var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/users/");
	return{
		emailEntry:function(authData, regData, $q){
			var q = $q.defer();
			var remoteUser = ref.child(authData.uid);
			remoteUser.once("value", function(snapshot) {
				  var hasProfile = snapshot.hasChild("profile");
				  if(hasProfile === true){ q.resolve(true);}
				  else{
					  var emale = false;
					  var efemale = false;
					  if(regData.gender == "male"){ efemale = true; }
					  if(regData.gender == "female"){ emale = true; }

					  remoteUser.set({
						  timestamp: Firebase.ServerValue.TIMESTAMP,
						  profile:{
								name :regData.fullname,
								age: regData.age,
								dob: regData.dob,
								gender: regData.gender,
								picture: regData.picture,
								email: regData.email
						  },
						  searchTweaks:{
							    distance: 100,
								male: emale,
								female: efemale,
								maleage: 35,
								femaleage: 30
						  }


					});

					q.reject(false);}
				});
			return q.promise;
			},
		socialEntry:function(authData, social, $q){
			var q = $q.defer();
			var remoteUser = ref.child(authData.uid);
			remoteUser.once("value", function(snapshot) {
				  var hasProfile = snapshot.hasChild("profile");
				  if(hasProfile === true){ q.resolve(true);}
				  else{switch(social){
					  case 'facebook':
					  remoteUser.set({
						  timestamp: Firebase.ServerValue.TIMESTAMP,
						  profile:{
								name :authData.facebook.displayName,
								gender: authData.facebook.cachedUserProfile.gender,
								picture: authData.facebook.profileImageURL
						  },
						  searchTweaks:{
							    distance: 100,
								male: emale,
								female: efemale,
								maleage: 35,
								femaleage: 30
						  }
						  });
					  break;
					  case 'google':

					  break;} q.reject(false);}
				});
			return q.promise;
			}


		}
	}])
.factory('getProfileInfo', ['$firebase','$firebaseObject',  function($http, $firebase, $firebaseObject) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		myProfile:function(authData, $q){
			var q = $q.defer();
			ref.child('users').child(authData.uid).on("value", function(snapshot) {
			  q.resolve(snapshot.val());
			}, function (errorObject) {
			  q.reject(errorObject.code);
			});
			return q.promise;
			},
		myProfilePicture:function(authData, $q){
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/profile/picture').on("value", function(snapshot) {
			  q.resolve(snapshot.val());
			}, function (errorObject) {
			  q.reject(errorObject.code);
			});
			return q.promise;
			},
		myProfileCounts:function(authData, $q){
			var q = $q.defer();
			var friends = 0;
			var pictures = 0;
			var EvRef = ref.child('users').child(authData.uid).child('BeFriend');
			EvRef.orderByChild('type').equalTo('friend').on("value", function(snapshot){
							angular.forEach(snapshot.val(), function(){
								friends = friends + 1;
							});
					});
			var PcRef = ref.child('users').child(authData.uid).child('images');
			PcRef.once("value", function(snapshot){
							pictures = snapshot.numChildren();
					});

			q.resolve({friends:friends, pictures:pictures});
			return q.promise;
			},
        setEnsInfo:function(authData, $q, e, n, s){
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/profile').update({
                education: e,
                nationality: n,
                status: s
            })
            q.resolve(true);
			return q.promise;
			},
		myGender:function(authData, $q){
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/profile/gender').on("value", function(snapshot) {
			  q.resolve(snapshot.val());
			}, function (errorObject) {
			  q.reject(errorObject.code);
			});
			return q.promise;
			},
		publicProfile:function(uid, $q){
			var q = $q.defer();
			ref.child('users').child(uid).on("value", function(snapshot) {
			  q.resolve(snapshot.val());
			}, function (errorObject) {
			  q.reject(errorObject.code);
			});
			return q.promise;
			},
		myInterest:function(authData, $q){
			var q = $q.defer();
			var remoteUser = ref.child('users').child(authData.uid).child('Interests');

			q.resolve(remoteUser);
			return q.promise;
			},
		emaildeleteProfile:function(authData, email, password, $q){
			var q = $q.defer();
			var remoteUser = ref.child('users').child(authData.uid).on("value", function(snapshot) {
			  var array = snapshot.val();
			  if(array.profile.email === email){

				ref.removeUser({
				  email: email,
				  password: password
				}, function(error) {
				  if (error) {
					switch (error.code) {
					  case "INVALID_USER":
						q.reject("The specified user account does not exist.");
						break;
					  case "INVALID_PASSWORD":
						q.reject("The specified user account password is incorrect.");
						break;
					  default:
						q.reject("Error removing user:", error);
					}
				  } else {
					q.resolve("User account deleted successfully!");
					var onComplete = function(error) {
					  if (error) {
						q.reject('Synchronization failed');
					  } else {
						q.resolve('Synchronization succeeded');
					  }
					};
					ref.child('users').child(authData.uid).remove(onComplete);
				  }
				});



				  }
			  else{q.reject("wrong attempt");}

			}, function (errorObject) {
			  q.reject(errorObject.code);
			});
			return q.promise;
			},
		socialdeleteProfile:function(authData, $q){
			var q = $q.defer();
			var remoteUser = ref.child('users').child(authData.uid);

			var onComplete = function(error) {
			  if (error) {
				q.reject('Synchronization failed');
			  } else {
				q.resolve('Synchronization succeeded');
			  }
			};
			remoteUser.remove(onComplete);

			return q.promise;
			},
		checkDob:function(authData, $q){
			var q = $q.defer();
			var dob = ref.child('users/'+authData.uid+'/profile');
			dob.on("value", function(snapshot){
				var hasNode = snapshot.hasChild('dob');
					if(hasNode === true){ q.resolve(true) }
					else{q.reject(false) }
				});
			return q.promise;
			},
		validatedob:function(val, $q){
			var q = $q.defer();
			if (typeof(val) === 'undefined') {
				  q.reject(false);
				} else {
					var dt = new Date(val);
				  	dt.setDate(dt.getDate());
				  	var currentDate = new Date();
					var diff = Math.floor((currentDate - dt) / (1000*60*60*24)) + 1;
					var yAge = Math.floor(diff/365);
					console.log(yAge);
					if(diff >= 6570){ q.resolve({dob:dt, age:yAge});	}
					else{q.reject(false)}
				} // end of second else

			return q.promise;
			},
		updateDob:function(authData, $q,yDob, yAge){
			var q = $q.defer();
			var dob = ref.child('users/'+authData.uid+'/profile');
			dob.update({
				dob: yDob,
				age: yAge
				})
			q.resolve(true);
			return q.promise;
			},
		resetPassword:function(email, $q){
			var q = $q.defer();
			ref.resetPassword({
				  email: email
				}, function(error) {
				  if (error) {
					switch (error.code) {
					  case "INVALID_USER":
						q.reject("The specified user account does not exist.");
						break;
					  default:
						q.reject("Error resetting password:", error);
					}
				  } else {
					q.resolve("Password reset email sent successfully!");
				  }
				})

			return q.promise;
			},
		changePassword:function(email, password, newpassword, $q){
			var q = $q.defer();
			ref.changePassword({
			  email       : email,
			  oldPassword : password,
			  newPassword : newpassword
			}, function(error) {
			  if (error === null) {
				q.resolve("Password changed successfully");
			  } else {
				q.reject("Error changing password:", error);
			  }
			});

			return q.promise;
			},
		profilesList:function($q){
			var q = $q.defer();
			var remoteUser = ref.child('users');
			remoteUser.once("value", function(snapshot) {
				q.resolve(snapshot.val());
				});


			return q.promise;
			},
		mysearchTweaks:function(){

			},
		setMyLanguage:function(authData, $q, key){
			console.log(key);
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/profile/mylanguage').set(key);
			q.resolve(true);
			return q.promise;
			},
		cardImages:function($q){
			var q = $q.defer();

			q.resolve(true);
			return q.promise;
			}


		}
	}])
.factory('BeFriend', function($http,$firebase, $firebaseObject, getProfileInfo, $q) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		sendRequest:function(authData, frienduid, $q){
			var q = $q.defer();

			// attach my request to my friend's ID
			getProfileInfo.myProfile(authData, $q)
			.then(function(myProfile){
				var attachMyProfile = ref.child('users').child(frienduid).child('BeFriend').child(authData.uid);
					attachMyProfile.update({
						type:'request',
						name: myProfile.profile.name,
						picture: myProfile.profile.picture
						});
				});

			// attach my friend's ID to my profile
			getProfileInfo.publicProfile(frienduid, $q)
			.then(function(myFriendProfile){
				var attachMyFriendProfile = ref.child('users').child(authData.uid).child('BeFriend').child(frienduid);
					attachMyFriendProfile.update({
						type: 'sent',
						name: myFriendProfile.profile.name,
						picture: myFriendProfile.profile.picture
						});
				});


			q.resolve('Request Sent');
			return q.promise;
			},
		checkRequest:function(authData, frienduid, $q){

			var q = $q.defer();
			ref.child('users').child(authData.uid)
							.child('BeFriend').on("value", function(snapshot) {
								  var hasNode = snapshot.hasChild(frienduid);
								  if(hasNode === true){ q.resolve(true);}
								  else{q.resolve(false)}

								});

			return q.promise;
			},
		CheckFriendRequest:function(authData, frienduid, $q){
			var q = $q.defer();
			var EvRef = ref.child('users').child(authData.uid).child('BeFriend').child(frienduid).on("value", function(snapshot) {
								  var hasNode = snapshot.val();
								  q.resolve(hasNode.type);

								});

			return q.promise;
			},
		receivedRequest:function(authData, $q){

			var q = $q.defer();
			var EvRef = ref.child('users').child(authData.uid).child('BeFriend');
			EvRef.orderByChild('type').equalTo('request').on("value", function(snapshot) {
									 q.resolve(snapshot.val());
								});

			return q.promise;
			},
		dummyRequest:function(authData, $q){

			var q = $q.defer();
			q.resolve(authData);
			return q.promise;
			},
		asFriendRequest:function(authData, frienduid, $q){
			var q = $q.defer();

			// attach the confirm to my friend's ID ... type friend
			getProfileInfo.myProfile(authData, $q)
			.then(function(myProfile){
				var attachMyProfile = ref.child('users').child(frienduid).child('BeFriend').child(authData.uid);
					attachMyProfile.update({
						type:'friend',
						name: myProfile.profile.name,
						picture: myProfile.profile.picture
						});
				});

			// attach my friend's ID to my profile ... type friend
			getProfileInfo.publicProfile(frienduid, $q)
			.then(function(myFriendProfile){
				var attachMyFriendProfile = ref.child('users').child(authData.uid).child('BeFriend').child(frienduid);
					attachMyFriendProfile.update({
						type: 'friend',
						name: myFriendProfile.profile.name,
						picture: myFriendProfile.profile.picture
						});
				});

			q.resolve('Request Sent');
			return q.promise;
			},
		deleteRequest:function(authData, frienduid, $q){

			var q = $q.defer();
			var myRef = ref.child('users').child(authData.uid).child('BeFriend').child(frienduid);
			myRef.remove();
			var HisRef = ref.child('users').child(frienduid).child('BeFriend').child(authData.uid);
			HisRef.remove();
			q.resolve("deleted");
			q.resolve(authData);
			return q.promise;
			},
		myFriendsList:function(authData, $q){

			var q = $q.defer();
			ref.child('users').child(authData.uid).child('BeFriend').orderByChild('type').equalTo('friend').on("value", function(snapshot) {
									 q.resolve(snapshot.val());
								});

			return q.promise;
			},
		sentRequests:function(authData, $q){

			var q = $q.defer();
			ref.child('users').child(authData.uid).child('BeFriend').orderByChild('type').equalTo('sent').on("value", function(snapshot) {
									 q.resolve(snapshot.val());
								});

			return q.promise;
			}



		}
	})
.factory('chatlink', function($http, $firebase, $firebaseObject, getProfileInfo) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		lastMsgs:function(uuid, $q){
			var q = $q.defer();
			var ref = new Firebase("https://luminous-heat-6224.firebaseio.com/chats/"+uuid+"/conversation");
			ref.orderByChild("time").limitToLast(10).once("value", function(snapshot) {
			  q.resolve({conv: snapshot.val()});
			});

			return q.promise;
			},

		pushmsg:function(authData, frienduid, $q, msg, uuid){
			var q = $q.defer();
			ref.child('chats').child(uuid).child('conversation').push({
						uid: authData.uid,
						msg: msg,
						time: Firebase.ServerValue.TIMESTAMP
						});
						q.resolve(true);
			return q.promise;
			},
        pushImg:function(authData, frienduid, $q, image, uuid){
			var q = $q.defer();
			ref.child('chats').child(uuid).child('conversation').push({
						uid: authData.uid,
						img: image,
						time: Firebase.ServerValue.TIMESTAMP
						});
						q.resolve(true);
			return q.promise;
			},
		pushGroupImg:function(uid, ackey, image, $q){
			var q = $q.defer();

			getProfileInfo.publicProfile(uid, $q)
				.then(function(snap){
					ref.child('activities/'+ackey+'/conversation').push({
						uid: uid,
						img: image,
						name: snap.profile.name,
						picture: snap.profile.picture,
						time: Firebase.ServerValue.TIMESTAMP
						});
					});

			q.resolve(true);
			return q.promise;
			},
		pushGroupmsg:function(uid, ackey, msg, $q){
			var q = $q.defer();

			getProfileInfo.publicProfile(uid, $q)
				.then(function(snap){
					ref.child('activities/'+ackey+'/conversation').push({
						uid: uid,
						msg: msg,
						name: snap.profile.name,
						picture: snap.profile.picture,
						time: Firebase.ServerValue.TIMESTAMP
						});
					});

			q.resolve(true);
			return q.promise;
			},
		uuidCheck:function(authData, frienduid, $q){
			var q = $q.defer();
			var checkMyProfile = ref.child('users').child(authData.uid).child('chatlist').child(frienduid);
				checkMyProfile.on("value", function(snapshot) {
					var hasNode = snapshot.hasChild("uuid");
								  if(hasNode === true){
									var uuid = snapshot.val();
									q.resolve(uuid)
									}
								  else{
									q.reject(false);
								  }
								});
			return q.promise;
			},
		AddToChat:function(authData, frienduid, $q){
			var q = $q.defer();
			var uuid = authData.uid+"-"+frienduid;

			// attach my ID to my friend's profile ... uuid
			getProfileInfo.myProfile(authData, $q)
			.then(function(myProfile){
				var attachMyProfile = ref.child('users').child(frienduid).child('chatlist');
				attachMyProfile.on("value", function(snapshot) {
					var hasNode = snapshot.hasChild(authData.uid);
								  if(hasNode === true){
									//q.resolve(true)
									}
								  else{
									attachMyProfile.child(authData.uid).update({uuid:uuid});
									  // q.resolve(false)
								  }
								});
				}).then(function(response){


			// attach my friend's ID to my  profile ... uuid
			getProfileInfo.publicProfile(frienduid, $q)
			.then(function(myFriendProfile){
				var attachMyProfile = ref.child('users').child(authData.uid).child('chatlist');
				attachMyProfile.on("value", function(snapshot) {
					var hasNode = snapshot.hasChild(frienduid);
								  if(hasNode === true){
									// q.resolve(true);
									}
								  else{
									attachMyProfile.child(frienduid).update({uuid:uuid});
									  //q.resolve(false)
								  }
								});
				})
			}).then(function(response){

			// create same uuid for chat messages in chats
			var chatlistentry = ref.child('chats');
				chatlistentry.on("value", function(snapshot) {
					var hasNode = snapshot.hasChild(uuid);
								  if(hasNode === true){
									q.resolve(uuid);}
								  else{
									chatlistentry.child(uuid).update({me:authData.uid, you:frienduid});
									  q.resolve(uuid);
								  }
								})
			})
			return q.promise;
			},



		}
	})
.factory('photolink', function($http, $firebase,$q, $firebaseObject, getProfileInfo) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		numChildren:function(authData, $q){
			var q = $q.defer();
			var photoUpload = ref.child('users').child(authData.uid).child('images');
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
				photoUpload.push({image: imageData}).then(function() {
					q.resolve("Image has been uploaded");
					alert("Image has been uploaded");
				});
			}, function(error) {
				q.reject(error);
			});




			return q.promise;
			},
		getPublicPhotos:function(uid,$q){
			var q = $q.defer();
			var photoList = ref.child('users').child(uid);
			photoList.once("value", function(snapshot){

				var hasNode = snapshot.hasChild("images");
				/*if(hasNode === true){console.log("yes photos")}
				else{console.log("no photos")}*/

				});


			return q.promise;


			}



		}
	})
.factory('getGlobals', function($http, $firebase,$q, $firebaseObject, getProfileInfo, $cordovaGeolocation) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		hobbies:function(authData, $q){
			var q = $q.defer();
			var global = ref.child('globals/hobbies');
			global.on("value", function(snapshot){
				q.resolve(snapshot.val());
				});

			return q.promise;
			},
		hobbies2:function(authData, $q){
			var q = $q.defer();
			var global = ref.child('globals/hobbies2');
			global.once("value", function(snapshot){
				q.resolve(snapshot.val());
				});

			return q.promise;
			},
		sethobbies:function(authData, $q){
			var q = $q.defer();
			var hobbies = ref.child('users/'+authData.uid+'/profile');
			hobbies.on("value", function(snapshot){
				var hasNode = snapshot.hasChild('hobbies');
					if(hasNode === true){ q.resolve(true) }
					else{
						hobbies.update({hobbies:{i:true}});
						q.resolve(false)  }
				});

			return q.promise;
			},
		languages:function(authData, $q){
			var q = $q.defer();
			var global = ref.child('globals/languages');
			global.on("value", function(snapshot){
				q.resolve(snapshot.val());
				});

			return q.promise;
			},
		setlanguages:function(authData, $q){
			var q = $q.defer();
			var hobbies = ref.child('users/'+authData.uid+'/profile');
			hobbies.on("value", function(snapshot){
				var hasNode = snapshot.hasChild('languages');
					if(hasNode === true){ q.resolve(true) }
					else{
						hobbies.update({languages:{i:true}});
						q.resolve(false)  }
				});

			return q.promise;
			},
		activities:function(authData, $q){
			var q = $q.defer();
			var global = ref.child('globals/actypes');
			global.on("value", function(snapshot){
				q.resolve(snapshot.val());
				});

			return q.promise;
			},
        education:function(authData, $q){
            var q = $q.defer();
			var global = ref.child('globals/Education');
			global.on("value", function(snapshot){
				q.resolve(snapshot.val());
				});
			return q.promise;
            },
        mstatus:function(authData, $q){
            var q = $q.defer();
			var global = ref.child('globals/Status');
			global.on("value", function(snapshot){
				q.resolve(snapshot.val());
				});
			return q.promise;
            },
		setlocation:function(authData, $q, lat, long){
			var q = $q.defer();
			var location = ref.child('users/'+authData.uid+'/profile');
			location.on("value", function(snapshot){
				location.update({
					location:{
						lat: lat,
						long: long}
					});
					q.resolve(true)
				});

			return q.promise;
			}




		}
	})
.factory('actInfo', function($http, $firebase, $firebaseObject, getProfileInfo, $q) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
    setActivity:function(authData, $q, array){
			var q = $q.defer();
			var actId = ref.child('activities').push(array);
			var actkey = actId.key();

			q.resolve({sos:array.sos, distance:array.sosDistance, actId:actId.key()})
			return q.promise;
			},
		setOwnerAsMember: function(authData, $q, array, param){
			var q = $q.defer();
			var id = param.actId;

			var attachMyProfile = ref.child('activities/'+id+'/members').child(authData.uid);
					attachMyProfile.update({
						type:'member',
						joinAs:array.act.params.itsfor,
						name: array.ownerName,
						picture: array.picture,
						uid: array.uid,
						Data: array.act
						});
				var attachMyProfile2 = ref.child('activities/'+id+'/members').once("value", function(snapshot) {
					var hasMemberCounter = snapshot.hasChild("MemberCounter");
					if(hasMemberCounter === true){
						ref.child('activities/'+id+'/members/MemberCounter').once("value", function(count){
							var c = count.val();
							c = c + 1;
							ref.child('activities/'+actkey+'/members').update({MemberCounter:c});
							})
						console.log(true);
					}else{
						ref.child('activities/'+id+'/members').update({MemberCounter:1})
						}
					})
			q.resolve({sos:array.sos, distance:array.sosDistance, actId:id})
			return q.promise;
			},
		sendActivityAsSos:function(authData, $q, marker, res){
			var q = $q.defer();
			console.log(res);
			var num = parseFloat(res.distance)/111;
			var n = num.toFixed(2);
			console.log(num, n);
			ref.child('users').orderByChild('profile/location/lat')
						.startAt(marker.lat-n).endAt(marker.lat+n).once("value",function(snapshot2){
						//console.log(snapshot2.val());

						angular.forEach(snapshot2.val(), function(value, key){
							console.log(key, value);
								ref.child('users/'+key+'/sos').set(res.actId);
							})


					  //console.log(tweaks);
					})
			q.resolve(true);
			return q.promise;
			},
		getActivity:function(uid, $q){
			var q = $q.defer();
			ref.child('activities').orderByChild('uid').equalTo(uid).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		addActMember:function(authData, key, $q){
			var q = $q.defer();
			ref.child("activities/"+key+"/members").child(authData.uid).set(true);
			ref.child("activities/"+key+"/members").once("value",function(snapshot){
						var count = snapshot.numChildren();
						ref.child("activities/"+key).update({count:count});
				});
			q.resolve(true);
			return q.promise;
			},
		removeActivity:function(key, $q){
			var q = $q.defer();
			var myRef = ref.child('activities').child(key);
			myRef.remove();
			q.resolve(true);
			return q.promise;
			},
		removeMeFromActivity:function(authData, gid, $q){
			var q = $q.defer();
			var myRef = ref.child('activities/'+gid+'/members/'+authData.uid);
			myRef.remove();

			var attachMyProfile2 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasRequestCounter = snapshot.hasChild("RequestCounter");
					if(hasRequestCounter === true){
						ref.child('activities/'+gid+'/members/RequestCounter').once("value", function(count){
							var c = count.val();
							c = c - 1;
							ref.child('activities/'+gid+'/members').update({RequestCounter:c});
							})
						q.resolve(true);
					}else{
						ref.child('activities/'+gid+'/members').update({RequestCounter:0})
						}
					})

			q.resolve(true);
			return q.promise;
			},
		getTheActivity:function(authData, $q, ackey){
			var q = $q.defer();
			var hobbies = ref.child('activities/'+ackey);
			hobbies.on("value", function(snapshot){
				q.resolve(snapshot.val())
				});
			return q.promise;
			},
		getSentActivityRequests:function(authData, $q){
			var q = $q.defer();
			ref.child('activities').orderByChild('members/'+authData.uid+'/type')
				.equalTo("request").once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		setTheActivityLocation:function(authData, $q, ackey, marker){
			var q = $q.defer();
			ref.child('activities/'+ackey+'/lat').set(marker.lat);
			ref.child('activities/'+ackey+'/long').set(marker.long);
			q.resolve(true);
			return q.promise;
			},
		updateTheActivity:function(authData, $q, ackey, actData){
			var q = $q.defer();
			ref.child('activities/'+ackey+'/act/type').set(actData.type);
			ref.child('activities/'+ackey+'/act/city').set(actData.city);
			ref.child('activities/'+ackey+'/act/date').set(actData.date);
			ref.child('activities/'+ackey+'/act/time').set(actData.time);
			q.resolve(true);
			return q.promise;
			},
		getLocation:function(authData, $q, $cordovaGeolocation){
			var q = $q.defer();
			var onSuccess = function(position) {
					  q.resolve({
						  lat : position.coords.latitude,
						  long : position.coords.longitude
						  })
			};

			function onError(error) {
				q.reject('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}

			navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

			return q.promise;

			},
		SetMyCoords:function(authData, $q, $cordovaGeolocation){
			var q = $q.defer();
			var q = $q.defer();
			var onSuccess = function(position) {

			ref.child('users/'+authData.uid+'/profile/location/user_set').once("value", function(flag){
							if(!flag.exists()){
								ref.child('users/'+authData.uid+'/profile').update({
								location:{
									lat: position.coords.latitude,
									long: position.coords.longitude
									}


								})
							}
						})



			/*ref.child('users/'+authData.uid+'/profile').update({
				location:{
					lat: position.coords.latitude,
					long: position.coords.longitude
					}
				})*/





			};

			function onError(error) {
				q.reject('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}

			navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
			q.resolve(true);
			return q.promise;
			},
		getCoords:function(authData, $q, $cordovaGeolocation){
			var q = $q.defer();
			var location = ref.child('users/'+authData.uid+'/profile/location');
			location.on("value", function(snapshot){
					q.resolve(snapshot.val());
				});
			return q.promise;
			},
		getDistance:function(x1,y1,x2,y2,$q){
			var q = $q.defer();

			var distance = getDistanceFromLatLonInKm(x1,y1,x2,y2);
			q.resolve(distance);


			function deg2rad(deg) {
			  return deg * (Math.PI/180)
			}

			function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
			  var R = 6371; // Radius of the earth in km
			  var dLat = deg2rad(lat2-lat1);  // deg2rad below
			  var dLon = deg2rad(lon2-lon1);
			  var a =
				Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
				Math.sin(dLon/2) * Math.sin(dLon/2)
				;
			  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			  var d = R * c; // Distance in km
			  return d;
			}

			return q.promise;

			},
		countLikes:function(uid, key, $q){
			var q = $q.defer();
			ref.child('users/'+uid+"/images/"+key+"/likes").once("value",function(snapshot){
						var count = snapshot.numChildren();
						ref.child('users/'+uid+"/images/"+key).update({count:count});
						q.resolve(count);

				});
			return q.promise;

			},
		getNearbyMales:function($q){
			var q = $q.defer();
			ref.child('users').orderByChild('profile/gender')
				.equalTo('male')
					.limitToLast(20).once("value",function(snapshot){
						q.resolve(snapshot.val());
				});

			return q.promise;
			},
		getNearbyFeMales:function($q){
			var q = $q.defer();
			ref.child('users').orderByChild('profile/gender')
				.equalTo('female')
					.limitToLast(20).once("value",function(snapshot){
						q.resolve(snapshot.val());
				});
			return q.promise;
			}

		}
	})
.factory('searchInfo', function($http, $firebase, $firebaseObject, getProfileInfo, actInfo, $cordovaGeolocation, $q) {
	var ref = new  Firebase("https://luminous-heat-6224.firebaseio.com/");
	return{
		getuserList:function(authData, $q, filterText){
			var q = $q.defer();
			ref.child('users').orderByChild('profile/name').startAt(filterText.trim()).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		getuserListByGender:function(authData, isMale, $q ){
			var q = $q.defer();
			if(isMale){
			ref.child('users').orderByChild('profile/gender').equalTo('male').limitToFirst(50).once("value", function(snap) {
					q.resolve(snap.val());    				});
			}
			if(!isMale){
			ref.child('users').orderByChild('profile/gender').equalTo('female').limitToFirst(50).once("value", function(snap) {
					q.resolve(snap.val());    				});
				}
			return q.promise;
			},
		tdSearch:function(authData, $q){
			var q = $q.defer();

			ref.child("users/"+authData.uid+"/profile/location").once("value", function(snapshot){
				var location = snapshot.val();
				//console.log(location);
				ref.child("users/"+authData.uid+"/searchTweaks").once("value", function(snapshot3){
					var tweaks = snapshot3.val();

					var num = parseFloat(tweaks.distance)/111;
					var n = num.toFixed(2);

					ref.child('users').orderByChild('profile/location/lat')
						.startAt(location.lat-n).endAt(location.lat+n).once("value",function(snapshot2){
						//console.log(snapshot2.val());

						actInfo.getCoords(authData, $q, $cordovaGeolocation)
							.then(function(rest){
								q.resolve({rest:rest,tweaks:tweaks, result:snapshot2.val()});
								});


					  //console.log(tweaks);
					})

				});





			})

			return q.promise;
			},
		grouptdSearch:function(authData, $q, group_search_param){
			var q = $q.defer();

			ref.child('activities').orderByChild('act/nationality').equalTo(group_search_param.nationality).limitToLast(300).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		isFriend:function(authData, kuid, $q){
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/BeFriend/'+kuid).once("value", function(snap) {
					  var exists = (snap.val() !== null);
					  q.resolve(exists);
					});
			return q.promise;
			},
		isGroupRequested:function(authData, gid, $q){
			var q = $q.defer();
			ref.child('activities/'+gid+'/members').child(authData.uid).once("value", function(snap) {
					  var exists = (snap.val() !== null);
					  q.resolve(exists);
					});
			return q.promise;
			},
		sendGroupRequest:function(authData, gid, $q){
			var q = $q.defer();
			getProfileInfo.myProfile(authData, $q)
			.then(function(myProfile){
				var attachMyProfile = ref.child('activities/'+gid+'/members').child(authData.uid);
					attachMyProfile.update({
						type:'request',
						joinAs:'person',
						name: myProfile.profile.name,
						picture: myProfile.profile.picture,
						uid: authData.uid,
						Data: {location:myProfile.profile.location}
						});
				var attachMyProfile2 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasRequestCounter = snapshot.hasChild("RequestCounter");
					if(hasRequestCounter === true){
						ref.child('activities/'+gid+'/members/RequestCounter').once("value", function(count){
							var c = count.val();
							c = c + 1;
							ref.child('activities/'+gid+'/members').update({RequestCounter:c});
							})
						q.resolve(true);
					}else{
						ref.child('activities/'+gid+'/members').update({RequestCounter:1})
						}
					})




				});

			q.resolve(true);
			return q.promise;
			},
		AcceptGroupMemberRequest:function(tkey, gid, $q){
			var q = $q.defer();
			var attachMyProfile = ref.child('activities/'+gid+'/members').child(tkey)
					.child('type').set('member');

			var attachMyProfile2 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasRequestCounter = snapshot.hasChild("RequestCounter");
					if(hasRequestCounter === true){
						ref.child('activities/'+gid+'/members/RequestCounter').once("value", function(count){
							var c = count.val();
							c = c - 1;
							ref.child('activities/'+gid+'/members').update({RequestCounter:c});
							})
						q.resolve(true);
					}else{
						ref.child('activities/'+gid+'/members').update({RequestCounter:1})
						}
					})

			var attachMyProfile3 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasMemberCounter = snapshot.hasChild("MemberCounter");
					if(hasMemberCounter === true){
						ref.child('activities/'+gid+'/members/MemberCounter').once("value", function(count){
							var c = count.val();
							c = c + 1;
							ref.child('activities/'+gid+'/members').update({MemberCounter:c});
							})
						q.resolve(true);
					}else{
						ref.child('activities/'+gid+'/members').update({MemberCounter:1})
						}
					})


			q.resolve(true);
			return q.promise;
			},
		RemoveGroupMember:function(tkey, gid, type, $q){
			var q = $q.defer();
			var attachMyProfile = ref.child('activities/'+gid+'/members').child(tkey).set(null);

			if(type == 'request'){
			var attachMyProfile2 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasRequestCounter = snapshot.hasChild("RequestCounter");
					if(hasRequestCounter === true){
						ref.child('activities/'+gid+'/members/RequestCounter').once("value", function(count){
							var c = count.val();
							c = c - 1;
							ref.child('activities/'+gid+'/members').update({RequestCounter:c});
							})
						q.resolve(true);
					}
					})
			}
			if(type == 'member'){
			var attachMyProfile3 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasMemberCounter = snapshot.hasChild("MemberCounter");
					if(hasMemberCounter === true){
						ref.child('activities/'+gid+'/members/MemberCounter').once("value", function(count){
							var c = count.val();
							c = c - 1;
							ref.child('activities/'+gid+'/members').update({MemberCounter:c});
							})
						q.resolve(true);
					}
					})
			}

			q.resolve(true);
			return q.promise;
			},
		sendGroupDetailRequest:function(authData, gid, JoinActData, joinAs,  $q){
			var q = $q.defer();
			getProfileInfo.myProfile(authData, $q)
			.then(function(myProfile){
				var attachMyProfile = ref.child('activities/'+gid+'/members').child(authData.uid);
					attachMyProfile.update({
						type:'request',
						joinAs:joinAs,
						name: myProfile.profile.name,
						picture: myProfile.profile.picture,
						uid: authData.uid,
						Data: JoinActData
						});
				var attachMyProfile2 = ref.child('activities/'+gid+'/members').once("value", function(snapshot) {
					var hasRequestCounter = snapshot.hasChild("RequestCounter");
					if(hasRequestCounter === true){
						ref.child('activities/'+gid+'/members/RequestCounter').once("value", function(count){
							var c = count.val();
							c = c + 1;
							ref.child('activities/'+gid+'/members').update({RequestCounter:c});
							})
						q.resolve(true);
					}else{
						ref.child('activities/'+gid+'/members').update({RequestCounter:1})
						}
					})




				});
			q.resolve(true);
			return q.promise;
			},
		getactList:function(authData, $q){
			var q = $q.defer();
			ref.child('activities').orderByChild('act/date').limitToLast(100).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		getactListByDate:function(authData, $q, ByDate){
			var q = $q.defer();
			ref.child('activities').orderByChild('act/date').startAt(ByDate).limitToLast(20).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		getactListByType:function(authData, $q, ByType){
			var q = $q.defer();
			ref.child('activities').orderByChild('act/params/its').equalTo(ByType).limitToLast(20).once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			},
		getmyCLocation:function(authData, $q){
			var q = $q.defer();
			ref.child('users/'+authData.uid+'/profile/location').once("value", function(snap) {
					q.resolve(snap.val());
    				});
			return q.promise;
			}


		}
	})
;
