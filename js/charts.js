//chart2
function getstationflow(stations_ID){
    var url = "https://sgmrtanalysis.herokuapp.com/data/stationflow/" + stations_ID;
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
               fontSize: "12px",
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
            //max: 300000,
            //tickInterval: 50000,
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
			var url = "https://sgmrtanalysis.herokuapp.com/data/cen/"+stations_ID;
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
              fontSize: "12px",
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
           //max: 1,
           //tickInterval: 0.25,
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
  text: 'Top Five Origin & Destination',
  y:20,
    style: {
            color: '#BFC7CF',
            fontSize: "12px",
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
    color: '#5390DB',
          showInLegend: false,
borderRadiusBottomLeft: 50,
borderRadiusBottomRight: 50,

  data: invalue_m,

}, {
  name: 'Out Flow',
    color: '#947070',
    borderRadiusTopLeft: 50,
    borderRadiusTopRight: 50,
    showInLegend: false,
  data: outvalue
}]
});

});
};
//gettop5(20,'BP1')
