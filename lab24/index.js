const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

let webdav;
import('webdav').then(module => {
    webdav = module;
}).catch(err => {
    console.error('Failed to import webdav:', err);
    process.exit(1);
});

const url = 'https://webdav.yandex.ru';
const username = 'berserkiss';
const password = 'kyrrrngjlvtjudio';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 3000;

let client;
(async function() {
    try {
        const { createClient } = await import('webdav');
        client = createClient(url, {
            username: username,
            password: password
        });
        console.log('WebDAV client initialized');
    } catch (err) {
        console.error('Error initializing WebDAV client:', err);
        process.exit(1);
    }
})();

app.use(async (req, res, next) => {
    if (!client) {
        return res.status(503).send('Service Unavailable: WebDAV client not initialized');
    }
    next();
});

app.post('/md/:dirname', async (req, res) => {
    const dirname = req.params.dirname;
    
    try {
        const exists = await client.exists(`/${dirname}`);
        if (exists) {
            return res.status(408).send('Directory already exists');
        }
        
        await client.createDirectory(`/${dirname}`);
        res.status(200).send(`Directory ${dirname} created successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating directory');
    }
});

app.post('/rd/:dirname', async (req, res) => {
    const dirname = req.params.dirname;
    
    try {
        const exists = await client.exists(`/${dirname}`);
        if (!exists) {
            return res.status(408).send('Directory does not exist');
        }
        
        const isDir = await client.stat(`/${dirname}`).then(stat => stat.type === 'directory');
        if (!isDir) {
            return res.status(408).send('Path is not a directory');
        }
        
        await client.deleteFile(`/${dirname}`);
        res.status(200).send(`Directory ${dirname} removed successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing directory');
    }
});

app.post('/up/:filename', upload.single('file'), async (req, res) => {
    const filename = req.params.filename;
    
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    
    try {
        await client.putFileContents(`./${filename}`, req.file.buffer, { overwrite: true });
        res.status(200).send(`File ${filename} uploaded successfully`);
    } catch (err) {
        console.error(err);
        res.status(408).send('Error uploading file');
    }
});

app.post('/down/:filename', async (req, res) => {
    const filename = req.params.filename;
    const localPath = path.join(__dirname, filename);
    
    try {
        const exists = await client.exists(`/${filename}`);
        if (!exists) {
            return res.status(404).send('File not found');
        }
        
        const isFile = await client.stat(`/${filename}`).then(stat => stat.type === 'file');
        if (!isFile) {
            return res.status(404).send('Path is not a file');
        }
        
        const fileContents = await client.getFileContents(`/${filename}`, { format: 'binary' });
        
        fs.writeFileSync(localPath, fileContents);
        
        res.status(200).send(`File ${filename} downloaded and saved to ${localPath}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error downloading file');
    }
});

app.post('/del/:filename', async (req, res) => {
    const filename = req.params.filename;
    
    try {
        const exists = await client.exists(`/${filename}`);
        if (!exists) {
            return res.status(404).send('File not found');
        }
        
        const isFile = await client.stat(`/${filename}`).then(stat => stat.type === 'file');
        if (!isFile) {
            return res.status(404).send('Path is not a file');
        }
        
        await client.deleteFile(`/${filename}`);
        res.status(200).send(`File ${filename} deleted successfully`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting file');
    }
});

app.post('/copy/:source/:targetDir', async (req, res) => {
    const source = req.params.source;
    const targetDir = req.params.targetDir;
    
    try {
        const sourceExists = await client.exists(`/${source}`);
        if (!sourceExists) {
            return res.status(404).send('Source file not found');
        }

        const sourceStat = await client.stat(`/${source}`);
        if (sourceStat.type !== 'file') {
            return res.status(404).send('Source path is not a file');
        }

        const targetDirExists = await client.exists(`/${targetDir}`);
        if (!targetDirExists) {
            return res.status(404).send('Target directory not found');
        }

        const targetDirStat = await client.stat(`/${targetDir}`);
        if (targetDirStat.type !== 'directory') {
            return res.status(404).send('Target path is not a directory');
        }

        const sourceFileName = source.split('/').pop();
        
        await client.copyFile(`/${source}`, `/${targetDir}/${sourceFileName}`);
        
        res.status(200).send(`File ${source} copied to directory ${targetDir} successfully`);
    } catch (err) {
        console.error(err);
        res.status(408).send('Error copying file to directory');
    }
});

app.post('/move/:source/:targetDir', async (req, res) => {
    const source = req.params.source;
    const targetDir = req.params.targetDir;
    
    try {
        const sourceExists = await client.exists(`/${source}`);
        if (!sourceExists) {
            return res.status(404).send('Source file not found');
        }

        const sourceStat = await client.stat(`/${source}`);
        if (sourceStat.type !== 'file') {
            return res.status(404).send('Source path is not a file');
        }

        const targetDirExists = await client.exists(`/${targetDir}`);
        if (!targetDirExists) {
            return res.status(404).send('Target directory not found');
        }

        const targetDirStat = await client.stat(`/${targetDir}`);
        if (targetDirStat.type !== 'directory') {
            return res.status(404).send('Target path is not a directory');
        }

        const sourceFileName = source.split('/').pop();
        
        await client.moveFile(`/${source}`, `/${targetDir}/${sourceFileName}`);
        
        res.status(200).send(`File ${source} moved to directory ${targetDir} successfully`);
    } catch (err) {
        console.error(err);
        res.status(408).send('Error moving file to directory');
    }
});

// app.post('/copy/:source/:target', async (req, res) => {
//     const source = req.params.source;
//     const target = req.params.target;
    
//     try {
//         const exists = await client.exists(`/${source}`);
//         if (!exists) {
//             return res.status(404).send('Source file not found');
//         }
        
//         const isFile = await client.stat(`/${source}`).then(stat => stat.type === 'file');
//         if (!isFile) {
//             return res.status(404).send('Source path is not a file');
//         }
        
//         await client.copyFile(`/${source}`, `/${target}`);
//         res.status(200).send(`File ${source} copied to ${target} successfully`);
//     } catch (err) {
//         console.error(err);
//         res.status(408).send('Error copying file');
//     }
// });

// app.post('/move/:source/:target', async (req, res) => {
//     const source = req.params.source;
//     const target = req.params.target;
    
//     try {
//         const exists = await client.exists(`/${source}`);
//         if (!exists) {
//             return res.status(404).send('Source file not found');
//         }
        
//         const isFile = await client.stat(`/${source}`).then(stat => stat.type === 'file');
//         if (!isFile) {
//             return res.status(404).send('Source path is not a file');
//         }
        
//         await client.moveFile(`/${source}`, `/${target}`);
//         res.status(200).send(`File ${source} moved to ${target} successfully`);
//     } catch (err) {
//         console.error(err);
//         res.status(408).send('Error moving file');
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});