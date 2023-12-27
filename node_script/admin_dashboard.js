const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/admin_dashboard', (req, res) => {
    if (req.session.user  && req.session.user.role === 'admin') {
        const countQueryUsers = "SELECT COUNT(*) AS userCount FROM users WHERE role = 'user'";
        const countQueryFaculties = "SELECT COUNT(*) AS facultyCount FROM users";

        let Available_Faculty = 0;
        let Leave_Request = 0;

        db.query(countQueryUsers, (errorUsers, resultUsers) => {
            if (errorUsers) {
                console.error('Error fetching Available Faculty:', errorUsers);
                res.status(500).json({ error: 'Error fetching Available Faculty' });
                return;
            }

            Available_Faculty = resultUsers[0].userCount;

            db.query(countQueryFaculties, (errorFaculties, resultFaculties) => {
                if (errorFaculties) {
                    console.error('Error fetching Leave request:', errorFaculties);
                    res.status(500).json({ error: 'Error fetching Leave request' });
                    return;
                }

                Leave_Request = resultFaculties[0].facultyCount;

                // Send the combined response
                res.json({ Available_Faculty, Leave_Request });
            });
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
