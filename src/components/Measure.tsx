import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import L from 'leaflet';
import 'leaflet-geometryutil';

function toDMS(coord: number): string {
  const deg = Math.floor(coord);
  const minFloat = (coord - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(2);
  return `${deg}° ${min}' ${sec}"`;
}

function metersToFeet(m: number) {
  return (m * 3.28084).toFixed(0);
}

function metersToMiles(m: number) {
  return (m * 0.000621371).toFixed(2);
}

function sqmToAcres(sqm: number) {
  return (sqm * 0.000247105).toFixed(2);
}

export default function Measure() {
  const map = useMap();
  const drawnLayers = useRef<L.Layer[]>([]);

  useEffect(() => {
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircle: false,
      drawRectangle: false,
      drawPolygon: true,
      drawCircleMarker: false,
      drawPolyline: true,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
      drawText: false,
      rotateMode: false,
    });

    const handleCreate = (e: any) => {
      let latlngs: any[] = [];

      if (e.layer instanceof L.Polygon) {
        latlngs = e.layer.getLatLngs()[0];
      } else if (e.layer instanceof L.Polyline) {
        latlngs = e.layer.getLatLngs();
      } else {
        return;
      }

      drawnLayers.current.push(e.layer); // ⬅ レイヤーを記録

      const last = latlngs[latlngs.length - 1];
      if (!last?.lat || !last?.lng) return;

      const dmsLat = toDMS(last.lat);
      const dmsLng = toDMS(last.lng);

      let content = `
        <strong>Last point</strong><br/>
        ${dmsLat} N / ${dmsLng} E<br/>
        ${last.lat.toFixed(6)} / ${last.lng.toFixed(6)}<br/>
      `;

      if (e.layer instanceof L.Polyline) {
        let total = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          total += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        content += `
          <strong>Path distance:</strong><br/>
          ${metersToFeet(total)} Feet (${metersToMiles(total)} Miles)<br/>
        `;
      }

      if (e.layer instanceof L.Polygon) {
        const area = L.GeometryUtil.geodesicArea(latlngs);
        content += `
          <strong>Area:</strong><br/>
          ${sqmToAcres(area)} Acres
        `;
      }

      L.popup()
        .setLatLng(last)
        .setContent(content)
        .openOn(map);
    };

    map.on('pm:create', handleCreate);

    return () => {
      drawnLayers.current.forEach((layer) => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
      drawnLayers.current = [];

      if (map.pm && typeof map.pm.removeControls === 'function') {
        try {
          map.pm.removeControls();
        } catch (err) {
          console.warn("PM removeControls error:", err);
        }
      }

      map.off('pm:create', handleCreate);
    };
  }, [map]);

  return null;
}
