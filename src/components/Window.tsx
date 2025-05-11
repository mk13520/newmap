import { speedColors } from '../components/Color';

export default function Window() {
  return (
    <>
      {/*15分以上情報ウィンドウ*/}
      <div className="absolute bottom-[180px] right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-19">
        <p className="font-semibold text-gray-700 mb-1 text-[11px]">15分以上</p>

          <div className="flex items-center mb-1">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#A2D3A0' }}></div>
              <span className="text-gray-800 text-[11px]">0</span>
          </div>
          <div className="flex items-center">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: '#9ABDD5' }}></div>
              <span className="text-gray-800 text-[11px]">1</span>
          </div>
        </div>


      {/* 速度情報ウィンドウ */}
      <div className="absolute bottom-7 right-2 bg-white bg-opacity-80 shadow-md rounded-md p-2 text-xs z-50 w-24">
        <p className="font-semibold text-gray-700 mb-1 text-[11px]">速度 (km/h)</p>

          {speedColors.map((item, index) => (
          <div className="flex items-center mb-1" key={index}>
              <div
                className="w-3 h-3 mr-1"
                style={{ backgroundColor: item.transparent }}></div>
              <span className="text-[11px]">{item.label}</span>
          </div>
          ))}

      </div>
    </>
  );
}
