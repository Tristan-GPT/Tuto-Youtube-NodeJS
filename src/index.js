import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import Cat from './routes/Cat.js';
import Test from './routes/Test.js';
import Account from './routes/Account.js';
import Auth from './routes/Auth.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { createConnection } from 'mysql2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env') });

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'expresstuto'
});

db.connect(function (err) {
    if(err) throw err;

    console.log(`Database connected.`)
})

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5500',
    credentials: true
}));

app.use('/cat', Cat)
app.use('/test', Test)
app.use('/account', Account)
app.use('/auth', Auth)

const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {

    res.status(200).json({ message: "success", success: true })

})

app.listen(PORT, () => {

    console.log(`API listen on port ${PORT}`)

});

export {
    db
}