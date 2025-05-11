
export default function Header() {
  return ( 
    <header className="bg-gray-950 text-white p-4 flex flex-wrap items-center gap-4">
      
      {/*projectプルダウン*/}
      <div className="flex flex-col text-sm">
        <select className="bg-white text-black px-4 py-2 rounded w-64">
          <option>セントレア</option>
          <option>千代田区さくらまつり</option>
          <option>三菱地所大丸有エリア</option>
          <option>広島空港</option>
          <option>全道データ(2023年2月20日)</option>
          <option>全道データ(2023年12月29日)</option>
          <option>全道データ(2024年3月～2025年2月)</option>
          <option>全国23年7月データ</option>
          <option>九州</option>
          <option>富士山</option>
          <option>小田原・箱根</option>
          <option>小樽</option>
          <option>札幌</option>
          <option>高松空港</option>
        </select>
      </div>

      <div className="flex flex-col text-sm">
        <select className="bg-white text-black px-4 py-2 rounded w-40">
          <option>0～10%</option>
          <option>10～20%</option>
          <option>20～30%</option>
          <option>30～40%</option>
          <option>40～50%</option>
          <option>50～60%</option>
          <option>60～70%</option>
          <option>70～80%</option>
          <option>80～90%</option>
          <option>90～100%</option>
        </select>
      </div>

      <div className="flex flex-col text-sm">
          <input type="number" placeholder="ID" min="1" max="20"
            className="bg-white text-black px-4 py-2 rounded w-28"
          />
      </div>
    </header>
  );
}
