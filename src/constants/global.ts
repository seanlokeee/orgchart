import path from 'path';
import OrgChart from '../model/OrgChart';

const config = {
    routes: {
        home: '/',
        upload: '/upload',
        orgchart: '/orgchart',
        create: '/create',
        update: '/update', //existing simple emp details
        promote: '/promote',
        resign: '/resign'
    },
    uploadPath: path.join(__dirname, '../../upload'),
    OrgChart: new OrgChart() //in memory
};

export default config;