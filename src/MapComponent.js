import React, { useEffect } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';

const MapComponent = () => {
  useEffect(() => {
    // GeoServer WMS URL
    const geoserverWMSUrl = '/geoserver/test/wms';

    // OpenLayers Map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new TileWMS({
            url: geoserverWMSUrl,
            params: { 'LAYERS': 'test:Philips1', 'TILED': true },
            serverType: 'geoserver',
            crossOrigin: 'anonymous',
          }),
        }),
      ],
      view: new View({
        center: [20204.856031830244, 14223.65701339989],
        zoom:12,
      }),
    });
    
    return () => {
      map.dispose();
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default MapComponent;
