import { Request, Response } from 'express';
import config from '../constants/global';

export function invalidHeaders(headers: string[], allowedHeaders: string[], res: Response) {
    const invalidHeaders = headers.filter(header => !allowedHeaders.includes(header));
    if (invalidHeaders.length > 0) {
        console.error(`Invalid headers: ${invalidHeaders.join(', ')}`);
        res.status(400).json({ error: `Invalid headers: ${invalidHeaders.join(', ')}` });
        return true;
    }
    return false;
}

export function transformedBody(req: Request) {
    const transformedBody: { [key: string]: any } = {};
    for (const key in req.body) {
        //safeguard to avoid __proto__: {inheritedProperty: "Should not be included"}
        if (req.body.hasOwnProperty(key)) {
            transformedBody[key.toLowerCase()] = req.body[key];
        }
    }
    return transformedBody;
}

export function checkEmpDetails(jobTitle: string, name: string, empId: string, email: string) {
    if (!isAlphabeticWithAllowedSpace(jobTitle)) {
        throw new Error('Job Title must only contain alphabets (upper or lower case)')
    }

    if (!isAlphabeticWithAllowedSpace(name)) {
        throw new Error('Employee Name must only contain alphabets (upper or lower case)')
    }

    if (empId !== null && !isValidEmpId(empId)) {
        throw new Error('Employee Id must be 1234 (start with a 1 and be 4 digits)')
    }

    if (email !== null && !isValidEmail(email)) {
        throw new Error('Must be a valid email abc@abc.com')
    }
}

export function checkJobIds(jobId: string, reportingToJobId: string, reportResign: string) {
    if (reportingToJobId !== null && !isValidJobId(reportingToJobId.toUpperCase())) {
        throw new Error(`If not null, ${reportResign} Job Id must be in ACC-1234 format (ACC-4digits)`)
    }

    if (jobId === reportingToJobId) {
        throw new Error(`Job Id and ${reportResign} Job Id cannot be the same`)
    }

    if (reportingToJobId !== null && !config.OrgChart.employees.has(reportingToJobId)) {
        throw new Error(`${reportResign} Job Id does not exist in current OrgChart`)
    }
}

export function isValidJobId(jobId: string): boolean {
    const regex = /^ACC-\d{4}$/;
    return regex.test(jobId);
}

export function isAlphabeticWithAllowedSpace(str: string): boolean {
    const regex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    return regex.test(str);
}

export function isValidEmpId(empId: string): boolean {
    const regex = /^1\d{3}$/;
    return regex.test(empId);
}

export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}