import bcrypt from 'bcryptjs';
import db from '../../models/index';
import auth from '../../config/firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

let handleRegisterAdmin = async (req, res) => {
    let { account, password } = req.body;
    console.log('account: ', account, 'password: ', password);
    if (!account || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
        });
    }
};
let handleLoginAdmin = async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = req.body;
        // const user = validateUser(username, password);
        console.log('email: ', email, 'password: ', password);
        try {
            let response = await signInWithEmailAndPassword(auth, email, password);
            console.log('response: ', response);
            res.status(200).json({ success: true, message: 'OK' });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Lỗi đăng nhập errorCode: ', errorCode);
            console.error('Lỗi đăng nhập errorMessage: ', errorMessage);
            if (errorCode === 'auth/invalid-credential') {
                res.status(401).send('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
            } else if (errorCode === 'auth/too-many-requests') {
                res.status(401).send(
                    'Số lần đăng nhập không thành công của bạn đã vượt quá giới hạn. Vui lòng thử lại sau.',
                );
            } else {
                res.status(500).send('Lỗi xác thực. Vui lòng thử lại sau');
            }
        }
    });
};
exports.login = async (req, res) => {
    const { account, password } = req.body;

    if (account && password) {
        if (account == '' || password == '') {
            const conflictError = '';
            res.render('auth/login.ejs', { account, password, conflictError, messageFromSignUp: '' });
        }
        let isExist = await checkUserAccount(account);
        if (!isExist) {
            // res.redirect('/login');
            const conflictError = 'User does not exist';
            res.render('auth/login.ejs', { account, password, conflictError, messageFromSignUp: '' });
        } else {
            let user = await db.User.findOne({
                attributes: ['id', 'account', 'password', 'role', 'is2FAEnabled', 'secret'],
                where: { account: account },
                raw: true,
            });
            console.log('user: ', user);
            if (user && user.role === 'User') {
                const conflictError = 'This page is for administrators only';
                res.render('auth/login.ejs', { account, password, conflictError, messageFromSignUp: '' });
            }
            if (user && user.role === 'Admin') {
                let check = await bcrypt.compare(password, user.password);
                if (check) {
                    // 2FA
                    // res.redirect('/auth/2fa');
                    if (user.is2FAEnabled) {
                        res.redirect(`/auth/enable-2fa?userId=${user.id}`);
                    } else {
                        req.session.loggedin = true;
                        // user = {
                        //     password: '',
                        //     ...user,
                        // }
                        delete user.password;
                        req.session.user = user;
                        res.redirect('/manage-system/dashboard');
                        // console.log('req.session: ', req.session);
                    }
                } else {
                    const conflictError = 'Incorrect password';
                    res.render('auth/login.ejs', { account, password, conflictError, messageFromSignUp: '' });
                }
            }
        }
    } else {
        // A user with that account address does not exists
        const conflictError = '';
        res.render('auth/login.ejs', { account, password, conflictError, messageFromSignUp: '' });
    }
};
let checkUserAccount = (userAccount) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { account: userAccount },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error logging out:', err);
            res.redirect('/500'); // Điều hướng đến trang lỗi nếu có lỗi xảy ra
            return;
        }

        // Sau khi đăng xuất thành công từ cấu trúc phiên của Express,
        // tiến hành xóa phiên làm việc của người dùng từ cấu trúc phiên của Google OAuth
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.redirect('/500'); // Điều hướng đến trang lỗi nếu có lỗi xảy ra
                return;
            }
            // Điều hướng đến trang đăng nhập sau khi đăng xuất thành công
            // res.redirect('https://accounts.google.com/logout');
            res.redirect('/login');
        });
        console.log('Logged out successfully');
    });
};
export default {
    handleRegisterAdmin,
    handleLoginAdmin,
};
