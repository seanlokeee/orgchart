import { Router, Request, Response, NextFunction } from 'express';
import config from '../constants/global';
import { transformedBody } from '../constants/validation';
import { promote } from '../service/promote';

const promoteRouter = Router();

const allowedHeaders = [
    "job id",
    "reporting to job id"
];

const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
        console.error('Request body - JSON type')
        return res.status(400).json({ error: 'Request body - JSON type' });
    }

    const headers = Object.keys(req.body).map(header => header.toLowerCase());
    if (headers.length !== 2 || !headers.includes(allowedHeaders[0])
        || !headers.includes(allowedHeaders[1])) {
        console.error(`Request body - ${allowedHeaders.join(', ')}`)
        return res.status(400).json({ error: `Request body - ${allowedHeaders.join(', ')}` });
    }

    req.body = transformedBody(req);
    next();
};

promoteRouter.post(config.routes.promote, validateHeaders, (req: Request, res: Response) => {
    try {
        promote(allowedHeaders, req.body);
        res.send(config.OrgChart.root);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
    }
});

export default promoteRouter;