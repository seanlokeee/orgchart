import config from '../constants/global';
import Employee from '../model/Employee';
import { checkEmpDetails } from '../constants/validation';

export function update(allowedHeaders: string[], request: any) {
    const jobId = request[allowedHeaders[0]];
    const existingEmp = config.OrgChart.employees.get(jobId) || null
    if (existingEmp) {
        const jobTitle = request[allowedHeaders[1]] || null;
        const name = request[allowedHeaders[2]] || null;

        const empId = request[allowedHeaders[3]] || null;
        const email = request[allowedHeaders[4]] || null;

        checkEmpDetails(jobTitle, name, empId, email);
        updateEmpDetails(existingEmp, jobTitle, name, empId, email);
    } else {
        throw new Error(`Employee ${jobId} does not exist`);
    }
}

function updateEmpDetails(existingEmp: Employee, jobTitle: string, name: string, empId: string, email: string) {
    console.log(`Updating existing Employee Details ${existingEmp.jobId}`)
    if (jobTitle !== null) {
        existingEmp.jobTitle = jobTitle;
    }
    if (name !== null) {
        existingEmp.name = name;
        existingEmp.children.forEach((child) => child.reportingTo = name);
    }
    if (empId !== null) {
        existingEmp.empId = parseInt(empId);
    }
    if (email !== null) {
        existingEmp.email = email;
    }
}