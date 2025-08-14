import { deepbrain_KEYS } from '../../../public/js/env/deepbrain-keys.js'
import { deepbrain_config } from '../../../public/js/config/deepbrain-config.js'
import axios from "axios";
import fs from "fs";

const API_HOST = 'https://app.aistudios.com'
const GET_TOKEN_API_PATH = '/api/odin/v3/auth/token'
const CREATE_API_PATH = '/api/odin/v3/automation/topic_to_video'
const CREATE_PROGRESS_API_PATH = '/api/odin/v3/automation/progress'
const EXPORT_API_PATH = '/api/odin/v3/editor/project/export'
const EXPORT_PROGRESS_API_PATH = '/api/odin/v3/editor/progress'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Main Handler
export default async function deepbrain_url2Vid(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
        try {
            const { url, user_options } = JSON.parse(body);
            let options = {
                speed: deepbrain_config.speed,
                model: deepbrain_config.model,
                voiceOnly: deepbrain_config.voiceOnly,
                // Add user options, filtering out null/undefined/"null"
                ...Object.fromEntries(
                    Object.entries(user_options).filter(([key, value]) => 
                        value != null && value !== "null"
                    )
                )
            };
            console.log('[url2vid] options: ' + JSON.stringify(options, null, '\t'));

            const { appId, userKey } = deepbrain_KEYS;
            const token = await authenticate(appId, userKey);
            await testAPIKeyValidiity(token);
            const projectId = await createProject(token, options);
            await waitForCreation(token, projectId);
            await triggerExport(token, projectId);
            const videoUrl = await waitForExport(token, projectId);
            console.log('[url2vid] returning videoUrl: ' + videoUrl);

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
    console.log('[url2vid] ==== AUTHENTICATING ====');
    console.log('[url2vid] URL:     ' + `${API_HOST}${GET_TOKEN_API_PATH}`);
    console.log('[url2vid] METHOD:  POST');
    console.log('[url2vid] HEADERS: ' + JSON.stringify(header, null, '\t'));
    console.log('[url2vid] body:    ' + body);
    const resp = await fetch(`${API_HOST}${GET_TOKEN_API_PATH}`, {
        method: 'POST',
        headers: header,
        body: body
    })
    if (!resp.ok) 
        //console.log('[doc2vid] authenticate response not ok: ' + resp.status);
        {throw new Error(`[url2vid] Auth failed [${resp.status}]`)
    }
    const json = await resp.json()
    if (!json.success) {
        console.log('[url2vid] json.success failed: ' + json.error.msg);
        throw new Error(`[url2vid] json.success failed: ${json.error.msg}`)
    }
    console.log('[url2vid] Token generation success: ' + json.data.token);
    return json.data.token
}

// 2) Create project
async function createProject(token, url, options) {
    const header = {
            'Content-Type': 'application/json',
            Authorization: token
    };
    const body = { url, options };
    console.log('[doc2vid] ==== CREATING PROJECT ====');
    console.log('[doc2vid] URL:     ' + `${API_HOST}${CREATE_API_PATH}`);
    console.log('[doc2vid] METHOD:  POST');
    console.log('[doc2vid] HEADERS: ' + JSON.stringify(header, null, '\t'));
    console.log('[doc2vid] body:    ' + JSON.stringify(body, null, '\t'));
    const resp = await fetch(`${API_HOST}${CREATE_API_PATH}`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
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

// 3) Wait for Project Creation
async function waitForCreation(token, projectId) {
    let done = false
    while (!done) {
        const header = { Authorization: token };
        const url = `${API_HOST}${CREATE_PROGRESS_API_PATH}/?projectId=${projectId}`;
        console.log('[url2vid] ==== WAIT FOR CREATION ====');
        console.log('[url2vid] URL:     ' + url);
        console.log('[url2vid] HEADERS: ' + JSON.stringify(header, null, '\t'));
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
        console.log(`[url2vid] Create state=${state}, progress=${progress}%`)
        done = (state === 'finish' && progress === 100)
        if (!done) {
            await delay(5000)
        }
    }
}

// 4) Trigger Export
async function triggerExport(token, projectId) {
    const header = {
        'Content-Type': 'application/json',
        Authorization: token
    };
    const body = JSON.stringify({ projectId })
    console.log('[url2vid] ==== TRIGGER EXPORT ====');
    console.log('[url2vid] URL:     ' + `${API_HOST}${EXPORT_API_PATH}`);
    console.log('[url2vid] METHOD:  POST');
    console.log('[url2vid] HEADERS: ' + JSON.stringify(header, null, '\t'));
    console.log('[url2vid] body:    ' + body);
    const resp = await fetch(`${API_HOST}${EXPORT_API_PATH}`, {
        method: 'POST',
        headers: header,
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

// 5) Wait for Export
async function waitForExport(token, projectId) {
    let done = false
    let videoUrl = ''
    while (!done) {
        const header = { Authorization: token };
        const url = `${API_HOST}${EXPORT_PROGRESS_API_PATH}/${projectId}`;
        console.log('[url2vid] ==== WAIT FOR CREATION ====');
        console.log('[url2vid] URL:     ' + url);
        console.log('[url2vid] HEADERS: ' + JSON.stringify(header));
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
    console.log('[url2vid] videoUrl :', videoUrl);
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
        console.log('[url2vid] Token validation: ' + JSON.stringify(res.data.data));
    } catch (error) {
        console.error(error);
    }
}