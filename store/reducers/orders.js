import Order from '../../models/order';

const initialState = {
    orders: [
        new Order(
            new Date('Sat Jan 25 2020 10:56:32 GMT+0300 (EAT)').toString(),
            'Broken Sink',
            'Plumber',
            1000,
            new Date('Sat Jan 25 2020 10:56:32 GMT+0300 (EAT)'),
            'John Odanga',
            require('../../assets/proPic.jpg'),
            'Ngong View Flats, Thiong\'o Road',
            require('../../assets/mapPic.jpg'),
        ),
        new Order(
            new Date().toString(),
            'Laundry',
            'Cleaner',
            300,
            new Date(),
            'Olivia',
            require('../../assets/proPic.jpg'),
            'BuruBuru Phase V',
            require('../../assets/mapPic.jpg'),
        )
    ]
}

export default (state = initialState, action) => {
    return state;
}