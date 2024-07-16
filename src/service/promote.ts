import config from '../constants/global';
import Employee from '../model/Employee';
import { checkJobIds } from '../constants/validation';

export function promote(allowedHeaders: string[], request: any) {
    const jobId = request[allowedHeaders[0]];
    const empToPromote = config.OrgChart.employees.get(jobId) || null
    if (empToPromote) {
        if (empToPromote.isRoot) {
            throw new Error(`Employee ${empToPromote.jobId} is already the root`);
        }
        let newReportingToJobId = request[allowedHeaders[1]];
        checkJobIds(jobId, newReportingToJobId, "Reporting");
        if (newReportingToJobId === null) { //report to root
            newReportingToJobId = config.OrgChart.root?.jobId;
        }
        if (newReportingToJobId === empToPromote.reportingToJobId) {
            throw new Error(`Employee ${empToPromote.jobId} is already reporting to ${empToPromote.reportingToJobId}`);
        }

        const newReport = config.OrgChart.getOrgChartEmployee(newReportingToJobId);
        if (newReport.jobLevel < empToPromote.jobLevel) { //promote
            console.log(`Promoting ${empToPromote.jobId} to report to ${newReportingToJobId}`);
            promoteEmp(empToPromote, newReport);
        } else {
            throw new Error(`Reporting to Job Id must be a higher ranking employee`)
        }
    } else {
        throw new Error(`Employee ${jobId} does not exist`);
    }
    //isRoot, rolePriority, jobLevel, reporting to (name) and children filled behind the scenes
}

function promoteEmp(empToPromote: Employee, newReport: Employee) {
    const currParentJobId = empToPromote.reportingToJobId || '';
    const currParent = config.OrgChart.getOrgChartEmployee(currParentJobId);
    config.OrgChart.updateChildrenLevelPriority(empToPromote);

    const empToPromoteIndex = currParent.children.findIndex(c => c.jobId === empToPromote.jobId);
    currParent.children.splice(empToPromoteIndex, 1); // emp to promote no longer reports to parent
    newReport.children.push(empToPromote);

    updateRank(empToPromote, newReport);
}

function updateRank(empToRank: Employee, newReport: Employee) {
    empToRank.reportingToJobId = newReport.jobId
    empToRank.reportingTo = newReport.name
    empToRank.rolePriority--;
    empToRank.jobLevel--;
}