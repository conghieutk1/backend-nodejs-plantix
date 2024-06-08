import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine.js'; // Đảm bảo đường dẫn tới viewEngine.js là đúng và bao gồm phần mở rộng .js
import initWebRoutes from './route/web.js'; // Đảm bảo đường dẫn tới web.js là đúng và bao gồm phần mở rộng .js
import connectDB from './config/conectDB.js'; // Đảm bảo đường dẫn tới connectDB.js là đúng và bao gồm phần mở rộng .js
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Sử dụng destructuring để import Strategy
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv'; // Đảm bảo cú pháp import cho dotenv
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config(); // Sử dụng cú pháp import cho dotenv

let app = express();

// Cấu hình Passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CREDENTIAL_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CREDENTIAL_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
            // Ở đây bạn có thể lưu thông tin user vào database nếu cần
            // console.log('profile: ', profile);
            // console.log('accessToken: ', accessToken);
            // console.log('refreshToken: ', refreshToken);
            return cb(null, profile);
        },
    ),
);
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 30 * 1000, // Thời gian hết hạn cookie là 10 phút
            // secure: true, //  Cookie sẽ chỉ được gửi qua các kết nối HTTPS(not HTTP)
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());
// Cấu hình CORS
app.use(cors({ origin: true }));

// Cấu hình body parser với giới hạn kích thước yêu cầu lớn
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Phục vụ các file tĩnh từ thư mục 'public'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

app.use(express.static(__dirname + '/public'));

// Khởi tạo view engine
viewEngine(app);

// Đặt middleware tại đây (ví dụ middleware log request)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// Khởi tạo các route
initWebRoutes(app);

// Kết nối cơ sở dữ liệu
connectDB();

let port = process.env.PORT || 8888; //Port === undefined => Port = 8888

// Bắt đầu server
app.listen(port, () => {
    //callback
    console.log('Backend Nodejs is running on the port: ' + port);
    console.log('Local: http://localhost:' + port);
});

// npm i nodemon
// npm install --save-dev @babel/cli @babel/core @babel/preset-env
