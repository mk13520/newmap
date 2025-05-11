
export const speedColors = [
    { range: [0, 5], label: '[0,5]', color: '#0D0887', transparent: 'rgba(13, 8, 135, 0.6)' },
    { range: [5, 20], label: '[5,20]', color: '#5D01A6', transparent: 'rgba(93, 1, 166, 0.6)' },
    { range: [20, 40], label: '[20,40]', color: '#9C179E', transparent: 'rgba(156, 23, 158, 0.6)' },
    { range: [40, 60], label: '[40,60]', color: '#CC4779', transparent: 'rgba(204, 71, 121, 0.6)' },
    { range: [60, 100], label: '[60,100]', color: '#ED7953', transparent: 'rgba(237, 121, 83, 0.6)' },
    { range: [100, 300], label: '[100,300]', color: '#FDB32F', transparent: 'rgba(253, 179, 47, 0.6)' },
  ];
  
export function getSpeedColor(speed: number, transparent = false): string {
    const found = speedColors.find(({ range }) => speed >= range[0] && speed <= range[1]);
    return transparent ? found?.transparent ?? '#CCCCCC' : found?.color ?? '#CCCCCC';
  }
  