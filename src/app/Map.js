'use client'
import { useState, useEffect } from 'react'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const Map = () => {
    const [geojsonData, setGeojsonData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      axios.get('marine_buoys.geojson')
        .then(response => {
          setGeojsonData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching GeoJSON data:', error);
          setLoading(false);
        });
    }, []);
  
    useEffect(() => {
      if (!loading && geojsonData) {
        const map = L.map('map').setView([45, -65], 7);
        
        // Add default tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  
        const geoJsonLayer = L.geoJSON(geojsonData, {
          pointToLayer: function (feature, latlng) {
            // Customize marker icon
            const markerIcon = L.icon({
              iconUrl: 'download.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41]
            });
  
            const popupContent = `
              <b>ID:</b> ${feature.properties.id}<br>
              <b>Type:</b> ${feature.properties.type}<br>
              <b>Status:</b> ${feature.properties.status}<br>
              <b>Description:</b> ${feature.properties.description}<br>
              <b>Latitude:</b> ${latlng.lat}<br>
              <b>Longitude:</b> ${latlng.lng}
            `;
  
            return L.marker(latlng, { icon: markerIcon }).bindPopup(popupContent);
          }
        }).addTo(map);
  
        // Add layer control
        const baseMaps = {
          'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
        };
        const overlayMaps = {
          'GeoJSON': geoJsonLayer
        };
        L.control.layers(baseMaps, overlayMaps).addTo(map);
      }})
  
    return (
      <div id="map" style={{ height: '100vh', width: '100%'}} />
    );
  }
  
  export default Map;