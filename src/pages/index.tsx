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
