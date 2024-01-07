const express = require('express');
const router = express.Router();
const User = require('./schemas/user');
const Leave = require('./schemas/leave');

let clients = [];

function checkSessionValidity(client) {
  if (client.req.session && client.req.session.userRole === 'admin') {
    client.res.write('event: ping\n');
    client.res.write('data: {}\n\n');
  } else {
    client.res.write('event: session_expired\n');
    client.res.write('data: {}\n\n');
    client.res.statusCode = 401;
    client.res.end();
    clients = clients.filter(c => c !== client);
  }
}

function sendUpdatesToClients() {
  Promise.all([
    User.countDocuments({ role: 'user' }),
    Leave.countDocuments({ status: 'Pending' }),
    Leave.countDocuments({ status: 'Approved' }),
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
        checkSessionValidity(client); // Check session validity for each client
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

router.get('/check_session', (req, res) => {
  if (req.session.userRole === 'admin') {
    res.status(200).json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

setInterval(sendUpdatesToClients, 5000);

module.exports = router;
