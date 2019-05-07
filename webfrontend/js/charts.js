
		

//chart2
function getstationflow(stations_ID){
    var url = "http://dev.spatialdatacapture.org:8876/data/flow/" + stations_ID;
    $.getJSON(url, function( data ) {
      var flow = Object.values(data[0])
      var flowin = flow.slice(0, 16);
      var flowout = flow.slice(16, 32);


      var credits = {
      enabled: false
      };

      var chart = {
         backgroundColor:false,
      opacity: 0.9,
         type: 'line'
      };

      var tooltip = {
	   formatter:function(){
	   return '<b>'+'centrality:'+this.y+'</b>';
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
       text: 'Flow',
       style: {
               color: '#BFC7CF',
               fontSize: "15px",
               fontWeight: "light",
               fontFamily: "Roboto"
             }
      };
      var xAxis = {
       categories: ['6AM','','8AM','','10AM','','12AM','','2PM','','4PM','','6PM','','8PM',''],
      labels:{
           rotation: -45,
           style: {
               color: '#BFC7CF',
               fontSize: "8px",
               fontWeight: "light",
               fontFamily: "Roboto",
             }
      }
      };
      var yAxis = {
      title: false,
          min: 0,
            max: 300000,
            tickInterval: 50000,
      labels:{
       style: {
               color: '#BFC7CF',
               fontSize: "8px",
               fontWeight: "light",
               fontFamily: "Roboto"
             }
      }
      };
      var series =  [
       {
          name: 'in',
      showInLegend: false,
      color: '#5390DB',
          lineWidth: 3,
          style: {
               color: '#BFC7CF',
               fontSize: "10px",
               fontWeight: "light",
               fontFamily: "Roboto"
             },
       shadow: {
       color: '#000000',
       opacity: 0.4,
       width: 2,
       offsetX: 1,
       offsetY: 3,
       blur:6
      },
          data: flowin
       },
       {
          name: 'out',
      showInLegend: false,
      color: '#947070',
          lineWidth: 3,
          style: {
               color: '#BFC7CF',
               fontSize: "10px",
               fontWeight: "light",
               fontFamily: "Roboto"
             },
       shadow: {
       color: '#000000',
       opacity: 0.4,
       width: 2,
       offsetX: 1,
       offsetY: 3,
       blur:6
      },
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
			var url = "http://dev.spatialdatacapture.org:8876/data/cen/"+stations_ID;
			$.getJSON( url , function( data ) {
				console.log(data[0]);
				var flowdata = Object.values(data[0]);
		var credits = {
  enabled: false
   };

   var chart = {
        backgroundColor:false,
		opacity: 0.9,
        type: 'line'
    };
    
	var tooltip = {
	   formatter:function(){
	   return '<b>'+'centrality:'+this.y+'</b>';
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
      text: 'Centrality',
      style: {
              color: '#BFC7CF',
              fontSize: "15px",
              fontWeight: "light",
              fontFamily: "Roboto"
            }
   };
   var xAxis = {
      categories: ['6AM','','8AM','','10AM','','12AM','','2PM','','4PM','','6PM','','8PM',''],
	  labels:{
	        rotation: -45,
	        style: {
              color: '#BFC7CF',
              fontSize: "8px",
              fontWeight: "light",
              fontFamily: "Roboto"
            }
		}
   };
   var yAxis = {
    title: false,
	       min: 0,
           max: 1,
           tickInterval: 0.25,
	labels:{
	    style: {
              color: '#BFC7CF',
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
		 color: '#5390DB',
         lineWidth: 3,
         style: {
              color: '#BFC7CF',
              fontSize: "10px",
              fontWeight: "light",
              fontFamily: "Roboto"
            },
			shadow: {
			color: '#000000',
			opacity: 0.4,
			width: 2,
			offsetX: 1,
			offsetY: 3,
			blur:6
		},
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
 //getcentralityflow('CC1-NE6-NS24')



	//chart4
function gettop5(time,stations_ID){
var url = "http://dev.spatialdatacapture.org:8876/data/intop/" + time + "/" + stations_ID;
var url2 = "http://dev.spatialdatacapture.org:8876/data/outtop/" + time + "/" + stations_ID;
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

var categories = inname;
var categories2 = outname;
var chart = Highcharts.chart('right5', {
chart: {
  type: 'bar',
  backgroundColor:false
},
title: {
  text: 'TOP 5 HIGH DEGREE CENTRALITY',
    style: {
            color: '#BFC7CF',
            fontSize: "15px",
            fontWeight: "light",
            fontFamily: "Roboto"
          }
},
xAxis: [{
  categories: categories,
  reversed: false,
  labels: {
          align:'right',
          x:370,
          style: {
              color: '#ffffff',
            fontSize: "10px",
            fontWeight: "light",
            fontFamily: "Roboto"
          }
      }
}, {
  // 显示在右侧的镜像 xAxis （通过 linkedTo 与第一个 xAxis 关联）
  opposite: true,
  reversed: false,
  categories: categories2,
  linkedTo: 0,
  labels: {
          align:'left',
          x:-370,
          style: {
              color: '#ffffff',
            fontSize: "10px",
            fontWeight: "light",
            fontFamily: "Roboto"
          }
      }
}],

yAxis: {
  title: {
    text: false
  }
},
plotOptions: {
  series: {
    stacking: 'normal'
  }

},
credits :{
enabled: false
 },
tooltip: {
  formatter: function () {
    return '<b>' + this.series.name + ', station ' + this.point.category + '</b><br/>' +
      'Flow: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
  }
},

series: [{
  name: 'In Flow',
    color: '#5390DB',
          showInLegend: false,
  data: invalue_m,

}, {
  name: 'Out Flow',
    color: '#947070',
    showInLegend: false,
  data: outvalue
}]
});

});
};
//gettop5(20,'BP1')
