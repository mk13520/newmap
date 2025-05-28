import { useState } from 'react';
import { SlLayers } from 'react-icons/sl';

type Props = {
  layer: string;
  setLayer: (value: string) => void;
  showLog: boolean;
  setShowLog: (value: boolean) => void;
  showMesh: boolean;
  setShowMesh: (value: boolean) => void;
};

export default function Layer({ layer, setLayer, showLog, setShowLog, showMesh, setShowMesh }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-21 left-3 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white p-2 rounded shadow hover:bg-gray-100"
      >
        <SlLayers className="w-6 h-6 text-gray-800" />
      </button>

      {open && (
        <div className="mt-2 bg-white p-3 rounded shadow w-42 text-sm space-y-3"> {/*absolute top-0 left-0 bg-white p-3*/}
          <div>
            {[
              { id: 'osm', label: 'OpenStreetMap' },
              { id: 'positron', label: 'CartoDB.Positron' },
              { id: 'topo', label: 'Esri.WorldTopoMap' },
              { id: 'gsi_std', label: '地理院（標準）' },
              { id: 'gsi_light', label: '地理院（淡色）' },
              { id: 'gsi_photo', label: '地理院（写真）' },
            ].map((item) => (
              <label key={item.id} className="block">
                <input
                  type="radio"
                  name="basemap"
                  value={item.id}
                  checked={layer === item.id}
                  onChange={() => setLayer(item.id)}
                  className="mr-2"
                />
                {item.label}
              </label>
            ))}
          </div>

          <div className="pt-2 border-t">
            <label className="block">
              <input type="checkbox" className="mr-1" checked={showLog} onChange={() => setShowLog(!showLog)}/>
              ログ
            </label>
            <label className="block mt-1">
              <input type="checkbox" className="mr-1" checked={showMesh} onChange={() => setShowMesh(!showMesh)}/>
              滞在地メッシュ
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
