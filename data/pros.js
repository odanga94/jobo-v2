import Pro from '../models/pro';
import ProDetails from '../models/proDetails';

export const PROS = [
    new Pro('p1', 'Plumber', require('../assets/pro-images/Plumber.png')),
    new Pro('p2', 'Cleaner', require('../assets/pro-images/Cleaner.png')),
    new Pro('p3', 'Electrician', require('../assets/pro-images/Electrician.png')),
    new Pro('p4', 'Beauty', require('../assets/pro-images/Beauty.png')),
    new Pro('p5', 'Moving', require('../assets/pro-images/Moving.png')),
    new Pro('p6', 'Gardener', require('../assets/pro-images/Gardener.png')),
    new Pro('p7', 'Cook', require('../assets/pro-images/Cook.png')),
    new Pro('p8', 'Painter', require('../assets/pro-images/Painter.png')),
    new Pro('p9', 'Carpenter', require('../assets/pro-images/Carpenter.png')),
    new Pro('p10', 'Taxes', require('../assets/pro-images/Taxes.png')),
    new Pro('p11', 'IT Technician', require('../assets/pro-images/IT-Technician.png')),
    new Pro('p12', 'Pest Control', require('../assets/pro-images/Pest-Control.png'))
];

export const PRO_DETAILS = [
    new ProDetails(
        ['p1', 'p2', 'p3', 'p6', 'p9', 'p11'],
        1,
        true,
        true,
        false
    ),
    new ProDetails(
        ['p8'],
        1,
        true,
        true,
        true
    ),
    new ProDetails(
        ['p4', 'p5', 'p10', 'p12', 'p7'],
        1,
        true,
        false,
        false
    )
]

