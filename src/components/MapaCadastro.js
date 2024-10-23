import React, { useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Graphic from '@arcgis/core/Graphic';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css';

const MapaCadastro = ({ onSelectLocation }) => {
    useEffect(() => {
        const map = new Map({
            basemap: "topo-vector"
        });

        const view = new MapView({
            container: "mapViewDiv",
            map: map,
            zoom: 10,
            center: [-46.47429255, -23.54534991]
        });

        const graphicsLayer = new GraphicLayer();
        map.add(graphicsLayer); 

        const pointSymbol = new SimpleMarkerSymbol({
            color: [226, 38, 54],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        });

        const handleMapClick = (event) => {
            const latitude = event.mapPoint.latitude;
            const longitude = event.mapPoint.longitude;

            const point = {
                type: "point",
                longitude: longitude,
                latitude: latitude
            };

            const pointGraphic = new Graphic({
                geometry: point,
                symbol: pointSymbol
            });

            graphicsLayer.removeAll();
            graphicsLayer.add(pointGraphic);

            onSelectLocation(latitude, longitude);
        };

        view.on("click", handleMapClick);

        return () => {
            if (view) {
                view.destroy();
            }
        };
    }, [onSelectLocation]);

    const handleModalClick = (event) => {
        event.stopPropagation(); 
    };

    return (
        <div onClick={handleModalClick} style={{ width: '80vw', height: '70vh' }}>
            <div id="mapViewDiv" style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default MapaCadastro;
