import {MapContainer, TileLayer, CircleMarker, Popup, Polyline, Rectangle} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useEffect, useState } from 'react';
import { getSpeedColor } from '../components/Color';
import Layer from './Layer';
import Scale from './Scale';
import Measure from './Measure';

export default function Map() {
  const [isClient, setIsClient] = useState(false);
  const [points, setPoints] = useState([]);   //マーカのGPSデータ保持
  const [layer, setLayer] = useState('osm'); // デフォルトはOpenStreetMap
  const [showLog, setShowLog] = useState(true);
  const [showMesh, setShowMesh] = useState(true);


  useEffect(() => {   //Jsonデータ描画
    setIsClient(true);

    fetch('/data/sample.json') //0511(URLをラムダに)
      .then((res) => res.json())  //fetch関数でjson読込み
      .then((data) => setPoints(data))    //points格納
      .catch((err) => console.error('JSON 読み込みエラー', err));
  }, []);

  if (!isClient) return null;   //ブラウザで描画確定まで表示しない


  //滞在地メッシュ南西・北東
  const stayArea = {
    sw: [35.725, 139.75],
    ne: [35.72917, 139.7562],
  };

    // レイヤーごとのURL
  const layerUrls: { [key: string]: string } = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    positron: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    gsi_std: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    gsi_light: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    gsi_photo: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
  };

  return (
    <>
      <Layer layer={layer} setLayer={setLayer} showLog={showLog} setShowLog={setShowLog} showMesh={showMesh} setShowMesh={setShowMesh} />
      <MapContainer center={[35.707, 139.752]} zoom={14} className="w-full h-full z-0">
        <TileLayer url={layerUrls[layer]} attribution="&copy; 地図提供" />
        <Scale />
        <Measure />

        {/*2点以上あるとき線でつなぐ*/}
        {showLog && points.length > 1 && (
          <Polyline
            positions={points.map((p) => [p.lat, p.lon])}
            pathOptions={{ color: 'red', weight: 2 }}
          />
        )}

        {/*滞在地メッシュ*/}
        {showMesh && (
          <Rectangle
            bounds={[stayArea.sw, stayArea.ne]}
            pathOptions={{
              color: '#00BFFF',
              fillColor: '#00BFFF',
              fillOpacity: 0.3,
              weight: 1
            }}
          />
        )}

        {/*マーカー*/}
        {showLog && points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lon]}
            radius={10}
            pathOptions={{
              color: getSpeedColor(p.speed),  //枠線
              fillColor: getSpeedColor(p.speed),  //塗りつぶし
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="text-xs">
                <p><strong>device_id </strong> {p.device_id}</p>
                <p><strong>datetime </strong> {p.datetime}</p>
                <p><strong>speed </strong> {p.speed} km/h</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
    </>
  );
}
  