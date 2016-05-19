 app.controller('productCtrl',['$scope', function($scope) {
			$scope.load = function() {
				console.log("PRODUCTS CONTROLLER");
				$("#filter-dropdown").click(function(){
						if ( $( "#price-filters" ).is( ":hidden" ) ) {
							$( "#price-filters" ).slideDown( "slow" );
						
						} else {
							$( "#price-filters" ).slideUp("slow");
						}
					});
				$('.carousel').carousel(); 		
	 			
			};
			$scope.load();
		}]);
