import moment from 'moment';

class Order {
    constructor (id, problemName, service, totalAmount, date, proImage, clientAddress) {
        this.id = id;
        this.problemName = problemName;
        this.service = service;
        this.proImage = proImage;
        this.totalAmount = totalAmount;
        this.date = date;
        this.clientAddress = clientAddress;

    }

    get readableDate(){
        /*return this.date.toLocaleDateString('en-EN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });*/
        return moment(this.date).format('MMMM Do YYYY, h:mm a')
    }
}

export default Order;