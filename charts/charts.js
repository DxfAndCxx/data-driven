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


var Charts = function(element){
    this.elementObject = $(element);
    var thisChart = this;

    var _parseParam = function(){
        var params = getUrlParams();
        var files = params["f"];
        if(!files) {
            return false;
        }
        return files
    }

    var _parseJson = function(datas){
        var option = datas.option;
        var y_label = option.y_label;
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
        for(var name in datas.data){
            var d = datas.data[name];
            var yAxisIndex = d.y_axis===1?d.y_axis:0;
            if(yAxisIndex >= yAxises.length){
                alert('y_label 错误');
                return false;
            }
            var seriesData = d.values.map(function(vv){
                return {
                    x: vv[0],
                    y: vv[1],
                    Datas: vv[2],
                }
            });
            series.push({
                name: name,
                data: seriesData,
                type: 'line',
                yAxis: yAxisIndex,
            });
        }

        var chart_options = {
            title: option.title,
            series: series,
            yAxis: yAxises,
            x_title: option.x_label,
        };
        if(["time", "datetime"].indexOf(option.x_type) != -1){
            chart_options["x_type"] = "datetime";
        }
        if(option.height){
            chart_options["height"] = option.height;
        }
        return chart_options;
    }

    this._drawCharts = function(options){
        var default_options = {
            height: 700,
            type: "line",
            x_type: "linear",
            x_title: "number",
            yAxis: {
                title: {text: 'number'},
            },
        };
        var settings = $.extend({}, default_options, options);
        this.elementObject.highcharts({
            chart:{
                animation:false,
                type: settings.type,
                height: settings.height,
            },
            title:{
                text: settings.title,
            },
            xAxis: {
                type: settings.x_type,
                title: {
                    text: settings.x_title,
                },
            },
            yAxis: settings.yAxis,
            credits: {
                enabled: false
            },
            tooltip: {
                shared: false,
                formatter: function () {
                    var xAxis_type = this.series.xAxis.options.type;
                    var x  = this.x;
                    var y = this.y;
                    if(y !== parseInt(y)){
                        y = y.toFixed(2);
                    }
                    if(xAxis_type === "datetime"){
                        x = (new Date(this.x)).Format("yyyy-MM-dd hh:mm:ss");
                    }
                    var html = x+"<br>";
                    html += this.series.name +" " +y+ "<br>";
                    if(this.point.Datas){
                        html += this.point.Datas;
                    }
                    return html;
                }
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            series: settings.series,
        });
    }


    this.Draw = function(){
        var files = _parseParam();
        if(files === false) return;
        var url = 'datas/'+files;
        $.getJSON(url, function(data){
            var options = _parseJson(data);
            if(options === false) return;
            thisChart._drawCharts(options);
        });
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

