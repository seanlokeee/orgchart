import Employee from './Employee'

export default class OrgChart {
    private _root: Employee | null;
    private _employees: Map<string, Employee>; //including root

    constructor() {
        this._root = null;
        this._employees = new Map<string, Employee>();
    }

    set root(value: Employee | null) {
        this._root = value;
    }

    set employees(value: Map<string, Employee>) {
        this._employees = value;
    }

    get root(): Employee | null {
        return this._root
    }

    get employees(): Map<string, Employee> {
        return this._employees
    }

    getOrgChartEmployee(jobId: string): Employee {
        const employee = this._employees.get(jobId) || null;
        if (employee === null) {
            throw new Error(`In Memory Org Chart does not contain employee ${jobId}`);
        }
        return employee;
    }

    //Traverse through children tree to decrement levels
    updateChildrenLevelPriority(node: Employee) {
        if (!node) return;
        for (const child of node.children) {
            child.rolePriority--;
            child.jobLevel--;
            this.updateChildrenLevelPriority(child);
        }
    }

    // Pre-order DFS traversal (Node -> Left -> Right)
    logPreOrderDFS(node = this.root) {
        if (!node) return;
        for (const child of node.children) {
            console.log(`${child.jobId} belong to parent ${node.jobId}`)
            this.logPreOrderDFS(child);
        }
    }
}