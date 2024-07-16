import { Router, Request, Response } from 'express';
import config from '../constants/global'

const getRouter = Router();

getRouter.get(config.routes.home, (req: Request, res: Response) => {
    res.send('Welcome to Accendo! View Github README for endpoints');
});

getRouter.get(config.routes.orgchart, async (req: Request, res: Response) => {
    if (!config.OrgChart.root) {
        console.error('Org-Chart is empty. POST /upload a CSV file or /create a new Employee');
        return res.status(404).json({ error: 'Org-Chart is empty. POST /upload a CSV file or /create a new Employee' });
    }
    console.log(`Root: ${config.OrgChart.root.jobId} (Left -> Right)`)
    config.OrgChart.logPreOrderDFS()
    console.log(`Number of Employees: ${config.OrgChart.employees.size}`)
    res.send(config.OrgChart.root)
});

export default getRouter;