function initMap() {
        
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: {lat: -34.397, lng: 150.644}
        });
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
      }

      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').innerHTML;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
            
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
    
var latlng = "'" + results[0].geometry.location + "'";
latlng  = latlng.replace(/[() ]/g,'')
var split = latlng.split(",");
var lat = split[0];
var lng = split[1];
lat = lat.substring(1);
lng = lng.substring(0, lng.length - 1)
var apiKey = 'c30a812e476f7d082a52e489b3282d18';
var url = 'https://api.forecast.io/forecast/';

$.getJSON(url + apiKey + "/" + lat + "," + lng + "?callback=?", function(data) {
        $('#temp').html(data.currently.temperature + '° F');
        $('#minutely').html(data.minutely.summary);
});
        });
        
      }