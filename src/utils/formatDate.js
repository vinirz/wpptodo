module.exports = {
    formatDate(dateString) {
        const [datePart, timePart] = dateString.split(', ');

        const [day, month, year] = datePart.split('/').map(Number);

        const [hours, minutes] = timePart.split(':').map(Number);

        const dateObj = new Date(year, month - 1, day, hours, minutes);

        const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return(`${formattedDate} às ${formattedTime}`);
    },

    removeSeconds(dateTimeString) {
        let parts = dateTimeString.split(', ');
        let date = parts[0];
        let timeParts = parts[1].split(':');
        let hours = timeParts[0].padStart(2, '0');
        let minutes = timeParts[1].padStart(2, '0');
        let time = hours + ':' + minutes;
        return date + ', ' + time;
    }
}