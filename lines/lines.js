function faxis(fig, option, data, x)
{
    var x_min = d3.min(data, function(c) { return d3.min(c.values, function(d) { return d[0]; }); });
    var x_max = d3.max(data, function(c) { return d3.max(c.values, function(d) { return d[0]; }); });
    var y_min = d3.min(data, function(c) { return d3.min(c.values, function(d) { return d[1]; }); });
    var y_max = d3.max(data, function(c) { return d3.max(c.values, function(d) { return d[1]; }); });

    var axis = d3.axisBottom(x);
    if (option.x_tick_step)
    {
        var x_tick_values = [];
        for (var i = x_min * 1; i < x_max * 1 - option.x_tick_step;)
        {
            x_tick_values.push(i)
            i = i + option.x_tick_step;
        }
        axis.tickValues(x_tick_values);
    }

    if (option.x_tick_fmt)
    {
        axis.tickFormat(
            function(c)
            {
                return d3.timeFormat(option.x_tick_fmt)(new Date(c * 1000))
            }
        )
    }
    return axis;
}

function fset_domain(fig, option, data, x, y)
{
//    fig.z.domain(data.map(function(c) { return c.id; }));
}

var fig = {}

var svg = d3.select("svg");
var margin = {top: 20, right: 80, bottom: 30, left: 50};
var width = svg.attr("width") - margin.left - margin.right;
var height = svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {
//        console.log(x, d[0], x(d[0]))
        return x(d[0]); })
    .y(function(d) { return y(d[1]); });





d3.json("data.json", function(error, data) {
  if (error) throw error;
  var option = data.option;
  var lines = data.data;

  var x_min = d3.min(lines, function(c) { return d3.min(c.values, function(d) { return d[0]; }); });
  var x_max = d3.max(lines, function(c) { return d3.max(c.values, function(d) { return d[0]; }); });
  var y_min = d3.min(lines, function(c) { return d3.min(c.values, function(d) { return d[1]; }); });
  var y_max = d3.max(lines, function(c) { return d3.max(c.values, function(d) { return d[1]; }); });


  x.domain([x_min, x_max]);
  y.domain([y_min, y_max]);

//  fset_domain(fig, option, data, x, y);

  var x_axis = faxis(fig, option, lines, x);
  var y_axis = d3.axisLeft(y);




  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(x_axis)
    .append("text")
        .text(option.x_label)

  g.append("g")
      .attr("class", "axis axis--y")
      .call(y_axis)
    .append("text")
      .attr("fill", "#000")
      .text(option.y_label);

  var sel = g.selectAll(".city")
    .data(lines)
    .enter()
    .append("g")
//    .attr("class", "city");

  sel.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });

  sel.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) {
          return "translate(" + x(d.value[0]) + "," + y(d.value[1]) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

