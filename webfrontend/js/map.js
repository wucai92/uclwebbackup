var map;
	var markerArray = [];
	var dataArray = [];
	var infowindow = new google.maps.InfoWindow({maxWidth: 300});
	
	$(document).ready(function() {

		function initialize() {
			
			// Task 3.4 - Make the map look pretty
			var mapOptions = {
				center: new google.maps.LatLng(1.3570, 103.8245),
				zoom: 12,
				//maxZoom:18,
				styles: darkMap,
				disableDefaultUI: true
			};
			
			getData("7");
			
			// Task 3.2 - Write the map into our DIV element
			map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

			/*google.maps.event.addListener(map, 'dragend', function() {
				//var bounds = map.getBounds();
				//console.log("SW: " + bounds.getSouthWest() + " NE: " + bounds.getNorthEast());
				//console.log("Center: " + map.getCenter().lat() + ", " +  map.getCenter().lng());
				//getData(map.getCenter().lat(), map.getCenter().lng());
			});*/
			
			var transitLayer = new google.maps.TransitLayer();
            transitLayer.setMap(map);
			
            //map.data.loadGeoJson("https://api.myjson.com/bins/pax40")
            //map.data.addGeoJson(points);
			
			/*map.data.setStyle({
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
			  scale: 9,
              fillColor: '#7288A9',
              fillOpacity: 0.8,
			  strokeColor: '#ffffff',
			  strokeOpacity: 0.8,
			  strokeWeight: 1,
            }
        });
			
			map.data.addListener('mouseover', function(event) {
			//map.data.revertStyle();
			document.getElementById('right1').textContent =
            "ID:"+event.feature.getProperty('STN_NO');
			map.data.overrideStyle(event.feature, {icon: {
              path: google.maps.SymbolPath.CIRCLE,
			  scale: 15,
              fillColor: '#7288A9',
              fillOpacity: 0.8,
			  strokeColor: '#ffffff',
			  strokeOpacity: 0.8,
			  strokeWeight: 2,
            }});
			});
		
		    map.data.addListener('click', function(event) {
			document.getElementById('right2').textContent =
            event.feature.getProperty('STN_NAME');
            ;
			});
			
			map.data.addListener('mouseout', function(event) {
            map.data.revertStyle();
            });*/
			
		}
        
		function getData(time){
			//var lat = lat.toFixed(2); 
			//var lng = lng.toFixed(3);

			//console.log("Getting Data: " + lat + ", " + lng );

			setAllMap(null);
			markerArray = [];

			// Task 4.1 - Edit this variable so that it points to our API Look at http://dev.spatialdatacapture.org:8870 for the values you need
			//var url = "http://dev.spatialdatacapture.org:8870/data/"+lat+"/"+lng+"/500";
			var url = "http://dev.spatialdatacapture.org:8876/data/centrality/"+time;
			

			$.getJSON( url , function( data ) {
				
				// Task 4.2 -- Add a loop  Make sure you end it as well.  -- Don't uncomment this line
					$.each(data,function(k,v){
							 var latLng = new google.maps.LatLng(v.Latitude, v.Longitude);
							 dataArray.push(latLng);
							
							 var marker = new google.maps.Marker({
		     				  	position: latLng, 
		     				  	customInfo: v.stations_ID,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
			                        scale: v.centrality*20+6,
                                    fillColor: '#c0cddd',
                                    fillOpacity: 0.9,
			                        strokeWeight: 0
                                 }								
		     				  });
                             
							 google.maps.event.addListener(marker, 'click', function(content) {
							 	return function(){
								    document.getElementById('right1').textContent = v.stations_ID;
									document.getElementById('right2').textContent = v.stations_name;
									getcentralityflow(v.stations_ID);
									getstationflow(v.stations_ID);
									//map.panTo(new google.maps.LatLng(v.Latitude, v.Longitude));
							 		//map.setCenter(new google.maps.LatLng(v.Latitude, v.Longitude));
							 		/*$.getJSON("http://dev.spatialdatacapture.org:8870/data/photoDescription/"+this.customInfo, function( data ) {
							 			var dateTaken = new XDate((data[0].date_uploaded * 1000)).toString("MMM d, yyyy HH:mm:ss");
							 			var content = "<b>Photo ID: </b>"+v.pid+"<br/> <br/><b>Description:</b><br/> "+data[0].description.replaceAll("+", " ")+" <br/> <br/><b>Date Taken: </b> "+dateTaken+" <br/><b>Camera: </b> "+data[0].device.replaceAll("+", " ")+"<br/><b>Location:</b> "+ v.points.y + ", " + v.points.x +" <br/><br/> <b>Photo</b> <br/><br/> <img src='"+data[0].download_url+"' width='300px' alt='Description'>";
							 	    	infowindow.setContent(content);
							 	    });*/
					
							 	}
							 }(""));
							 
							 google.maps.event.addListener(marker, 'mouseover', function(content) {
							 	return function(){
							 		infowindow.setContent(v.stations_name);
							 	    infowindow.open(map,this);
							 	}
							 }(""));
							 
							 google.maps.event.addListener(marker, 'mouseout', function(content) {
							 	return function(){			
							 	    infowindow.close(map,this);
							 	}
							 }(""));
							 
							 //google.maps.event.addListener(marker,'mouseover'){
							 
							 //}
							 
							map.data.addListener('mouseover', function(event) {
							map.data.overrideStyle(event.feature, {icon: {
								  path: google.maps.SymbolPath.CIRCLE,
								  scale: 15,
								  fillColor: '#7288A9',
								  fillOpacity: 0.8,
								  strokeColor: '#ffffff',
								  strokeOpacity: 0.8,
								  strokeWeight: 2,
								}});
								});

							 markerArray.push(marker);
							 })
							 

				// -----------------------------------


				// Task 4.3 -- Write the number of rows returned into a element.
      			
      			setAllMap(map);
			});
		}

		// Task 3.1 - Start the map using a function
		google.maps.event.addDomListener(window, 'load', initialize);

		// Task 6 --  Make the markers display on map load.

	});

	//  ******************* FUNCTIONS TO USE FOR THE MAP YOU DON"T NEED TO EDIT ANYTHING BELOW THIS LINE **************************************************

	
	function createMarkers(){
		var marker = new google.maps.Marker({
  			position: latLng 				
  		});
	}

	function setAllMap(map) {
		for (var i = 0; i < markerArray.length; i++) {
			markerArray[i].setMap(map);
		}
	}