import React, { useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
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

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        const pinSymbol = new PictureMarkerSymbol({
            url: `${process.env.PUBLIC_URL}/location.png`,
            width: "25px",
            height: "25px",
            yoffset: "12px"
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
                symbol: pinSymbol
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
