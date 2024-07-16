import config from '../constants/global';
import Employee from '../model/Employee';
import { checkJobIds } from '../constants/validation';

export function resign(allowedHeaders: string[], request: any, resignJobId: string) {
    const empToResign = config.OrgChart.employees.get(resignJobId) || null
    if (empToResign) {
        const replaceJobId = request[allowedHeaders[1]];
        if (empToResign.children.length === 0 && replaceJobId == null) { //end of section
            //no replacement needed to maintain tree structure
            remove(empToResign);
            return;
        }

        checkJobIds(resignJobId, replaceJobId, "Replacement");
        if (replaceJobId === null) {
            throw new Error('Replacement Job Id must be an existing Employee');
        }
        const empToReplace = config.OrgChart.getOrgChartEmployee(replaceJobId);
        if ((empToReplace.jobLevel - empToResign.jobLevel) === 1) {
            let isReplaceChildOfResign = empToResign.children.findIndex(c => c.jobId === empToReplace.jobId) !== -1
            if (isReplaceChildOfResign) {
                removeReplace(empToResign, empToReplace, isReplaceChildOfResign);
            } else {
                throw new Error(`Replacement ${empToReplace.jobId} must be a child of resigning ${empToResign.jobId}`);
            }
        } else {
            throw new Error(`Invalid replacement child ${empToReplace.jobId} due to tree structure levelling`);
        }
    } else {
        throw new Error(`Employee ${resignJobId} does not exist`);
    }
    //isRoot, rolePriority, jobLevel, reporting to (name) and children filled behind the scenes
}

function remove(empToResign: Employee) {
    if (empToResign.isRoot) {
        config.OrgChart.root = null;
    } else {
        const parentId = empToResign.reportingToJobId || '';
        const parent = config.OrgChart.getOrgChartEmployee(parentId);

        const empToResignIndex = parent.children.findIndex(c => c.jobId === empToResign.jobId);
        parent.children.splice(empToResignIndex, 1); // emp has resigned
    }
    config.OrgChart.employees.delete(empToResign.jobId);
}

function removeReplace(empToResign: Employee, empToReplace: Employee, isReplaceChildOfResign: boolean) {
    config.OrgChart.updateChildrenLevelPriority(empToReplace);
    empToResign.children.forEach((empToResignChild) => {
        if (empToResignChild.jobId !== empToReplace.jobId) {
            empToResignChild.reportingTo = empToReplace.name;
            empToResignChild.reportingToJobId = empToReplace.jobId;
            empToReplace.children.push(empToResignChild);
        }
    }); //emp to resign children report to replacement employee

    if (empToResign.isRoot) {
        empToReplace.isRoot = true;
        empToReplace.rolePriority = 1;
        empToReplace.jobLevel = 1;
        empToReplace.reportingTo = null;
        empToReplace.reportingTo = null;
        config.OrgChart.root = empToReplace;
    } else {
        const resignParentId = empToResign.reportingToJobId || '';
        const resignParent = config.OrgChart.getOrgChartEmployee(resignParentId);

        empToReplace.rolePriority--;
        empToReplace.jobLevel--;
        empToReplace.reportingTo = resignParent.name;
        empToReplace.reportingToJobId = resignParent.jobId;

        const empToResignIndex = resignParent.children.findIndex(c => c.jobId === empToResign.jobId);
        resignParent.children.splice(empToResignIndex, 1); // emp has resigned
        resignParent.children.push(empToReplace); // replace emp report to resign parent
    }
    config.OrgChart.employees.delete(empToResign.jobId);
}