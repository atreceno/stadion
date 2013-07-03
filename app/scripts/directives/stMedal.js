'use strict';

angular.module('stadion').directive('stMedal', function () {

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    };
    var width = 700 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1, 0.2);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('d'));

    return {
        scope: {data: '=', sort: '='},
        restrict: 'A',
        link: function postLink(scope, element, attrs) {

            console.log(attrs);
            var svg = d3.select(element[0]).append('svg')
                .attr('viewBox', '0 0 700 350')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            scope.$watch('data.length', function (length) {

                if (length === 0) {
                    return;
                }

                var data = scope.data;
                console.log('data: ' + data);

                x.domain(data.map(function (d) {
                    return d.name;
                }));

                y.domain([0, d3.max(data, function (d) {
                    return d.gold;
                })]);

                svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                svg.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis)
                    .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .text('Gold Medals');

                svg.selectAll('.bar')
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', function (d) {
                        return x(d.name);
                    })
                    .attr('width', x.rangeBand())
                    .attr('y', function (d) {
                        return y(d.gold);
                    })
                    .attr('height', function (d) {
                        return height - y(d.gold);
                    });

            }, false);

            scope.$watch('sort', function (sort) {

                var data = scope.data;

                if (data.length === 0) {
                    return;
                }

                console.log('sort: ' + sort);

                var x0 = x.domain(data.sort(
                    sort ? function (a, b) {return b.gold - a.gold;} : function (a, b) {return d3.ascending(a.name, b.name);})
                        .map(function (d) {
                            return d.name;
                        }))
                    .copy();

                var transition = svg.transition().duration(750);
                var delay = function (d, i) {
                    return i * 50;
                };

                transition.selectAll('.bar')
                    .delay(delay)
                    .attr('x', function (d) {
                        return x0(d.name);
                    });

                transition.select('.x.axis')
                    .call(xAxis)
                    .selectAll('g')
                    .delay(delay);

            });

        }
    };
});
