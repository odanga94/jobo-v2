import Order from '../../models/order';

const initialState = {
    orders: [
        new Order(
            new Date().toString(),
            'Broken Sink',
            'Plumber',
            1000,
            new Date(),
            require('../../assets/proPic.jpg'),
            'Ngong View Flats, Thiong\'o Road'
        ),
        new Order(
            new Date().toString(),
            'Laundry',
            'Cleaner',
            300,
            new Date(),
            require('../../assets/proPic.jpg'),
            'BuruBuru Phase V'
        )
    ]
}

export default (state = initialState, action) => {
    return state;
}