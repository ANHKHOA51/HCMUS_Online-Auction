import express from 'express';
import userController from '../controllers/user.controller.js';
const router = express.Router();

router.get('/', (req, res) => {
    try {
        const users = userController.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }   
});

router.get('/bidder-requests', (req, res) => {
    try {
        const users = userController.getBidderRequests();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }   
});

router.post('/update-role', (req, res) => {
    try {
        const { id, role } = req.body;
        const updatedUser = userController.updateRole(id, role);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }   
});

export default router;