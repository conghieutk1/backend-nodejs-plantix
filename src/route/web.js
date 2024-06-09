import express from 'express';
import authController from '../controllers/auth/authController';
// import authMiddleware from '../middleware/auth.mjs';
import passport from 'passport';

const router = express.Router();

const initWebRoutes = (app) => {
    // Các routes ở đây
    router.get('/', (req, res) => {
        res.send('OK');
    });

    router.post('/auth/resgister', authController.handleRegisterAdmin);

    // user
    router.post('/auth/login', authController.handleLoginAdmin);
    router.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Logout failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out' });
        });
    });
    // disease

    // history

    // server-side

    // api

    // android

    // aws

    // Google login
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/manage-system/dashboard');
    });
    router.get('/profile', (req, res) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        // console.log('req: ', req);
        res.send(`Hello, ${req.user.displayName}`);
    });

    // 2FA
    router.post('/auth/enable-2fa', (req, res) => {});

    return app.use('/', router);
};

export default initWebRoutes;
