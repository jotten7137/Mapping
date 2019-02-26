//Data - Links
var earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Get request
d3.json(earthquake, function(data){
    createFeatures(data.features);
})

//createFeatures function
function createFeatures(earthquakedata){
    //earthquakes variable with GeoJSON layer
    
    var earthquakes = L.geoJSON(earthquakedata,{
        onEachfeature: function(feature,layer){
            //popup feature of layer - where, when, magnitude
            layer.bindPopup("<h3>Location"+feature.properties.place+"</h3><p>"+ new Date(feature.properties.time)+"</p><hr><h3>Magnitude"+feature.properties.mag+"</h3>");
        },
            //dots feature of layer - radius, fill, opacity, etc.
        pointToLayer: function(feature,latlng){
            return new L.circle(latlng,
                {radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity:.5,
                color:"#000",
                stroke: true,
                weight:.7
                })
        }
    });
    createMap(earthquakes)
};

//getRadius function
function getRadius(integer){
    return integer*20000
}

//getColor function
function getColor(color){
    return color>5?"#bc280b":
    color>4 ? "#db6918":
    color>3 ? "#dd8208":
    color>2 ? "#e2ea41":
    color>1 ? "#a8e27f":
    "#e4edd7";
}

//Map Framework
function createMap(earthquakes){
        var lightMap = {"Light Map": L.tileLayer("https://api.mapbox.com/styles/v1/jotten7137/cjsl4lqyw3i5w1fpjuyb5uyc5.html?fresh=true&title=true&access_token=pk.eyJ1Ijoiam90dGVuNzEzNyIsImEiOiJjanNmZHdva2gwczBpNDRzN3UycXlhN2V0In0.y5lbUW6xlSTXjkLm86QthQ#13.6/37.784020/-122.403944/0"),
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        accessToken: API_KEY,
        };
        
        var myMap = L.map("map",{
            center:[41.5,81.69],
            zoom: 3,
            layers:[earthquakes,lightMap]
            });
        L.control.layers(myMap,{
            collapsed:false
        }).addTo(myMap);

//Legend
    var legend = L.control({position:'bottomleft'});

    legend.onAdd = function(myMap){
        var div = L.DomUtil.create('div','info legend'),
        grades = [0,1,2,3,4,5],
        labels = [];
        for (var i=0;i<grades.length;i++){
            div.innerHTML += '<i style="background:'+getColor(grades[i]+1)+ 
                            '"></i>'+ (grades[i+1]?'&ndash;' + 
                            grades[i+1]+'<br>':'+');
        }
    return div;
    };
legend.addTo(myMap);
};