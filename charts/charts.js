/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-09-06 16:11:07
 * @version $Id$
 */


 Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

function getUrlParams() {
    var result = {};
    var params = (window.location.search.split('?')[1] || '').split('&');
    for(var param in params) {
        if (params.hasOwnProperty(param)) {
            paramParts = params[param].split('=');
            result[paramParts[0]] = decodeURIComponent(paramParts[1] || "");
        }
    }
    return result;
}

var Charts = function(elementId){
    this.elementId = $(elementId);
}

Charts.prototype.Draw = function(){
    var params = getUrlParams();
    var files = params["f"];
    if(!files) {
        return;
    }
    var url = 'datas/'+files;
    var self = this;
    $.getJSON(url, function(data){
        var options = self._parseJson(data);
        if(options === false) return;
        self._drawCharts(options);
    });
}

Charts.prototype._drawCharts = function(options){
    this.elementId.highcharts({
        chart:{
            animation:false,
            type: "line",
        },
        title:{
            text:options.title.text,
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: options.yAxis,
        credits: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        series: options.series,
    });
}

Charts.prototype._parseJson = function(datas){
    var y_label = datas.option.y_label;
    var y_axis = {title: {text: ''}};
    if(!$.isArray(y_label)){
        y_label = [y_label];
    }
    var yAxises = [];
    $.each(y_label, function(index, y_l){
        var res = {title: {text: y_l}};
        if(index === 1){
            res.opposite = true;
        }
        yAxises.push(res);
    });

    var series = [];
    for(var i=0;i<datas.data.length;i++){
        var d = datas.data[i];
        var yAxisIndex = d.y_axis===1?d.y_axis:0;
        if(yAxisIndex >= yAxises.length){
            alert('y_label 错误');
            return false;
        }
        series.push({
            name: d.id,
            data: d.values,
            type: 'line',
            yAxis: yAxisIndex,
        });
    }

    var options = {
        title: {
            text: datas.option.title
        },
        xAxis:{
            type: 'time',
        },
        series: series,
        yAxis:yAxises,
    };
    return options;

}
