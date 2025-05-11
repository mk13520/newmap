import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Window from '../components/Window';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return ( 
    <div className="min-h-screen bg-gray-100 flex flex-col relative"> 
      <Header /> {/*ヘッダー呼び出し*/} 
      <main className="relative h-[600px]"> 
        <Map /> {/*マップ*/} 
        <Window/> {/*情報ウィンドウ*/} 
      </main> 
    </div>
  );
}

/*installしたのは
npm install react-icons
fetch('https://pg62dljxb1.execute-api.ap-northeast-1.amazonaws.com/Sample') //0511(URLをラムダに)

距離図るコンポーネント
npm install leaflet-measure✖
npm install @geoman-io/leaflet-geoman-free
npm install leaflet-geometryutil */
