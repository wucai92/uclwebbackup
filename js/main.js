	var map;
	var markerArray = [];
	var dataArray = [];
	var selectedstation;
	var selectedtime = '0';
	var selectedmarker;
	var iconstyle;
	var z;
	var infowindow = new google.maps.InfoWindow({maxWidth: 300});
	var transitLayer = new google.maps.TransitLayer();

	document.getElementById("right").style.visibility="hidden";

	$(document).ready(function() {

		function initialize() {

			// Task 3.4 - Make the map look pretty
			var mapOptions = {
				center: new google.maps.LatLng(1.3570, 103.8245),
				zoom: 12,
				//maxZoom:18,
				styles: lightMap,
				disableDefaultUI: true
			};

			getData(selectedtime);

			map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
			transitLayer.setMap(map);

    //chart1
	function gettotaldailyflow() {
				//var url = "http://dev.spatialdatacapture.org:8876/data/flow";
				var url = "https://sgmrtanalysis.herokuapp.com/data/flow";
				$.getJSON( url , function( data ) {
					//console.log(data[0]);
					var flowdata = Object.values(data[0]);
					var credits = {
			enabled: false
					};


			var chart = {
					backgroundColor: false,
			opacity: 0.9,
					type: 'column'
			};


			var title = {
				text: 'TOTAL FLOW',
				y: 16,
				style: {
			color: '#DDE3E9',
			fontSize: "12px",
			fontWeight: "light",
			fontFamily: "Roboto"
			}
		 };
			var xAxis = {
				categories: ['6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'],
			labels: {
			rotation: 0,
					style: {
						 color: '#DDE3E9',
							 fontSize: "8px",
							 fontWeight: "light",
							 fontFamily: "Roboto"
			}
		 }
		 };
			var yAxis = {
			title: false,
						min: 0,
							max: 10000000,
							tickInterval: 5000000,

		labels: {
					style: {
						 color: '#DDE3E9',
							 fontSize: "8px",
							 fontWeight: "light",
							 fontFamily: "Roboto"
			}
		 }
		 };
			var plotOptions =  {
			series: {
					borderWidth: 0,
					point: {
						events: {
                click: function () {
									var time = this.x + 6;
									selectedtime = String(time);
									document.getElementById('left12').innerHTML = 'Showing results for Singapore MRT system on <b>' + selectedtime + ':00</b> on weekday of Jan 2019';
									if (selectedstation != ''){
										gettop5(time,selectedstation);
										getData(time);
										$('.onoffswitch2-checkbox2')[0].checked = false;
											$.getJSON( "https://sgmrtanalysis.herokuapp.com/data/centrality/"+ selectedtime , function( data ) {
												$.each(data,function(k,v){
													if(v.stations_ID == selectedstation){
														document.getElementById('eigen').textContent = v.centrality;
													}
												});
											});

									}
									else{
										getData(time);
										$('.onoffswitch2-checkbox2')[0].checked = false;
									}
									for (var i = 0; i < this.series.data.length; i++) {
                                this.series.data[i].update({ color: '#A6B0BD' }, true, false);
                            }
                            this.update({ color:  '#FFB580' }, true, false);
							var checkbox = document.getElementById('myonoffswitch2');
									checkbox.addEventListener('change', e => {

									    if(e.target.checked){
												for (var i = 0; i < this.series.data.length; i++) {
													this.series.data[i].update({ color: '#A6B0BD' }, true, false);
												}
									    }else{
												this.series.data[0].update({ color: '#FFB580' }, true, false);
											}

									});
                }
							}
			}
		 }
		 };

			var series= [{
					showInLegend: false,
					type: 'column',
							name: 'Flow',
				color: '#A6B0BD',
				style: {
								color: '#DDE3E9',
								fontSize: "20px",
								fontWeight: "light",
								fontFamily: "Roboto"
							},
			/*	shadow: {
				color: '#000000',
				opacity: 0.3,
				width: 3,
				offsetX: 1,
				offsetY: 3,
				blur:6
			},*/
							data: flowdata
					}
		 ];

		 var json = {};
		 json.chart = chart;
		 json.title = title;
		 json.xAxis = xAxis;
		 json.series = series;
		 json.yAxis = yAxis;
		 json.plotOptions = plotOptions;
		 json.credits = credits;
		 $('#left2').highcharts(json);
	    });
		};
        gettotaldailyflow()

		}


		google.maps.event.addDomListener(window, 'load', initialize);

	});


		function getData(time){

			setAllMap(null);
			markerArray = [];
			var url = "https://sgmrtanalysis.herokuapp.com/data/centrality/"+time;

			$.getJSON( url , function( data ) {

					$.each(data,function(k,v){
							 var latLng = new google.maps.LatLng(v.Latitude, v.Longitude);
							 dataArray.push(latLng);

							 if(time == "0"){
								var scale = v.centrality/5360;
							 }
							 else{
								var scale = v.centrality;
							 }
							 //var color  = HSLToRGB(213,(40+60*sclae),(30+45*v.centrality));
							 //var color  = HSLToRGB((200+159*scale),90,70);
							 var color  = HSLToRGB(25,100,(85-30*scale));
							 var color2  = HSLToRGB(30,100,(70-30*scale));

							 var icon1 = {
                                    path: google.maps.SymbolPath.CIRCLE,
			                        scale: scale*20+6,
									//scale: 10,
                                    fillColor: color,
                                    fillOpacity: 0.9,
			                        strokeWeight: 0
                                 }

							 var icon2 = {
                                    path: google.maps.SymbolPath.CIRCLE,
			                        scale: scale*20+6,
									//scale: 10,
                                    fillColor: color2,
                                    fillOpacity: 0.9,
			                        strokeWeight: 0
                                 }

							 var icon3 = {
                                    path: google.maps.SymbolPath.CIRCLE,
			                        scale: scale*20+6,
									//scale: 10,
                                    fillColor: color,
                                    fillOpacity: 1,
			                        strokeWeight: 2,
									strokeColor: "#ffffff"
                                 }

							 if (v.stations_ID == selectedstation){
								var icon = icon3;
								iconstyle = icon1;
							 }
							 else{
								var icon = icon1;
							 }

							 var marker = new google.maps.Marker({
		     				  	position: latLng,
		     				  	customInfo: v.stations_ID,
                                icon: icon,
								//animation: google.maps.Animation.DROP
		     				  });


							 google.maps.event.addListener(marker, 'click', function(content) {
									return function(){
									if (selectedmarker != null){
											for (var i = 0; i < markerArray.length; i++) {
											if(markerArray[i].customInfo == selectedstation){
												selectedmarker = markerArray[i];
												//console.log('true');
											}
										}
										selectedmarker.setIcon(iconstyle);
									}
									marker.setIcon(icon3);
									newicon1(scale);
								    document.getElementById("right").style.visibility="visible";
									$("#right").fadeIn("slow");
								    document.getElementById('right1').textContent = v.stations_name;
									selectedmarker = marker;
									selectedstation = v.stations_ID;
									getcentralityflow(v.stations_ID);
									getstationflow(v.stations_ID);
									gettop5(selectedtime,v.stations_ID);
									$.getJSON("https://sgmrtanalysis.herokuapp.com/data/stationDescription/"+v.stations_ID,function(data2) {
										document.getElementById('code').textContent = data2[0].stations_ID;
										document.getElementById('year').textContent = data2[0].stations_year;
										document.getElementById('bet').textContent = data2[0].bwt;
										if (v.centrality == data2[0].bwt){
											document.getElementById('eigen').textContent = "NA";
										}
										else{
											document.getElementById('eigen').textContent = v.centrality;
										}
										document.getElementById('right23').textContent = data2[0].stations_description;
									})
							 	}
							 }(""));

							 google.maps.event.addListener(marker, 'mouseover', function(content) {
							 	return function(){
									z = marker.zIndex;
									marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1)
							 		infowindow.setContent(v.stations_name);
							 	    infowindow.open(map,this);
										if (v.stations_ID != selectedstation) {
												marker.setIcon(icon2);
										}
							 	}
							 }(""));

							 google.maps.event.addListener(marker, 'mouseout', function(content) {
							 	return function(){
							 	    infowindow.close(map,this);
										if (selectedstation != null) {
						            if (v.stations_ID != selectedstation) {
						                marker.setIcon(icon1);
										marker.setZIndex(z);
						            }
						        }
										else{
											marker.setIcon(icon1);
											marker.setZIndex(z);
										}
							 	}
							 }(""));

							 google.maps.event.addListener(infowindow, 'domready', function(){
							         $(".gm-style-iw").parent().find("button").removeAttr("style").hide();
							        });


							 markerArray.push(marker);
							 })


      			setAllMap(map);
			});
		}

    function hidebar(){
		//document.getElementById("right").style.visibility="hidden";
		$("#right").fadeOut("slow");
		selectedstation=null;
		getData(selectedtime);
	}

	function onoff(){
	    var checkBox = document.getElementById("myonoffswitch1");
	    if (checkBox.checked == true){
		    transitLayer.setMap(map);
		} else {
			transitLayer.setMap(null);
		}
	}

	function onoff2(){
	    var checkBox = document.getElementById("myonoffswitch2");
	    if (checkBox.checked == true){
			document.getElementById('left12').innerHTML = 'Showing results for Singapore MRT system from <b>6:00</b> to <b>21:00</b> on weekday of Jan 2019';
		    document.getElementById('eigen').innerHTML = 'NA';
			getData("0");
			gettop5('0', selectedstation);
		} else {
			selectedtime = String(6);
			document.getElementById('left12').innerHTML = 'Showing results for Singapore MRT system on <b>6:00</b> on weekday of Jan 2019';
			if (selectedstation != ''){
				gettop5(selectedtime,selectedstation);
				getData(selectedtime);
				$('.onoffswitch2-checkbox2')[0].checked = false;
					$.getJSON( "https://sgmrtanalysis.herokuapp.com/data/centrality/"+ selectedtime , function( data ) {
						$.each(data,function(k,v){
							if(v.stations_ID == selectedstation){
								document.getElementById('eigen').textContent = v.centrality;
							}
						});
					});

			}
			else{
				getData(selectedtime);
			}
		}
	}

	function onoff3(){
		var checkBox = document.getElementById("myonoffswitch3");
		if (checkBox.checked == true){
			map.setOptions({styles: lightMap});
			$("#header").css({"color":"#373E4A"});
			$("a:link").css({"color":"#373E4A"});
		} else {
			map.setOptions({styles: darkMap});
			$("#header").css({"color":"#FFFFFF"});
			$("a:link").css({"color":"#FFFFFF"});
		}
	};

	function newicon1(v){ iconstyle = {
								 path: google.maps.SymbolPath.CIRCLE,
								 scale: v*20+6,
								 fillColor: HSLToRGB(25,100,(85-30*v)),
								 fillOpacity: 0.9,
								 strokeWeight: 0
										}

	}

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

	var isHiden = true;
	$('#left3').click(function(){
		var lr = document.getElementById("lr");
	    if(isHiden){
	        $('#left').animate({left:'+=55%'},800);
			lr.setAttribute("src","img/left.png");
	    }else{
	        $('#left').animate({left:'-=55%'},800);
			lr.setAttribute("src","img/right.png");
	    }
	    isHiden = !isHiden;
	});

	function HSLToRGB(h,s,l) {
		// Must be fractions of 1
		s = Math.round(s);
		s /= 100;
		l /= 100;

		let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c/2,
		r = 0,
		g = 0,
		b = 0;
		if (0 <= h && h < 60) {
			r = c; g = x; b = 0;
		} else if (60 <= h && h < 120) {
			r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
			r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
			r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
			r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
			r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return "rgb(" + r + "," + g + "," + b + ")";
	}

//chart2
function getstationflow(stations_ID){
    var url = "https://sgmrtanalysis.herokuapp.com/data/stationflow/" + stations_ID;
    $.getJSON(url, function( data ) {
      var flow = Object.values(data[0])
      var flowout = flow.slice(0, 16);
      var flowin = flow.slice(16, 32);


      var credits = {
      enabled: false
      };

      var chart = {
         backgroundColor:false,
      opacity: 0.9,
         type: 'line',
         height: 150
      };

      var tooltip = {
	   formatter:function(){
	   return '<b>'+this.series.name + ': '+this.y+'</b>';
	   }
   };

      var plotOptions = {
      series: {
         marker: {
             enabled: true,
             symbol: 'circle',
             radius: 3
         }
      }
      };

      var title = {
       text: 'INBOUND & OUTBOUNT FLOW',
       y:17,
       style: {
               color: '#DDE3E9',
               fontSize: "12px",
               fontWeight: "light",
               fontFamily: "Roboto"
             }
      };
      var xAxis = {
		  lineWidth: 0,
       categories: ['6:00','','','9:00','','','12:00','','','15:00','','','18:00','','','21:00'],
      labels:{
        step:1,
           rotation: 0,
           overflow: 'justify',
           style: {
               color: '#ADB7C2',
               fontSize: "8px",
               fontWeight: "light",
               fontFamily: "Roboto",
             }
      }
      };
      var yAxis = {
      title: false,
	  gridLineColor: '#DDE3E9',
          min: 0,
            //max: 300000,
            //tickInterval: 50000,
      labels:{
       style: {
               color: '#DDE3E9',
               fontSize: "8px",
               fontWeight: "light",
               fontFamily: "Roboto"
             }
      }
      };
      var series =  [
       {
          name: 'Inbound',
      showInLegend: false,
      color: '#9CBADF',
          lineWidth: 3,
          style: {
               color: '#DDE3E9',
               fontSize: "10px",
               fontWeight: "light",
               fontFamily: "Roboto"
             },
      /* shadow: {
       color: '#000000',
       opacity: 0.2,
       width: 3,
       offsetX: 1,
       offsetY: 3,
       blur:6
     },*/
          data: flowin
       },
       {
          name: 'Outbound',
      showInLegend: false,
      color: '#FFB580',
          lineWidth: 3,
          style: {
               color: '#FF974D',
               fontSize: "10px",
               fontWeight: "light",
               fontFamily: "Roboto"
             },
       /*shadow: {
       color: '#000000',
       opacity: 0.2,
       width: 3,
       offsetX: 1,
       offsetY: 3,
       blur:6
     },*/
          data: flowout
       }
      ];

      var json = {};
      json.chart = chart;
      json.title = title;
      json.xAxis = xAxis;
      json.yAxis = yAxis;
      json.series = series;
      json.plotOptions = plotOptions;
      json.credits = credits;
	  json.tooltip = tooltip;
      $('#right3').highcharts(json);
    });
  }
  //getstationflow('CC1-NE6-NS24')


  //chart3
		function getcentralityflow(stations_ID) {
			var url = "https://sgmrtanalysis.herokuapp.com/data/cen/"+stations_ID;
			$.getJSON( url , function( data ) {
				//console.log(data[0]);
				var flowdata = Object.values(data[0]);
		var credits = {
  enabled: false
   };

   var chart = {
        backgroundColor:false,
		opacity: 0.9,
        type: 'line',
        height: 150
        //height: (9 / 16 * 100) + '%'
    };

	var tooltip = {
	   formatter:function(){
	   return '<b>'+'centrality: '+this.y+'</b>';
	   }
   };

	var plotOptions = {
    series: {
        marker: {
            enabled: true,
            symbol: 'circle',
            radius: 3
        }
    }
};

   var title = {
      text: 'EIGENVECTOR CENTRALITY',
      y:17,
      style: {
              color: '#DDE3E9',
              fontSize: "12px",
              fontWeight: "light",
              fontFamily: "Roboto"
            }
   };
   var xAxis = {
	   lineWidth: 0,
      categories: ['6:00','','','9:00','','','12:00','','','15:00','','','18:00','','','21:00'],
	  labels:{
	        rotation: 0,
          step:1,
	        style: {
              color: '#DDE3E9',
              fontSize: "8px",
              fontWeight: "light",
              fontFamily: "Roboto"
            }
		}
   };
   var yAxis = {
    title: false,
	gridLineColor: '#ADB7C2',
	       min: 0,
           max: 1,
           //tickInterval: 0.25,
	labels:{
	    style: {
              color: '#DDE3E9',
              fontSize: "8px",
              fontWeight: "light",
              fontFamily: "Roboto"
            }
		}
   };
   var series =  [
      {
         name: 'Centrality',
		 showInLegend: false,
		 color: '#9CBADF',
         lineWidth: 3,
         style: {
              color: '#BFC7CF',
              fontSize: "10px",
              fontWeight: "light",
              fontFamily: "Roboto"
            },
		/*	shadow: {
			color: '#000000',
			opacity: 0.2,
			width: 3,
			offsetX: 1,
			offsetY: 3,
			blur:6
		},*/
         data: flowdata
      }
   ];

   var json = {};
   json.chart = chart;
   json.title = title;
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.series = series;
   json.plotOptions = plotOptions;
   json.credits = credits;
   json.tooltip = tooltip;
   $('#right4').highcharts(json);
 });
};



//chart4
function gettop5(time,stations_ID){
var url = "https://sgmrtanalysis.herokuapp.com/data/intop/" + time + "/" + stations_ID;
var url2 = "https://sgmrtanalysis.herokuapp.com/data/outtop/" + time + "/" + stations_ID;
$.when($.getJSON(url), $.getJSON(url2)).done(function(data1, data2) {
  var data11 = data1[0];
  var data22 = data2[0];
  var inname = [];
  var invalue = [];
  var outname = [];
  var outvalue = [];
  //console.log(data);
  $.each(data11, function(k,v){
  inname.push(v.ORIGIN_PT_NAME);
  invalue.push(v.TOTAL_TRIPS);
});
  $.each(data22, function(k,v){
  outname.push(v.DESTINATION_PT_NAME);
  outvalue.push(v.TOTAL_TRIPS);

});

var invalue_m = [];
for (var i = 0;i <= 4;i++){
  invalue_m.push(-1*invalue[i]);
};
invalue_m.reverse();
outvalue.reverse();
inname.reverse();
outname.reverse();
var value = invalue_m.concat(outvalue);
var name = inname.concat(outname);
var chart = Highcharts.chart('right5', {
chart: {
  type: 'bar',
  backgroundColor:false
},
title: {
  text: 'TOP 5 ORIGIN & DESTINATION',
  y:20,
    style: {
            color: '#DDE3E9',
            fontSize: "13px",
            fontWeight: "light",
            fontFamily: "Roboto"
          }
},
xAxis: [{
  categories: ['5th','4th','3rd','2nd','1st'],
  reversed: false,
  lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',
   minorTickLength: 0,
   tickLength: 0,
  labels: {
          align:'right',
          x:0,
          style: {
              color: '#ffffff',
            fontSize: "6px",
            fontWeight: "light",
            fontFamily: "Roboto"
          },
		  enabled: false
      }
}, {
  // 显示在右侧的镜像 xAxis （通过 linkedTo 与第一个 xAxis 关联）
  opposite: true,
  reversed: false,
  linkedTo: 0,
  lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',
   minorTickLength: 0,
   tickLength: 0,
  labels: {
          align:'left',
          x:-0,
          style: {
              color: '#ffffff',
            fontSize: "6px",
            fontWeight: "light",
            fontFamily: "Roboto"
          },
		  enabled: false
      }
}],

yAxis: {
  title: {
    text: false
  },
  gridLineWidth: 0,
  labels:{
	  enabled: false
  }
},
plotOptions: {
  bar:{
    stacking: 'normal'
  },
  series: {
    stacking: 'normal',
	borderWidth : 0.2,
	pointWidth:9,
	//borderRadius: 5
  }
},

credits :{
enabled: false
 },

tooltip: {
  formatter: function () {
    return '<b>' +this.point.category +' '+ this.series.name +': '+ name[value.indexOf(this.point.y)] + '</b><br/>' +
      'Flow: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
  }
},

series: [{
  name: 'In Flow',
    color: '#9CBADF',
          showInLegend: false,
/*borderRadiusBottomLeft: 50,
borderRadiusBottomRight: 50,
shadow: {
       color: '#000000',
       opacity: 0.2,
       width: 3,
       offsetX: 1,
       offsetY: 3,
       blur:6
     },*/
  data: invalue_m,

}, {
  name: 'Out Flow',
    color: '#FFB580',
	/*    borderRadiusTopLeft: 50,
    borderRadiusTopRight: 50,
shadow: {
       color: '#000000',
       opacity: 0.2,
       width: 3,
       offsetX: 1,
       offsetY: 3,
       blur:6
     },*/
    showInLegend: false,
  data: outvalue
}]
});

});
};
//gettop5(20,'BP1')
