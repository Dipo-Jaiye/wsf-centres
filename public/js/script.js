let map;

console.log("Check check");

async function initMap() {
    const center = { lat: 7.147533645202111, lng: 3.3617103099824286 };
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 9,
    mapTypeControlOptions: {
        mapTypeIds: ["roadmap"]
    }
  });

    const contentString = (centre) => {
        return `<h1>${centre.name}</h1>
        <div><p>${centre.address}</p></div>
        <div><p>${centre.contact.join(", ")}</p></div>
        <div><p>${centre.phone.join(", ")}</p></div>
        <div><a href="/centre/locate?id=${centre._id}">Location Editor</a></div>`;
    }
    const infowindow = new google.maps.InfoWindow();
    const queryString = window.location.search;
    const fetchUrl = queryString ? `/map${queryString}` : "/map";
    const response = await fetch(fetchUrl,{method:"POST"});
    const data = await response.json();
    data.forEach(v => {
            const marker = new google.maps.Marker({
                position: v.latlng,
                map: map,
                icon: "/img/icon.png"
            });
            if(queryString) map.panTo(v.latlng);
            marker.addListener("click",() => {
                infowindow.setContent(contentString(v));
                infowindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: true
                });
            });
            
        });
    const howFar = new google.maps.Marker({map});
    map.addListener("click", (ev) => {
            howFar.setPosition(ev.latLng);
            map.panTo(ev.latLng);
            //closestTo(ev.latLng);
    });
    howFar.addListener("click",()=>{
        howFar.setPosition(null);
        map.panTo(center);
    })
}

async function locateMap() {
    const queryString = window.location.search;
    const fetchUrl = `/map${queryString}`
    const response = await fetch(fetchUrl,{method:"POST"});
    const data = await response.json();
    const center = data[0].latlng;
  map = new google.maps.Map(document.getElementById("locatemap"), {
    center,
    zoom: 11,
    mapTypeControlOptions: {
        mapTypeIds: ["roadmap"]
    }
  });

  const marker = new google.maps.Marker({
    position: center,
    map: map,
    icon: "/img/icon.png"
    });

    map.addListener("click",(ev)=>{
        marker.setPosition(ev.latLng);
        map.panTo(ev.latLng);
        const location = document.getElementById("location");
	    location.value = [ev.latLng.lat(),ev.latLng.lng()];
    });

    const checkButton = document.getElementById("check");
    checkButton.addEventListener("click",()=>{
        let address = document.getElementById("address").value;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address':address, 'region':'NG'}, (results, status) => {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                marker.setPosition(results[0].geometry.location);
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
        });
    });

    const coordinatesButton = document.getElementById("coordinates");
    coordinatesButton.addEventListener("click",getLocation);

    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(changeLocation,null,{enableHighAccuracy:true});
        }
    }
    
    function changeLocation(pos){
        const long = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const location = document.getElementById("location");
        location.value = [lat,long];
        map.panTo({lat,lng:long});
        marker.setPosition({lat,lng:long})
    }
}