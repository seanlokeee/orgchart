import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import Employee from '../model/Employee';
import config from '../constants/global'

export async function checkForCSVInUploadDir(filePath: string): Promise<string> {
    try {
        await fs.promises.access(filePath) //read permissions
        const files = await fs.promises.readdir(filePath);
        const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
        if (csvFiles.length === 0) {
            throw new Error(`Directory ${filePath} does not contain any CSV files. POST /upload a CSV file`);
        }
        console.log(`Directory ${filePath} contains ` + csvFiles[0])
        return csvFiles[0]
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error(`Error while checking for csv file in upload's directory`);
    }
}

export async function readCsvFile(filePath: string) {
    try {
        await fs.promises.access(filePath) //read permissions
        const readStream = await removeBOM(filePath);
        const parser = await readStream.pipe(parse({ delimiter: ',', columns: true, trim: true }));
        config.OrgChart.root = null;
        config.OrgChart.employees.clear();

        parser.on('readable', () => {
            let record;
            while ((record = parser.read()) !== null) {
                const jobId = record["Job Id"].toUpperCase();
                const jobTitle = record["Job Title"];
                const name = record["Employee Name"];
                const empId = parseInt(record["Employee ID"]);
                const email = record["Email Address"];
                const reportingToJobId = record["Reporting To Job Id"].toUpperCase() || null;
                const reportingTo = record["Reporting to"] || null;
                const rolePriority = parseInt(record["Role Priority"]);
                const jobLevel = parseInt(record["Job Level"]);
                const isRoot = record["Is Root? (input yes for root role only)"] === "yes";

                config.OrgChart.employees.set(jobId, new Employee(
                    jobId,
                    jobTitle,
                    name,
                    empId,
                    email,
                    reportingToJobId,
                    reportingTo,
                    rolePriority,
                    jobLevel,
                    isRoot
                ));
            }
        });
        await finished(parser);
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error(`Error while reading csv file`);
    }
}

//CSV is saved with UTF-8 BOM (Byte Order Mark), causing first column (jobId) undefined values
async function removeBOM(filePath: string) {
    let fileContent = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
    if (fileContent.charCodeAt(0) === 0xFEFF) {// Remove BOM if present
        fileContent = fileContent.substring(1);
    }
    // Create a Readable stream from the cleaned content
    const readableStream = new (require('stream').Readable)();
    readableStream.push(fileContent);
    readableStream.push(null);
    return readableStream;
};