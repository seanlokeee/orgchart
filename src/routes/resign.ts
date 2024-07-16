import { Router, Request, Response, NextFunction } from 'express';
import config from '../constants/global';
import { transformedBody, isValidJobId } from '../constants/validation';
import { resign } from '../service/resign';

const resignRouter = Router();

const allowedHeaders = [
    "job id",
    "replacement job id"
];

const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
    if (!req.is('application/json')) {
        console.error('Request body - JSON type')
        return res.status(400).json({ error: 'Request body - JSON type' });
    }

    const headers = Object.keys(req.body).map(header => header.toLowerCase());
    if ((headers.length === 1 && !headers.includes(allowedHeaders[0])) ||
        (headers.length === 2 && (!headers.includes(allowedHeaders[0]) ||
            !headers.includes(allowedHeaders[1])))) {
        console.error(`Request body - ${allowedHeaders.join(', ')}`)
        return res.status(400).json({ error: `Request body - ${allowedHeaders.join(', ')}` });
    }

    req.body = transformedBody(req);
    next();
};

resignRouter.post(config.routes.resign, validateHeaders, (req: Request, res: Response) => {
    try {
        const replaceJobId = req.body[allowedHeaders[0]];
        if (replaceJobId == null || !isValidJobId(replaceJobId)) {
            throw new Error('Job Id must be in ACC-1234 format (ACC-4digits)')
        }
        resign(allowedHeaders, req.body, replaceJobId);
        res.send(config.OrgChart.root);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
    }
});

export default resignRouter;