const express = require('express');
const router = express.Router();
const db = require('./db');


let clients = [];

function sendUpdatesToClients() {
    const AvailableFaculty = "SELECT COUNT(*) AS userCount FROM pydatabase.users WHERE role = 'user'";
    const LeaveRequest = "SELECT COUNT(*) AS requestCount FROM pydatabase.leave WHERE status = 'Progress'";
    const LeaveApproved = "SELECT COUNT(*) AS approvedCount FROM pydatabase.leave WHERE status = 'approved'";
    const LeaveHistory = "SELECT l.name, u.profile_image, l.reason, l.status, l.date, l.days FROM pydatabase.leave l INNER JOIN pydatabase.users u ON l.email = u.email LIMIT 5;";

    let Available_Faculty = 0;
    let Leave_Request = 0;
    let Leave_Approved = 0;

    db.query(AvailableFaculty, (errorUsers, resultFaculties) => {
        if (errorUsers) {
            console.error('Error fetching Available Faculty:', errorUsers);
            return;
        }

        Available_Faculty = resultFaculties[0].userCount;

        db.query(LeaveRequest, (errorRequest, resultRequest) => {
            if (errorRequest) {
                console.error('Error fetching Leave request:', errorRequest);
                return;
            }
                
            Leave_Request = resultRequest[0].requestCount;

            db.query(LeaveApproved, (errorApproved, resultApproved) => {

                if (errorApproved) {
                    console.error('Error fetching Leave Approved:', errorApproved);
                    return;
                }
                
                Leave_Approved = resultApproved[0].approvedCount;

                const percentage = Math.floor(((Available_Faculty - Leave_Approved) / Available_Faculty) * 100);
                
                db.query(LeaveHistory, (errorLeave, Leave_History) => {
                    if (errorLeave) {
                        console.error('Error fetching leave records:', errorLeave);
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                    const data = {
                        Available_Faculty: `${Available_Faculty}`,
                        Leave_Request: `${Leave_Request}`,
                        Present_Percentage: `${percentage}`,
                        Leave_Approved: `${Leave_Approved}`,
                        Leave_History: Leave_History
                    };

                    clients.forEach(client => {
                        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
                    });
                });    
            });
        });
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