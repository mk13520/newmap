import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import L from 'leaflet';

export default function Measure() {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircle: false,
      drawRectangle: false,
      drawPolygon: false,
      drawCircleMarker: false,
      drawPolyline: true,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
      drawText: false,
      rotateMode: false
    });

    // 距離を計測して表示
    map.on('pm:create', (e: any) => {
      if (e.layer && e.layer instanceof L.Polyline) {
        const latlngs = e.layer.getLatLngs();
        let total = 0;
        for (let i = 0; i < latlngs.length - 1; i++) {
          total += latlngs[i].distanceTo(latlngs[i + 1]);
        }

        const center = e.layer.getCenter?.() || latlngs[Math.floor(latlngs.length / 2)];

        const distanceText =
          total >= 1000
            ? (total / 1000).toFixed(2) + ' km'
            : total.toFixed(0) + ' m';

        const popup = L.popup()
          .setLatLng(center)
          .setContent(`<strong>距離:</strong> ${distanceText}`)
          .openOn(map);
      }
    });

    return () => {
      map.pm.removeControls();
    };
  }, [map]);

  return null;
}
