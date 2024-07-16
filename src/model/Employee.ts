export default class Employee {
    private _jobId: string
    private _jobTitle: string
    private _name: string
    private _empId: number
    private _email: string
    private _reportingToJobId: string | null
    private _reportingTo: string | null
    private _rolePriority: number
    private _jobLevel: number
    private _isRoot: boolean
    private _children: Employee[]

    constructor(
        jobId: string,
        jobTitle: string,
        name: string,
        empId: number,
        email: string,
        reportingToJobId: string | null,
        reportingTo: string | null,
        rolePriority: number,
        jobLevel: number,
        isRoot: boolean
    ) {
        this._jobId = jobId;
        this._jobTitle = jobTitle;
        this._name = name;
        this._empId = empId;
        this._email = email;
        this._reportingToJobId = reportingToJobId;
        this._reportingTo = reportingTo;
        this._rolePriority = rolePriority;
        this._jobLevel = jobLevel;
        this._isRoot = isRoot;
        this._children = [];
    }

    addChild(child: Employee) {
        this._children.push(child);
    }

    get jobId(): string {
        return this._jobId;
    }

    get jobTitle(): string {
        return this._jobTitle;
    }

    get name(): string {
        return this._name;
    }

    get empId(): number {
        return this._empId;
    }

    get email(): string {
        return this._email;
    }

    get reportingToJobId(): string | null {
        return this._reportingToJobId;
    }

    get reportingTo(): string | null {
        return this._reportingTo;
    }

    get rolePriority(): number {
        return this._rolePriority;
    }

    get jobLevel(): number {
        return this._jobLevel;
    }

    get isRoot(): boolean {
        return this._isRoot;
    }

    get children(): Employee[] {
        return this._children;
    }

    set jobId(jobId: string) {
        this._jobId = jobId;
    }

    set jobTitle(jobTitle: string) {
        this._jobTitle = jobTitle;
    }

    set name(name: string) {
        this._name = name;
    }

    set empId(empId: number) {
        this._empId = empId;
    }

    set email(email: string) {
        this._email = email;
    }

    set reportingToJobId(reportingToJobId: string | null) {
        this._reportingToJobId = reportingToJobId;
    }

    set reportingTo(reportingTo: string | null) {
        this._reportingTo = reportingTo;
    }

    set rolePriority(rolePriority: number) {
        this._rolePriority = rolePriority;
    }

    set jobLevel(jobLevel: number) {
        this._jobLevel = jobLevel;
    }

    set isRoot(isRoot: boolean) {
        this._isRoot = isRoot;
    }

    set children(children: Employee[]) {
        this._children = children;
    }
}