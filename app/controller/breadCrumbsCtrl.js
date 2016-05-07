app.controller('BreadcrumbCtrl',['$scope','breadcrumbs', function($scope,breadcrumbs) {
			$scope.breadcrumbs = breadcrumbs;
			
			
			$scope.getPosition = function(data){
				if(angular.isDefined(data)){
					//console.log(data.breadcrumbs[0].label);
					if(data.breadcrumbs.length==2){
			
						if(data.breadcrumbs[1].label == 'CATEGORY'){
							return false;
						}else{
							return true;
						}
					}
				}else{
					return false;
				}
				
			};
			
			$scope.breadcrumbsCalling = function(){
				$scope.enableBorder;
			 $scope.breadcrumbLength = $scope.breadcrumbs.get().length;
			 console.log("bread",$scope.breadcrumbLength);
			if( $scope.breadcrumbLength > 1){
				$scope.enableBorder = "1px solid #E2E2E2";
			}else{
				$scope.enableBorder = "none";
				
			}
			}
			
			
		
		}]);