export const loggedin = (req, res, next) => {
    // Kiểm tra nếu phiên đã được thiết lập
    if (req.session && req.session.loggedin) {
        // Nếu đã đăng nhập, thiết lập res.locals.user và tiếp tục
        // console.log('req.session', req.session);
        res.locals.user = req.session.user;
        next();
    } else if (req.isAuthenticated()) {
        // Nếu đăng nhập, thiết lập res.locals.user và tiếp tục
        // console.log('req.user', req.user);
        res.locals.user = req.user;
        next();
    } else {
        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        res.redirect('/login');
        // const conflictError = '';
        // res.render('login.ejs');
    }
};

export const isAuth = (req, res, next) => {
    if (req.session && req.session.loggedin) {
        res.locals.user = req.session.user;
        res.redirect('/manage-system/dashboard');
    } else if (req.isAuthenticated()) {
        res.locals.user = req.user;
        res.redirect('/manage-system/dashboard');
    } else {
        next();
    }
};
