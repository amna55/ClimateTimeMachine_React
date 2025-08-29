import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill } from "ol/style";

interface WorldMapProps {
  activeLayers?: {
    baseMap?: boolean;
    borders?: boolean;
    temperature?: boolean;
    anomaly?: boolean;
    absoluteAnomaly?: boolean;
  };
  tileUrls?: {
    lst?: string;
    anomaly?: string;
    absoluteAnomaly?: string;
  };
  year?: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ activeLayers = {}, tileUrls, year }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [layers, setLayers] = useState<{
    osmLayer?: TileLayer<any>;
    lstLayer?: TileLayer<any>;
    anomalyLayer?: TileLayer<any>;
    absoluteAnomalyLayer?: TileLayer<any>;
    wfsLayer?: VectorLayer<any>;
  }>({});

  // 🗺️ Initialize map only once
  useEffect(() => {
    if (!mapRef.current) return;

    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: activeLayers.baseMap ?? true,
    });

    const lstLayer = new TileLayer({
      source: new XYZ({
        url: tileUrls?.lst ?? "",
        crossOrigin: "anonymous",
      }),
      opacity: 0.8,
      visible: activeLayers.temperature ?? false,
    });

    const anomalyLayer = new TileLayer({
      source: new XYZ({
        url: tileUrls?.anomaly ?? "",
        crossOrigin: "anonymous",
      }),
      opacity: 0.8,
      visible: activeLayers.anomaly ?? false,
    });

    const absoluteAnomalyLayer = new TileLayer({
      source: new XYZ({
        url: tileUrls?.absoluteAnomaly ?? "",
        crossOrigin: "anonymous",
      }),
      opacity: 0.8,
      visible: activeLayers.absoluteAnomaly ?? false,
    });

    const wfsLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "https://ahocevar.com/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=ne:ne_10m_admin_0_countries&outputFormat=application/json",
      }),
      style: new Style({
        stroke: new Stroke({ color: "rgba(0,0,255,0.7)", width: 1.5 }),
        fill: new Fill({ color: "rgba(0,0,255,0.1)" }),
      }),
      visible: activeLayers.borders ?? true,
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [osmLayer, lstLayer, anomalyLayer, absoluteAnomalyLayer, wfsLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    setMap(mapInstance);
    setLayers({ osmLayer, lstLayer, anomalyLayer, absoluteAnomalyLayer, wfsLayer });

    return () => {
      mapInstance.setTarget(null);
    };
  }, []);

  // 🔄 Update tile sources when tileUrls change (year changes)
  useEffect(() => {
    if (!map) return;

    if (layers.lstLayer && tileUrls?.lst) {
      const src = layers.lstLayer.getSource() as XYZ;
      src.setUrl(tileUrls.lst);
    }

    if (layers.anomalyLayer && tileUrls?.anomaly) {
      const src = layers.anomalyLayer.getSource() as XYZ;
      src.setUrl(tileUrls.anomaly);
    }

    if (layers.absoluteAnomalyLayer && tileUrls?.absoluteAnomaly) {
      const src = layers.absoluteAnomalyLayer.getSource() as XYZ;
      src.setUrl(tileUrls.absoluteAnomaly);
    }
  }, [tileUrls, year]);


  // 🔄 Update visibility when activeLayers change
  useEffect(() => {
    if (!map) return;
    layers.osmLayer?.setVisible(activeLayers.baseMap ?? true);
    layers.wfsLayer?.setVisible(activeLayers.borders ?? true);
    layers.lstLayer?.setVisible(activeLayers.temperature ?? false);
    layers.anomalyLayer?.setVisible(activeLayers.anomaly ?? false);
    layers.absoluteAnomalyLayer?.setVisible(activeLayers.absoluteAnomaly ?? false);
  }, [activeLayers]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default WorldMap;
