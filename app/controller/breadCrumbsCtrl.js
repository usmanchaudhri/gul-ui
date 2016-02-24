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
		
		}]);