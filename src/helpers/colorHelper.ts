const generateColors = (N: number): string[] => {
    let colors: string[] = [];

    const hueStep = 20;
    const hueNum = Math.floor(360 / hueStep);
    const minSaturation = 15;
    const maxSaturation = 80;
    const maxLightness = 75;
    const minLightness = 30;

    const saturationNum = Math.round(0.5 * (N / hueNum));
    const lightnessNum = saturationNum;
    const saturationStep = Math.round((maxSaturation - minSaturation) / saturationNum);
    const lightnessStep = Math.round((maxLightness - minLightness) / lightnessNum);

    for (let h = 0; h <= 360; h = h + hueStep) {
        for (let s = minSaturation; s <= maxSaturation; s = s + saturationStep) {
            for (let l = minLightness; l <= maxLightness; l = l + lightnessStep) {
                colors.push(`hsl(${h}, ${s}%, ${l}%)`);
            }
        }
    }

    colors = shuffleArray(colors);
    return colors;
};

export const assignColors = (events: string[]): { [key: string]: string } => {
    let colorMap: { [key: string]: string } = {};

    const colors = generateColors(events.length);

    for (let i = 0; i < events.length; i++) {
        colorMap[events[i]] = colors[i];
    }

    return colorMap;
};

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}
