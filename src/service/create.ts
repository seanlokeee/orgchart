import config from '../constants/global';
import Employee from '../model/Employee';
import { checkJobIds, checkEmpDetails } from '../constants/validation';

export function create(allowedHeaders: string[], request: any) {
    const jobId = request[allowedHeaders[0]];
    const existingEmp = config.OrgChart.employees.get(jobId) || null
    if (existingEmp === null) {
        const reportingToJobId = request[allowedHeaders[5]];
        checkJobIds(jobId, reportingToJobId, "Reporting");

        const jobTitle = request[allowedHeaders[1]] || null;
        const name = request[allowedHeaders[2]] || null;

        const empId = request[allowedHeaders[3]] || null;
        const email = request[allowedHeaders[4]] || null;

        checkEmpDetails(jobTitle, name, empId, email);
        createNewEmp(jobId, jobTitle, name, empId, email, reportingToJobId);
    } else {
        throw new Error(`Employee ${existingEmp.jobId} is in Org Chart`);
    }
    //isRoot, rolePriority, jobLevel, reporting to (name) and children filled behind the scenes
}

function createNewEmp(jobId: string, jobTitle: string, name: string, empId: number, email: string, reportingToJobId: string) {
    if (jobTitle !== null && name !== null && empId !== null && email !== null) {
        console.log(`Creating New Employee ${jobId}, Reporting to Job Id ${reportingToJobId}`)
        if (reportingToJobId === null) {
            createNewRoot(jobId, jobTitle, name, empId, email);
        } else {
            const parent = config.OrgChart.getOrgChartEmployee(reportingToJobId);
            const newEmp = new Employee(jobId, jobTitle, name, empId, email, reportingToJobId,
                parent.name, parent.rolePriority, parent.jobLevel, false);
            newEmp.rolePriority++;
            newEmp.jobLevel++;
            parent.children.push(newEmp);
            config.OrgChart.employees.set(jobId, newEmp);
        }
    } else {
        throw new Error('To create new employee: job title, employee name, employee id and email address must contain valid values')
    }
}

function createNewRoot(jobId: string, jobTitle: string, name: string, empId: number, email: string) {
    const newRoot = new Employee(jobId, jobTitle, name, empId, email, null,
        null, 1, 1, true);
    if (config.OrgChart.root !== null) {
        config.OrgChart.root.children.forEach((rootChild) => {
            rootChild.reportingTo = newRoot.name;
            rootChild.reportingToJobId = newRoot.jobId;
            newRoot.children.push(rootChild);
        });
        config.OrgChart.employees.delete(config.OrgChart.root.jobId);
    }
    config.OrgChart.root = newRoot
    config.OrgChart.employees.set(jobId, config.OrgChart.root);
}