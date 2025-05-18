import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Window from '../components/Window';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [project, setProject] = useState("セントレア");
  const [percentage, setPercentage] = useState("0～10%");
  const [id, setId] = useState("1");
  const [usedSpeeds, setUsedSpeeds] = useState<number[]>([]);
  const [usedMeshTypes, setUsedMeshTypes] = useState<number[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <Header
        project={project} setProject={setProject}
        percentage={percentage} setPercentage={setPercentage}
        id={id} setId={setId}
      />
      <main className="relative h-[600px]">
        <Map project={project} percentage={percentage} id={id} setUsedSpeeds={setUsedSpeeds} setUsedMeshTypes={setUsedMeshTypes}/>
        <Window usedSpeeds={usedSpeeds} usedMeshTypes={usedMeshTypes}/>
        
      </main>
    </div>
  );
}

