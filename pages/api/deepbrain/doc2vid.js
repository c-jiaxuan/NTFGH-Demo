import { deepbrain_KEYS } from '../../../public/js/env/deepbrain-keys.js'
import { deepbrain_config } from '../../../public/js/config/deepbrain-config.js'
import axios from "axios";
import fs from "fs";
import formidable from 'formidable';
import FormData from "form-data";
import path from 'path'

export const config = {
    api: {
        bodyParser: false, // Required for formidable
    },
};

const API_HOST = 'https://app.aistudios.com'
const GET_TOKEN_API_PATH = '/api/odin/v3/auth/token'
const FILE_UPLOAD_API_PATH = '/api/odin/v3/automation/docs-to-video/upload-files'
const CREATE_API_PATH = '/api/odin/v3/automation/docs-to-video'
const CREATE_PROGRESS_API_PATH = '/api/odin/v3/automation/progress'
const EXPORT_API_PATH = '/api/odin/v3/editor/project/export'
const EXPORT_PROGRESS_API_PATH = '/api/odin/v3/editor/progress'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Main Handler
export default async function deepbrain_doc2Vid(req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }

        try {
            console.log('[doc2vid] files: ' + JSON.stringify(files));
            const file = files.files[0]; // ✅ Get the first file
            const filePath = file.filepath; 
            const originalFilename = file.originalFilename;
            const options = JSON.parse(fields.options);
            const { appId, userKey } = deepbrain_KEYS;

            const token = await authenticate(appId, userKey);
            await testAPIKeyValidiity(token);
            await testVideoGeneration(token);

            const uploadResults = await uploadFile(token, filePath, originalFilename);
            // const projectId = await createProject(token, uploadResults, options);
            // await waitForCreation(token, projectId);
            // await triggerExport(token, projectId);
            // const videoUrl = await waitForExport(token, projectId);
            // console.log('[doc2vid] returning videoUrl: ' + videoUrl);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ uploadResults }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    });
}

// 1) Authenticate
async function authenticate(appId, userKey) {
    const header = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ appId, userKey });
    console.log('[doc2vid] ==== AUTHENTICATING ====');
    console.log('[doc2vid] URL:     ' + `${API_HOST}${GET_TOKEN_API_PATH}`);
    console.log('[doc2vid] METHOD:  POST');
    console.log('[doc2vid] HEADERS: ' + JSON.stringify(header));
    console.log('[doc2vid] body:    ' + body);
    const resp = await fetch(`${API_HOST}${GET_TOKEN_API_PATH}`, {
        method: 'POST',
        headers: header,
        body: body
    })
    if (!resp.ok) 
        //console.log('[doc2vid] authenticate response not ok: ' + resp.status);
        {throw new Error(`[doc2vid] Auth failed [${resp.status}]`)
    }
    const json = await resp.json()
    if (!json.success) {
        console.log('[doc2vid] json.success failed: ' + json.error.msg);
        throw new Error(`[doc2vid] json.success failed: ${json.error.msg}`)
    }
    console.log('[doc2vid] Token generation success: ' + json.data.token);
    return json.data.token
}

// 2) Upload File
async function uploadFile(token, filePath, originalFilename) {
    try {
        // 1. Validate file exists and get info
        const fileStats = await fs.promises.stat(filePath);
        const fileExtension = path.extname(originalFilename).toLowerCase();
        const fileName = path.basename(filePath);
        
        console.log('[doc2vid] ==== UPLOAD FILE ====');
        console.log('[doc2vid] Uploaded File path:      ', filePath);
        console.log('[doc2vid] Uploaded File name:      ', fileName);
        console.log('[doc2vid] Uploaded File size:      ', fileStats.size, 'bytes');
        console.log('[doc2vid] Uploaded File extension: ', fileExtension);
        
        // 2. Check if file is not empty
        if (fileStats.size === 0) {
            throw new Error('File is empty');
        }
        
        // 3. Check file extension (common document types)
        const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.pptx', '.ppt'];
        if (!allowedExtensions.includes(fileExtension)) {
            console.warn('[doc2vid] Warning: Unusual file extension:', fileExtension);
        }
        
        // 4. Create form data with additional options
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append("files", fileStream, {
            filename: originalFilename,
            contentType: getContentType(fileExtension)
        });
        
        const headers = { 
            Authorization: `${token}`, 
            ...formData.getHeaders() 
        };

        console.log('[doc2vid] URL:', `${API_HOST}${FILE_UPLOAD_API_PATH}`);
        console.log('[doc2vid] METHOD: axios.POST');
        console.log('[doc2vid] Content-Type:', headers['content-type']);

        const response = await axios.post(`${API_HOST}${FILE_UPLOAD_API_PATH}`, formData, {
            headers: headers,
        });
        
        console.log('[doc2vid] Upload successful:   ', response.data);
        console.log('[doc2vid] Upload results:      ', JSON.stringify(response.data.data.uploadResults));
        return response.data.data.uploadResults;
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('[doc2vid] File not found:', filePath);
        } else {
            console.error('[doc2vid] Upload error details:');
            console.error('Status:', error.response?.status);
            console.error('Response Data:', error.response?.data);
            console.error('Error Message:', error.message);
        }
        throw error;
    }
}

