const express = require('express');
const router = express.Router();
const User = require('./schemas/user');
const Leave = require('./schemas/leave');

let clients = [];

function sendUpdatesToClients() {
    Promise.all([
        User.countDocuments({ role: 'user' }),
        Leave.countDocuments({ status: 'Progress' }),
        Leave.countDocuments({ status: 'approved' }),
        Leave.find({}).populate('user', 'name profile_image').limit(5).lean()
    ])
    .then(([userCount, requestCount, approvedCount, leaveHistory]) => {
        const percentage = Math.floor(((userCount - approvedCount) / userCount) * 100);
        const data = {
            Available_Faculty: `${userCount}`,
            Leave_Request: `${requestCount}`,
            Present_Percentage: `${percentage}`,
            Leave_Approved: `${approvedCount}`,
            Leave_History: leaveHistory.map(item => ({
                name: item.user.name,
                profile_image: item.user.profile_image,
                reason: item.reason,
                status: item.status,
                date: item.date,
                days: item.days,
            })),
        };

        clients.forEach(client => {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

router.get('/admin_dashboard', (req, res) => {
    if (req.session.userRole === 'admin') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        clients.push({ req, res });

        req.on('close', () => {
            clients = clients.filter(client => client.res !== res);
        });

        sendUpdatesToClients();
    } else {
       res.status(401).json({ message: 'Unauthorized' });
    }
});

setInterval(sendUpdatesToClients, 5000);

module.exports = router;