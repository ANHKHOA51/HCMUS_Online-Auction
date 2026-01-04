import express from 'express';
import UserModel from '../models/user.model.js';
import { sendResetPasswordMail } from '../utils/mail.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/bidder-requests', async (req, res) => {
    try {
        const users = await UserModel.getBidderRequests();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/update-role', async (req, res) => {
    try {
        const { id, role } = req.body;
        const updatedUser = await UserModel.updateRole(id, role);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/accept-upgrade', async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.acceptUpgrade(id);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/reject-upgrade', async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.rejectUpgrade(id);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { id } = req.body;
        const updatedUser = await UserModel.resetPassword(id);
        sendResetPasswordMail(updatedUser.email, updatedUser.password_hash);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await UserModel.deleteUser(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;