import express from 'express';
import bodyParser from 'body-parser';
import uploadRouter from './routes/upload';
import getRouter from './routes/get';
import createRouter from './routes/create';
import updateRouter from './routes/update';
import promoteRouter from './routes/promote';
import resignRouter from './routes/resign';

const app = express();
const port = 6060;

app.use(bodyParser.json()); //parse JSON requests
app.use(uploadRouter)
app.use(getRouter)
app.use(createRouter)
app.use(updateRouter)
app.use(promoteRouter)
app.use(resignRouter)

app.listen(port, () => {
    console.log('Welcome to Accendo! View Github README for endpoints')
    console.log(`Server is running on port ${port}`);
});

export default app;