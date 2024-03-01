mapboxgl.accessToken = 'pk.eyJ1Ijoic3VuMzY2IiwiYSI6ImNsdDU2OHRpbzBhYW4yaW4yNjc3aGF3dHIifQ.2i4T9nX_ziiL0yXybFDjZw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/outdoors-v11',
    center: [77, 38.9],
    zoom: 9,
    scrollZoom: false // 禁用地图滚动缩放
});

const scroller = scrollama();

function loadLandmarks() {
    d3.json('assets/data.json').then(function(data) {
        data.SeattleLandmarks.forEach(function(landmark) {
            var svg = d3.select(map.getCanvasContainer()).append("svg")
                .attr("class", "d3-overlay")
                .style("position", "absolute")
                .style("top", 0)
                .style("left", 0)
                .style("width", "100%")
                .style("height", "100%");

 
            var location = map.project(new mapboxgl.LngLat(landmark.longitude, landmark.latitude));

            svg.append("circle")
                .attr("class", "landmark-point")
                .attr("data-longitude", landmark.longitude)
                .attr("data-latitude", landmark.latitude)
                .attr("r", 4)
                .style("fill", "#EBD616")
                .style('stroke','#CD8905')
                .style('stroke-width','2.5px');

        });
    });
}


scroller.setup({
    step: '.step',
    offset: 0.5,
    progress: true
})
.onStepEnter(response => {
    var stepData = response.element.dataset;
    var center = JSON.parse(stepData.center);
    var zoom = parseFloat(stepData.zoom);
if (stepData.scene === "0" || stepData.scene === "1" || stepData.scene === "2" ||stepData.scene==='4') {
    map.flyTo({
        center: center,
        zoom: zoom
    });
}

if (stepData.scene === "3") {
    map.flyTo({
        center: center,
        zoom: zoom
    });
    document.getElementById('image-container').classList.remove('hidden');
}

if (stepData.scene === "2") {
    loadLandmarks(); 
}

if (response.element.classList.contains('attraction')) {
    response.element.classList.add('active');
    map.flyTo({
        center: center,
        zoom: zoom
    });
}
})
.onStepExit(response => {
if (response.element.classList.contains('attraction')) {
    response.element.classList.remove('active');
}

    var stepData = response.element.dataset;

    if(stepData.scene === "2") {
        d3.selectAll(".landmark-point").remove(); 
    }
    if (stepData.scene === "3") {
    document.getElementById('image-container').classList.add('hidden');
}
});




window.addEventListener('resize', scroller.resize);

map.on('move', function() {
updatePoints();
});


function updatePoints() {
d3.selectAll('.landmark-point')
    .each(function() {
        var element = d3.select(this);
        var lngLat = [+element.attr('data-longitude'), +element.attr('data-latitude')];

        var point = map.project(lngLat);

        element.attr('cx', point.x).attr('cy', point.y);
    });
}
