import { speedColors, meshColors } from '../components/Color';

type Props = {
  usedSpeeds: number[]; // 使用されているスピード値
  usedMeshTypes: number[]; // 使用されているメッシュタイプ（0 or 1）
};

export default function Window({ usedSpeeds, usedMeshTypes }: Props) {
  return (
    <>
      {/* メッシュ情報ウィンドウ */}
      <div className="absolute bottom-[180px] right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-24">
        <p className="font-semibold text-gray-700 mb-1 text-[11px]">15分以上</p>

        {usedMeshTypes.includes(0) && (
          <div className="flex items-center">
            <div className="w-4 h-4 mr-1" style={{ backgroundColor: meshColors.over10.fill }}></div>
            <span className="text-gray-800 text-[11px]">0</span>
          </div>
        )}
        {usedMeshTypes.includes(1) && (
          <div className="flex items-center">
            <div className="w-4 h-4 mr-1" style={{ backgroundColor: meshColors.over15.fill }}></div>
            <span className="text-gray-800 text-[11px]">1</span>
          </div>
        )}
      </div>

      {/* 速度情報ウィンドウ */}
      <div className="absolute bottom-7 right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-24">
        <p className="font-semibold text-gray-700 mb-1 text-[11px]">速度 (km/h)</p>

        {speedColors.map((item, index) => {
          // この速度範囲に該当するデータがあるか判定
          const hasData = usedSpeeds.some(speed => speed >= item.range[0] && speed <= item.range[1]);
          return hasData ? (
            <div className="flex items-center" key={index}>
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: item.transparent }}></div>
              <span className="text-[11px]">{item.label}</span>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}