// Helper function to get content type
function getContentType(extension) {
    const contentTypes = {
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc': 'application/msword',
        '.txt': 'text/plain',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.ppt': 'application/vnd.ms-powerpoint'
    };
    return contentTypes[extension] || 'application/octet-stream';
}

// 3) Create Project
async function createProject(token, uploadResults, options) {
    const header = {
            'Content-Type': 'application/json',
            Authorization: token
    };
    const body = JSON.stringify({ files: uploadResults });
    console.log('[doc2vid] ==== CREATING PROJECT ====');
    console.log('[doc2vid] URL:     ' + `${API_HOST}${CREATE_API_PATH}`);
    console.log('[doc2vid] METHOD:  POST');
    console.log('[doc2vid] HEADERS: ' + JSON.stringify(header));
    console.log('[doc2vid] body:    ' + body);
    const resp = await fetch(`${API_HOST}${CREATE_API_PATH}`, {
        method: 'POST',
        headers: header,
        body: body
    })
    if (!resp.ok) {
        throw new Error(`Create project failed [${resp.status}]`)
    }    
    const json = await resp.json()
    if (!json.success) {
        throw new Error(json.error.msg)
    }
    return json.data.projectId
}

// 4) Wait for Project Creation
async function waitForCreation(token, projectId) {
    let done = false
    while (!done) {
        const header = { Authorization: token };
        const url = `${API_HOST}${CREATE_PROGRESS_API_PATH}/?projectId=${projectId}`;
        console.log('[doc2vid] ==== WAIT FOR CREATION ====');
        console.log('[doc2vid] URL:     ' + url);
        console.log('[doc2vid] HEADERS: ' + JSON.stringify(header));
        const resp = await fetch(url, {
            headers: header
        })
        if (!resp.ok) {
            throw new Error(`Progress check failed [${resp.status}]`)
        }
        const json = await resp.json()
        if (!json.success) {
            throw new Error(json.error.msg)
        }
        const { state, progress } = json.data
        console.log(`Create state=${state}, progress=${progress}%`)
        done = (state === 'finish' && progress === 100)
        if (!done) {
            await delay(5000)
        }
    }
}

// 5) Trigger Export
async function triggerExport(token, projectId) {
    const header = {
        'Content-Type': 'application/json',
        Authorization: token
    };
    const body = JSON.stringify({ projectId })
    console.log('[doc2vid] ==== TRIGGER EXPORT ====');
    console.log('[doc2vid] URL:     ' + `${API_HOST}${EXPORT_API_PATH}`);
    console.log('[doc2vid] METHOD:  POST');
    console.log('[doc2vid] HEADERS: ' + JSON.stringify(header));
    console.log('[doc2vid] body:    ' + body);
    const resp = await fetch(`${API_HOST}${EXPORT_API_PATH}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: body
    })
    if (!resp.ok) {
        throw new Error(`Export failed [${resp.status}]`)
    }
    const json = await resp.json()
    if (!json.success) {
        throw new Error(json.error.msg)
    }
    return json.data.projectId;
}

// 6) Wait for Export
async function waitForExport(token, projectId) {
    let done = false
    let videoUrl = ''
    while (!done) {
        const header = { Authorization: token };
        const url = `${API_HOST}${EXPORT_PROGRESS_API_PATH}/${projectId}`;
        console.log('[doc2vid] ==== WAIT FOR CREATION ====');
        console.log('[doc2vid] URL:     ' + url);
        console.log('[doc2vid] HEADERS: ' + JSON.stringify(header));
        const progressData = await fetch(
            url,
            {
                method: 'GET',
                headers: header
            },
        )
        .then((response) => response.json())
        .then((response) => {
            if (response.success === true) {
                return response.data
            } else {
                console.error(`export progress error, code:`, response.error.code, `, msg:`, response.error.msg);
                throw Error(response);
            }
        })
        console.log(`export state:`, progressData.state, `, progress:`, progressData.progress)

        if (progressData.progress < 100) {
            await delay()
        } else {
            videoUrl = progressData.downloadUrl
            isExportFinish = true
        }
    }
    console.log('videoUrl :', videoUrl);
    return videoUrl;
}

async function testAPIKeyValidiity(token) {
    try {
        const res = await axios.get('https://app.aistudios.com/api/odin/v3/auth', {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('[doc2vid] Token validation: ' + JSON.stringify(res.data.data));
    } catch (error) {
        console.error(error);
    }
}

async function testVideoGeneration(token) {
    try {
        const res = await axios.post(
            "https://app.aistudios.com/api/odin/v3/tools/video-generator",
            {
                topic: "Lorem Ipsum is simply dummy text..."
            },
            {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log('[doc2vid] Video generation result:', res.data);
    } catch (error) {
        console.error('[doc2vid] Video generation failed:', error);
        throw error; // stop mainFlow if video generation fails
    }
}