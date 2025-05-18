import { speedColors, meshColors } from '../components/Color';

type Props = {
  usedSpeeds: number[];
  usedMeshTypes: number[];
};

export default function Window({ usedSpeeds, usedMeshTypes }: Props) {
  const showMesh0 = usedMeshTypes.includes(0);
  const showMesh1 = usedMeshTypes.includes(1);
  const meshCount = [showMesh0, showMesh1].filter(Boolean).length;

  const shouldShowMeshLegend = meshCount > 0;
  const shouldShowSpeedLegend = speedColors.some(({ range }) => {
    const [min, max] = range;
    return usedSpeeds.some((s) => s > min && s <= max);
  });

  // メッシュ表示数に応じて速度ウィンドウの位置調整
  const speedBottomClass = meshCount === 2
    ? 'bottom-[40px]'
    : 'bottom-[90px]';

  return (
    <>
      {/* メッシュ情報ウィンドウ */}
      {shouldShowMeshLegend && (
        <div className="absolute bottom-[180px] right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-20">
          <p className="font-semibold text-gray-700 mb-1 text-[11px]">15分以上</p>
          {showMesh0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: meshColors.over10.fill }}></div>
              <span className="text-gray-800 text-[11px]">0</span>
            </div>
          )}
          {showMesh1 && (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: meshColors.over15.fill }}></div>
              <span className="text-gray-800 text-[11px]">1</span>
            </div>
          )}
        </div>
      )}
{/* 速度情報ウィンドウ */}
{shouldShowSpeedLegend && (
  <div className={`absolute top-[430px] right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-24`}>
    <p className="font-semibold text-gray-700 mb-1 text-[11px]">速度 (km/h)</p>
    {speedColors.map((item, index) => {
      const [min, max] = item.range;
      const hasData = usedSpeeds.some((speed) => speed > min && speed <= max);
      return hasData ? (
        <div className="flex items-center" key={index}>
          <div className="w-4 h-4 mr-1" style={{ backgroundColor: item.transparent }}></div>
          <span className="text-[11px]">{item.label}</span>
        </div>
      ) : null;
    })}
  </div>
      )}
    </>
  );
}
