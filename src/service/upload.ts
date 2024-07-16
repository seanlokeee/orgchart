import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { checkForCSVInUploadDir, readCsvFile } from '../service/csv';
import config from '../constants/global'

export async function overwriteUploadDir(uploadPath: string) {
    try {
        await fs.promises.mkdir(uploadPath, { recursive: true })
        const files = await fs.promises.readdir(uploadPath);

        for (const file of files) {
            const filePath = path.join(uploadPath, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isFile()) {
                await fs.promises.unlink(filePath);
                console.log(`Deleted file: ${file}`);
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error(`Error while overwriting upload directory`);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 /* 10MB */ },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            cb(new Error('Only CSV files are allowed!'));
        }
        cb(null, true);
    }
}).single('Org-Chart') //Single file request key name

export async function buildInMemoryOrgChart(uploadPath: string) {
    const csvFile = await checkForCSVInUploadDir(uploadPath);
    await readCsvFile(uploadPath + "/" + csvFile)
    config.OrgChart.employees.forEach(emp => {
        if (emp.reportingToJobId) {
            const parent = config.OrgChart.employees.get(emp.reportingToJobId);
            if (parent) {
                parent.children.push(emp);
                console.log(`${emp.jobId} added to parent ${parent.jobId}`)
            }
        }

        if (emp.isRoot) {
            config.OrgChart.root = emp
            console.log(`Root: ${emp.jobId}`)
        }
    })
}