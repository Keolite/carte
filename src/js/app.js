require('../css/app.css');

class Kmap{

    constructor(){
        this.map = '';
        this.localCoordonates = {'lat': null, 'lgt' : null };
        this.allMarkers = [[46.9025918,5.7722434 ],[47.1, 5.5 ]];
        this.layerAllMarkers = '';
        this.dir = '';
        this.layerDir = '';
        this.defineMap();
    }


    setLocalCoordonate(){
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition( (position) => {
                this.localCoordonates.lat = position.coords.latitude;
                this.localCoordonates.lgt = position.coords.longitude;
            });
        } else {
            this.localCoordonates.lat = 46.7454643;
            this.localCoordonates.lgt = 5.9081772;
        }   
        
        
    }

    defineMap(){
        this.setLocalCoordonate();
        setTimeout(() => this.drawMap(), 3000);                    
    }


    drawMap(){

        this.map = L.map('map', { 
            layers: MQ.mapLayer(),
            center: [ this.localCoordonates.lat , this.localCoordonates.lgt ],
            zoom: 15
        });

        this.layerAllMarkers = L.layerGroup().addTo(this.map);
        this.addAllMarkers( this.allMarkers );
        this.drawRouting({ lat: this.localCoordonates.lat, lng: this.localCoordonates.lgt}, { lat: this.allMarkers[0][0], lng: this.allMarkers[0][1]} );

        
    }

    addAllMarkers( listMarker ){
        for( let element of listMarker){
            this.addOneMarker(element[0], element[1] );
        }
    }

    addOneMarker(latitude, longitude){
        L.marker([latitude, longitude], {
            //icon: L.mapquest.icons.marker({
                //size: 'sm'
            //}),
            draggable: false
        }).bindPopup("Vous voulez aller ici").on('click', (e ) => {
            this.map.removeLayer(this.layerDir);
            this.drawRouting({ lat: this.localCoordonates.lat, lng: this.localCoordonates.lgt},  e.latlng );
            } ).addTo(this.layerAllMarkers);
    }

    drawRouting( coordStart, coordEnd ){
        this.dir = MQ.routing.directions().on('success', function(data) {
            var legs = data.route.legs,
                html = '',
                maneuvers,
                i;
            
            if (legs && legs.length) {
                maneuvers = legs[0].maneuvers;

                for (i=0; i<maneuvers.length; i++) {
                    html += (i+1) + '. ';
                    html += maneuvers[i].narrative + '<br/>';
                }

                L.DomUtil.get('route-narrative').innerHTML = html;
            }
        });
        this.dir.route({
            locations: [{ latLng: coordStart },{ latLng: coordEnd }]
        });
        this.layerDir = MQ.routing.routeLayer({
            directions: this.dir,
            fitBounds: true
        });
        this.map.addLayer(this.layerDir);
    }
}

const myMap = new Kmap();
 
