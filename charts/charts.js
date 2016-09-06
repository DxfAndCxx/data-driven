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
    console.log(params);
    var files = params["f"];
    if(!files) {
        alert('请输入文件名');
        return;
    }
    var url = 'datas/'+files;
    var self = this;
    $.getJSON(url, function(data){
        var options = self._parseJson(data);
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
        yAxis: {
            title:{
                text:'rate',
            },
        },
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
    var data = datas.data;
    var dds = [];
    var series = data.map(function(d){
        return {
            name: d.id,
            data: d.values,
            type: 'line',
        };
    });
    var options = {
        title: {
            text: datas.option.title
        },
        xAxis:{
            type: 'time',
        },
        series: series,
    };
    return options;

}
