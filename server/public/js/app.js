(function() {
	var app = angular.module('spexy', ['chart.js']);
	var data = [];
	var register = false;
	var mac = "testmac";
	
	
	
	app.factory('socket', function ($rootScope) {
	  var socket = io.connect();
	  return {
	    on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
	  };
	});

	app.controller('homeController', ['$scope','$http','$window', function($scope,$http,$window) {
		$scope.homeTxt = "Login";
		
		$scope.status = "Submit";
		$scope.success = false;
		$scope.auth = {
			username: "",
			password: "",
		};
		var subData = $.param({
			username: $scope.auth.username,
			password: $scope.auth.password
		});

		$scope.register = false;
		
		this.registerOn = function() {
			$scope.homeTxt = "Register";
			$scope.register = true;
		}
		this.loginOn = function() {
			$scope.homeTxt = "Login";
			$scope.register = false;
		}
		this.submitForm = function() {
			$scope.status = "Submitting...";
			
			if(!$scope.register){
				$http.post('/auth', $scope.auth).
				success(function(data, status) {
					if (data.success == true) {
						$scope.status = "Submit";
						$scope.success = true;
						$window.location.reload();
					} else {
						$scope.status = "Try Again";
						console.log(data);
					}
				}).error(function(data, status, headers, config) {
					$scope.status = "Try Again";
					console.log(data);
	
				});
			} else if($scope.register){
				$http.post('/register', $scope.auth).
				success(function(data, status) {
					if (data.success == true) {
						$scope.status = "Submit";
						$scope.success = true;
						$window.location.reload();
					} else {
						$scope.status = "Try Again";
						console.log(data);
					}
				}).error(function(data, status, headers, config) {
					$scope.status = "Try Again";
					console.log(data);
				});
			}
		}
	}]);
	app.controller('DashController', ['$scope', '$http', 'socket',function($scope, $http, socket) {
		$scope.screen = 0;
		$scope.data = [];
				
		$http.get('/getMac').then(function(res){
				console.log(res.data);
				mac = res.data;
		});
		
		
		socket.emit("registerMacListener", mac);

		
		
		/*$http.get('data.json').then(function(res) {
			for (var i = 0; i < res.data.length; i++) {
				data.push(res.data[i]);
			}
			// console.log(data);
		});*/
	}]);
	app.controller('formController', ['$scope', '$http', '$window', function($scope, $http, $window) {
		$scope.status = "Submit";
		$scope.success = false;
		$scope.auth = {
			username: "",
			password: "",
		};
		var subData = $.param({
			username: $scope.auth.username,
			password: $scope.auth.password
		});
	
		
		this.submitForm = function() {
			$scope.status = "Submitting...";
			
			if(!$('#homeTxt').html == "Register"){
				$http.post('/auth', $scope.auth).
				success(function(data, status) {
					if (data.success == true) {
						$scope.status = "Submit";
						$scope.success = true;
						$window.location.reload();
					} else {
						$scope.status = "Try Again";
						console.log(data);
					}
				}).error(function(data, status, headers, config) {
					$scope.status = "Try Again";
					console.log(data);
	
				});
			} else {
				$http.post('/register', $scope.auth).
				success(function(data, status) {
					if (data.success == true) {
						$scope.status = "Submit";
						$scope.success = true;
						$window.location.reload();
					} else {
						$scope.status = "Try Again";
						console.log(data);
					}
				}).error(function(data, status, headers, config) {
					$scope.status = "Try Again";
					console.log(data);
				});
			}
		};
	}]);
	app.config(function(ChartJsProvider) {
		// Configure all charts
		ChartJsProvider.setOptions({
			colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
		});
		// Configure all doughnut charts
		ChartJsProvider.setOptions('doughnut', {
			cutoutPercentage: 60,
			colors: ['green', 'red', 'orange', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
		});
		ChartJsProvider.setOptions('pie',{
			options: {
			    animation: false
			}
		});
	});
	app.controller("ProcCtrl", ['$scope', '$http', 'socket', function($scope, $http, socket) {
		$scope.labels = ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "10s"];
		$scope.series = ['Core #0', 'Core #1', 'Core #2', 'Core #3'];
		$scope.cpu0check = true;
		$scope.cpu1check = true;
		$scope.cpu2check = true;
		$scope.cpu3check = true;
		$scope.core0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.core1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.core2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.core3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.cpuName = "";
		socket.on("status",function(data)
		  {
			  		    data = JSON.parse(data);
			  $scope.cpuName = data.cpuName;
			
				$scope.core0 = $scope.core0.slice(1);
				$scope.core0.push(data.cpuCoreInfo.core0);
				$scope.core1 = $scope.core1.slice(1);
				$scope.core1.push(data.cpuCoreInfo.core1);
				$scope.core2 = $scope.core2.slice(1);
				$scope.core2.push(data.cpuCoreInfo.core2);
				$scope.core3 = $scope.core3.slice(1);
				$scope.core3.push(data.cpuCoreInfo.core3);
			
			$scope.data = [$scope.core0, $scope.core1, $scope.core2, $scope.core3];
		    
		  });
		/*$http.get('data.json').then(function(res) {
			$scope.cpuName = res.data.cpuName;
			for (var i = 0; i < res.data.length; i++) {
				$scope.core0 = $scope.core0.slice(1);
				$scope.core0.push(data[i].cpuCoreInfo.core0);
				$scope.core1 = $scope.core1.slice(1);
				$scope.core1.push(data[i].cpuCoreInfo.core1);
				$scope.core2 = $scope.core2.slice(1);
				$scope.core2.push(data[i].cpuCoreInfo.core2);
				$scope.core3 = $scope.core3.slice(1);
				$scope.core3.push(data[i].cpuCoreInfo.core3);
			}
			$scope.data = [$scope.core0, $scope.core1, $scope.core2, $scope.core3];
			// console.log(data);
		});*/
		$scope.data = [$scope.core0, $scope.core1, $scope.core2, $scope.core3];
		$scope.datasetOverride = [{
			yAxisID: 'y-axis-1'
		}];
		$scope.options = {
			scales: {
				yAxes: [{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left'
				}]
			}
		};
		this.updateData = function() {
			console.log("working?");
			$scope.data = [];
			if ($scope.cpu0check) $scope.data.push($scope.core0);
			if ($scope.cpu1check) $scope.data.push($scope.core1);
			if ($scope.cpu2check) $scope.data.push($scope.core2);
			if ($scope.cpu3check) $scope.data.push($scope.core3);
		}
	}]);
	app.controller("NetworkCtrl", ['$scope', '$http','socket', function($scope, $http,socket) {
		$scope.labels = ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s", "10s"];
		$scope.series = ['Upstream', 'Downstream'];
		var upstream = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var downstream = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.uSpeed = 0;
		$scope.dSpeed = 0;
		socket.on("status",function(data)
		{
			data = JSON.parse(data);

			upstream = upstream.slice(1);
			upstream.push(data.KBrecv);
			downstream = downstream.slice(1);
			downstream.push(data.KBsent);
				
			$scope.uSpeed = data.KBrecv;
			$scope.dSpeed = data.KBsent;
			$scope.data = [upstream, downstream];

		});
		/*$http.get('data.json').then(function(res) {
			for (var i = 0; i < res.data.length; i++) {
				upstream = upstream.slice(1);
				upstream.push(data[i].KBrecv);
				downstream = downstream.slice(1);
				downstream.push(data[i].KBsent);
				
				$scope.uSpeed = data[i].KBrecv;
				$scope.dSpeed = data[i].KBsent;
			}
			$scope.data = [upstream, downstream];
		});*/
		$scope.data = [upstream, downstream];
		$scope.datasetOverride = [{
			yAxisID: 'y-axis-1'
		}];
		$scope.options = {
			scales: {
				yAxes: [{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left'
				}]
			}
		};
	}]);
	app.controller('StorageCtrl', ['$scope','$http','socket', function($scope,$http,socket) {
		$scope.labels = ['Used', 'Free'];
		$scope.colours = [{
          "fillColor": "blue",
          "strokeColor": "rgba(207,100,103,1)",
          "pointColor": "rgba(220,220,220,1)",
          "pointStrokeColor": "#fff",
          "pointHighlightFill": "#fff",
          "pointHighlightStroke": "rgba(151,187,205,0.8)"
        }];
        
        socket.on("status",function(data)
		{
			data = JSON.parse(data);
			console.log(data);
			$scope.data0 = [data.disk[0].usedspace, data.disk[0].freespace];
			$scope.mtpoint0 = data.disk[0].mtpoint;
			$scope.total0 = "Capacity: "+data.disk[0].totspace+" GB";
			if(disk.length>1){
				$scope.data1 = [data.disk[1].usedspace, data.disk[1].freespace];
				$scope.mtpoint1 = data.disk[1].mtpoint;
				$scope.total1 = "Capacity: "+data.disk[1].totspace+" GB";
			}
			if(disk.length>2){
				$scope.data2 = [data.disk[2].usedspace, data.disk[2].freespace];
				$scope.mtpoint2 = data.disk[2].mtpoint;
				$scope.total2 = "Capacity: "+data.disk[2].totspace+" GB";
			}
			if(disk.length>3){
				$scope.data3 = [data.disk[3].usedspace, data.disk[3].freespace];
				$scope.mtpoint3 = data.disk[3].mtpoint;
				$scope.total3 = "Capacity: "+data.disk[3].totspace+" GB";
			}
		});
		/*$http.get('data.json').then(function(res) {
			data = res.data;
			$scope.data = [data[0].disk0.usedspace, data[0].disk0.freespace];
			$scope.mtpoint = data[0].disk0.mtpoint;
			$scope.total = data[0].disk0.totspace;

		});*/
		
	}]);
	app.controller("RamCtrl",['$scope','$http','socket', function($scope,$http,socket) {
		var data = [];
	    $scope.labels = [];
		$scope.data = [];
		$scope.top = [];
		$scope.options = {
			animation: false,
      	};
		
		socket.on("tasks",function(data)
		{
			data = JSON.parse(data);
			data = sortByKey(data, "memPerc").reverse();
			$scope.labels = [];
			$scope.data = [];
			$scope.top = [];
			for (var i = 0; i < data.length && i < 10; i++) {
				$scope.labels.push(data[i].name);
				$scope.data.push(data[i].memPerc);
				$scope.top.push(data[i].name);
			}
		});
		/*$http.get('proc.json').then(function(res) {
			data = res.data;
			//console.log(data);
			data = sortByKey(data, "memPerc");
			for (var i = 0; i < res.data.length && i < 10; i++) {
				$scope.labels.push(data[i].name);
				$scope.data.push(data[i].memPerc);
				$scope.top.push(data[i].name);
				$scope.top.reverse();
			}

		});*/

	}]);
	
	app.controller("TaskCtrl",['$scope','$http','socket', function($scope,$http,socket) {
		$scope.proc = [];
		socket.on("tasks",function(data)
		{
			data = JSON.parse(data);
			$scope.proc = data;
			$scope.proc = sortByKey($scope.proc, "memPerc").reverse();
		});
		
		this.delete = function(pid){
			$http.post('/sendkill/'+mac, pid).
				success(function(data, status) {
					if (data.success == true) {
						$scope.status = "Submit";
						$scope.success = true;
						$scope.proc = $.grep($scope.proc, function(e){ 
						     return e.pid != pid; 
						});
						var data = {message: 'Process Terminated Succesfully'};
						document.querySelector('.tManDiv').MaterialSnackbar.showSnackbar(data);
					} else {
						$scope.status = "Try Again";
						var data = {message: 'Something went wrong!'};
						document.querySelector('.tManDiv').MaterialSnackbar.showSnackbar(data);
					}
				}).error(function(data, status, headers, config) {
					var data = {message: 'Something went terribly wrong!'};
						document.querySelector('.tManDiv').MaterialSnackbar.showSnackbar(data);
	
				});
		}

	}]);
	
	function sortByKey(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
	
})();