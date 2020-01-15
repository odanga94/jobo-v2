import Pro from '../models/pro';

const basePath = '../assets/pro-images';
const proList = [
    'Plumber',
    'Cleaner',
    'Electrician',
    'Beauty',
    'Moving',
    'Gardener',
    'Cook',
    'Painter',
    'Carpenter',
    'Taxes',
    'IT Technician',
    'Pest Control'
];
export const PROS = proList.map((pro, index) => new Pro('p' + (index + 1), pro, `${basePath}/${pro}.png`));
