import { useMap } from 'react-leaflet';
import {MapContainer, TileLayer, CircleMarker, Popup, Polyline, Rectangle} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useEffect, useState, useRef } from 'react';
import { getSpeedColor, getMeshStyle } from '../components/Color';
import Layer from './Layer';
import Scale from './Scale';
import Measure from './Measure';

function CreateMeshPane() {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane('meshPane')) {
      map.createPane('meshPane');
      const pane = map.getPane('meshPane');
      if (pane) pane.style.zIndex = '600';
    }
  }, [map]);

  return null;
}

type Props = {
  project: string;
  percentage: string;
  id: string;
  setUsedSpeeds: (speeds: number[]) => void;
  setUsedMeshTypes: (types: number[]) => void;
};

function CenterMapOnPoints({
  points,
  zoom,
  project,
  percentage,
  id,
}: {
  points: any[];
  zoom: number;
  project: string;
  percentage: string;
  id: string;
}) {
  const map = useMap();
  const hasCentered = useRef(false);
  const prevKey = useRef(`${project}_${percentage}_${id}`);

  useEffect(() => {
    const currentKey = `${project}_${percentage}_${id}`;
    if (points.length === 0) return;

    if (prevKey.current !== currentKey) {
      hasCentered.current = false;
      prevKey.current = currentKey;
    }

    if (hasCentered.current) return;

    const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const avgLon = points.reduce((sum, p) => sum + p.lon, 0) / points.length;

    map.setView([avgLat, avgLon], zoom);
    hasCentered.current = true;
  }, [points, map, project, percentage, id, zoom]);

  return null;
}




export default function Map({ project, percentage, id, setUsedSpeeds, setUsedMeshTypes }: Props) {
  // これらを fetch URL に使うなど
  useEffect(() => {
    console.log("選択されたプロジェクト:", project);
    console.log("パーセンテージ:", percentage);
    console.log("ID:", id);
    // ここでURLやフィルタに使えるように
  }, [project, percentage, id]);

  const [isClient, setIsClient] = useState(false);
  const [points, setPoints] = useState([]);   //マーカのGPSデータ保持
  const [layer, setLayer] = useState('osm'); // デフォルトはOpenStreetMap
  const [showLog, setShowLog] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
    //滞在地メッシュ南西・北東
  const [meshes, setMeshes] = useState([]);
  const [zoom, setZoom] = useState(14); // 初期ズーム


  useEffect(() => {
    fetch('/data/mesh.json')
      .then((res) => res.json())
      .then((data) => setMeshes(data))
      .catch((err) => console.error('メッシュ読み込みエラー', err));
  }, []);


  
  useEffect(() => {   //Jsonデータ描画
    setIsClient(true);

    fetch('/data/sample.json') //0511(URLをラムダに)
      .then((res) => res.json())  //fetch関数でjson読込み
      .then((data) => setPoints(data))    //points格納
      .catch((err) => console.error('JSON 読み込みエラー', err));
  }, []);

 

  // props（project, percentage, id）はすでに受け取っている前提
  const filteredPoints = points.filter(
    (p) =>
      p.project === project &&
      p.percentage === percentage &&
      p.id === id
  );

  const filteredMeshes = meshes.filter(
    (m) =>
      m.project === project &&
      m.percentage === percentage &&
      m.id === id
  );

    // 使われている色（スピード・メッシュ）を親に通知
  useEffect(() => {
  if (isClient) {
    setUsedSpeeds(filteredPoints.map(p => p.speed));
    setUsedMeshTypes(filteredMeshes.map(m => m.is_over15min));
  }
}, [isClient, filteredPoints, filteredMeshes]);

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
      <MapContainer center={[35.707, 139.752]} zoom={zoom}whenCreated={(mapInstance) => { mapInstance.on('zoomend', () => {setZoom(mapInstance.getZoom()); });}} className="w-full h-full z-0">

      
        <CreateMeshPane />
        <TileLayer url={layerUrls[layer]} attribution="&copy; 地図提供" />
        <Scale />
        <Measure />
        <CenterMapOnPoints
  points={filteredPoints}
  zoom={14}
  project={project}
  percentage={percentage}
  id={id}
/>

        


        {/*2点以上あるとき線でつなぐ*/}
{showLog && filteredPoints.length > 1 && (
  <Polyline
    positions={filteredPoints.map((p) => [p.lat, p.lon])}
    pathOptions={{ color: 'red', weight: 2 }}
    pane="markerPane"
  />
)}

{showMesh && filteredMeshes.map((m, i) => {
  const style = getMeshStyle(m.is_over15min);
  return (
  <Rectangle
    key={i}
    bounds={[[m.lat_sw, m.lng_sw], [m.lat_ne, m.lng_ne]]}
    pathOptions={{
      color: style.border,
        fillColor: style.fill,
      fillOpacity: 0.7,
      weight: 1
    }}
    pane="meshPane"
  />
  );
})}


{/*マーカー*/}
{showLog &&
  filteredPoints.map((p, i) => (
    <CircleMarker
      key={i}
      center={[p.lat, p.lon]}
      radius={10}
      pathOptions={{
        color: 'red',
        weight: 1.5,
        opacity: 0.4,
        pane: 'overlayPane' ,
        fillColor: getSpeedColor(p.speed),
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


  