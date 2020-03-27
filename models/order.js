import moment from 'moment';

class Order {
    constructor(
        id,
        orderDetails
    ) {
        this.id = id;
        this.proImage = "https://firebasestorage.googleapis.com/v0/b/jobo-3a84b.appspot.com/o/proPic.jpg?alt=media&token=63fe6e15-9529-432b-b6e5-74d792b5211d";
        this.proName = "John Odanga";
        this.totalAmount = 200;
        this.orderDetails = orderDetails
    }

    get readableDate() {
        return moment(this.orderDetails.dateRequested).format('MMMM Do YYYY, h:mm a')
    }
}

export default Order;