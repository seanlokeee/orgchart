import { Router, Request, Response } from 'express';
import config from '../constants/global';
import { upload, overwriteUploadDir, buildInMemoryOrgChart } from '../service/upload'

const uploadRouter = Router();

uploadRouter.post(config.routes.upload, async (req: Request, res: Response) => {
    try {
        await overwriteUploadDir(config.uploadPath)
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
    }

    upload(req, res, async function (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error('Upload Failed');
            return res.status(500).json({ error: 'Upload Failed' });
        }

        if (!req.file) {
            console.error('Request must contain a file');
            return res.status(400).json({ error: 'Request must contain a file' });
        }

        try {
            await buildInMemoryOrgChart(config.uploadPath)
            console.log(`Number of Employees: ${config.OrgChart.employees.size}`)
            res.send(config.OrgChart.root)
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                return res.status(404).json({ error: err.message });
            }
        }
    })
});

export default uploadRouter;