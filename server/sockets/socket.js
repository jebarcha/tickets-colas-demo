const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', (client) => {
    // console.log('Usuario conectado');

    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log('Siguiente ticket', siguiente);
        callback(siguiente);
    });

    // emit un evento llamado estadoActual el cual llamara y retornara ultimo ticket
    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        // actualiza/notificar cambios en los ULTIMOS 4
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
    });
});