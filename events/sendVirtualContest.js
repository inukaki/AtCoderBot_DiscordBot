const cron = require('node-cron');
module.exports = {

    sendVirtualContest: function(client){

        cron.schedule('0 * * * * *', async () => {
            
        });
    }
}