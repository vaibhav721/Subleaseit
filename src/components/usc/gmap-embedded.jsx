import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker, Polygon } from "google-maps-react";
import "../../styles/subposts.css";

const MapComponent = ({ google, address }) => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isMapReady, setIsMapReady] = useState(false);
  const [shortestDistance, setShortestDistance] = useState(null);

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const { lat, lng } = results[0].geometry.location;
        setCoordinates({ lat: lat(), lng: lng() });
        setIsMapReady(true);

        // Calculate shortest distance from the marker to the specified coordinate
        const service = new google.maps.DistanceMatrixService();
        const origin = new google.maps.LatLng(lat(), lng());
        const destination = new google.maps.LatLng(
          34.02193694086112,
          -118.28691493683581
        );
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.WALKING,
          },
          (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK) {
              const originalDistance =
                response.rows[0].elements[0].distance.value; // Assuming distance is in meters
              const reducedDistanceInMeters = Math.max(
                originalDistance - 200,
                0
              ); // Subtract 500 meters and ensure the value is not negative
              const reducedDistanceInKilometers =
                reducedDistanceInMeters / 1000; // Convert meters to kilometers
              const reducedDistanceWithOneDecimal =
                reducedDistanceInKilometers.toFixed(1); // Limit the decimal places to 1
              const distanceText = reducedDistanceWithOneDecimal + " km to USC";
              setShortestDistance(distanceText);
            }
          }
        );
      }
    });
  }, [address, google]);

  /**
   * DPS Region Coordinates
   */
  const polygonCoordinates = [
    { lat: 34.032721944449854, lng: -118.30025576010713 },
    { lat: 34.032664479547364, lng: -118.29145126000361 },
    { lat: 34.03601482304601, lng: -118.29152355379149 },
    { lat: 34.035957633211424, lng: -118.28402999123362 },
    { lat: 34.03985662693927, lng: -118.28412541501461 },
    { lat: 34.03275278868424, lng: -118.26820936738162 },
    { lat: 34.02048091082291, lng: -118.27626087847904 },
    { lat: 34.019816067685724, lng: -118.27480726766937 },
    { lat: 34.013204837526885, lng: -118.27915040180808 },
    { lat: 34.01375842875551, lng: -118.28017990476313 },
    { lat: 34.01416973674551, lng: -118.28259121073864 },
    { lat: 34.01103098735346, lng: -118.28255634202465 },
    { lat: 34.01080284246439, lng: -118.29146856859532 },
    { lat: 34.01827722465273, lng: -118.29156512811022 },
    { lat: 34.01831376363631, lng: -118.30017643869832 },
    { lat: 34.032721944449854, lng: -118.30025576010713 },
  ];

  const markerIcon = {
    url:
      process.env.PUBLIC_URL + "/assets/img/subleaseit/white_background.jpeg",
    scaledSize: new google.maps.Size(95, 20),
  };

  return (
    <div className="map-container">
      {isMapReady ? (
        <Map
          google={google}
          initialCenter={coordinates}
          className="map"
          center={coordinates}
          zoom={13}
        >
          <Marker position={coordinates} />
          <Polygon
            paths={polygonCoordinates}
            strokeColor="#FF0000"
            strokeOpacity={7}
            strokeWeight={2}
            fillColor="#FF0000"
            fillOpacity={0.25}
          />

          {shortestDistance && (
            <Marker
              position={{
                lat: 34.01999617716494,
                lng: -118.28634659656085,
              }}
              label={shortestDistance}
              icon={markerIcon}
            />
          )}

          {/* Legend */}
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              right: "10px",
              background: "#fff",
              padding: "4px",
              border: "1px solid #ccc",
              opacity: 0.9,
            }}
          >
            <div>
              <span style={{ color: "#ed8887", marginRight: "5px" }}>■</span>{" "}
              DPS Zone (Safe Zone)
            </div>
            <div>
              <Marker
                position={{ lat: 34.01999617716494, lng: -118.28634659656085 }}
                label="Shortest Distance"
                icon={markerIcon}
              />
            </div>
          </div>
        </Map>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDCCNg5jw_Cj8uctRg4WctO_ai36MzhuPs",
})(MapComponent);
