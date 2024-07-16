import { Router, Request, Response, NextFunction } from 'express';
import config from '../constants/global';
import { create } from '../service/create';
import { invalidHeaders, transformedBody } from '../constants/validation';

const createRouter = Router();

const allowedHeaders = [
    "job id",
    "job title",
    "employee name",
    "employee id",
    "email address",
    "reporting to job id"
];

const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
        console.error('Request body - JSON type')
        return res.status(400).json({ error: 'Request body - JSON type' });
    }

    const headers = Object.keys(req.body).map(header => header.toLowerCase());
    if (headers.length !== 6) {
        console.error(`Request body - ${allowedHeaders.join(', ')}`)
        return res.status(400).json({ error: `Request body - ${allowedHeaders.join(', ')}` });
    }

    if (invalidHeaders(headers, allowedHeaders, res)) {
        return;
    }
    req.body = transformedBody(req);
    next();
};

createRouter.post(config.routes.create, validateHeaders, (req: Request, res: Response) => {
    try {
        create(allowedHeaders, req.body);
        res.send(config.OrgChart.root);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
    }
});

export default createRouter;