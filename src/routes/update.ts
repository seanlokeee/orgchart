import { Router, Request, Response, NextFunction } from 'express';
import config from '../constants/global';
import { update } from '../service/update';
import { invalidHeaders, transformedBody } from '../constants/validation';

const updateRouter = Router();

const allowedHeaders = [
    "job id",
    "job title",
    "employee name",
    "employee id",
    "email address"
];

const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
        console.error('Request body - JSON type')
        return res.status(400).json({ error: 'Request body - JSON type' });
    }

    const headers = Object.keys(req.body).map(header => header.toLowerCase());
    if (headers.length < 2 || !headers.includes(allowedHeaders[0])) {
        console.error(`Request body - ${allowedHeaders[0]} and at least one valid header`)
        return res.status(400).json({ error: `Request body - ${allowedHeaders[0]} and at least one valid header` });
    }

    if (invalidHeaders(headers, allowedHeaders, res)) {
        return;
    }
    req.body = transformedBody(req);
    next();
};

updateRouter.post(config.routes.update, validateHeaders, (req: Request, res: Response) => {
    try {
        update(allowedHeaders, req.body);
        res.send(config.OrgChart.root);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
    }
});

export default updateRouter;