import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function Scale() {
  const map = useMap();

  useEffect(() => {
    const scale = L.control.scale({ position: 'bottomleft', imperial: false });
    scale.addTo(map);
    return () => scale.remove();
  }, [map]);

  return null;
}
