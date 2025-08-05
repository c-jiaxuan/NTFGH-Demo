import { Events } from '../event-bus.js';

export class GenerationModel {
    async generate(type, userInput, image = null) {
        switch (type) {
            case "txt2img":
                return await this.generateImage_KlingAI(userInput);
            case "txt2vid":
                return await this.generateVideo_KlingAI(userInput);
            case "img2vid":
                if (!image) throw new Error("Image is required for Img2Video");
                return await this.generateImg2Video_KlingAI(userInput, image);
            default:
                throw new Error("Unknown generation type: " + type);
        }
    }

    klingAI_processTask(response) {
        if (response && response.taskId) {
            return response.taskId;
        } else {
            console.error("No taskId found in KlingAI response");
            return null;
        }
    }

    async generateImage_KlingAI(userInput) {
        try {
            const res = await fetch("/api/generateImg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput })
            });

            const response = await res.json();
            return this.klingAI_processTask(response);
        } catch (err) {
            console.error('❌ Error while creating image task: ' + err);
            return null;
        }
    }

    async generateVideo_KlingAI(userInput) {
        try {
            const res = await fetch("/api/generateVid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput })
            });

            const response = await res.json();
            return this.klingAI_processTask(response);
        } catch (err) {
            console.error('❌ Error while creating video task: ' + err);
            return null;
        }
    }

    async generateImg2Video_KlingAI(userInput, image) {
        try {
            console.log('[generation-model] Received image for Img2Video');
            const base64Only = image.replace(/^data:image\/\w+;base64,/, '');

            const res = await fetch("/api/generateImg2Vid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput, base64: base64Only })
            });

            const response = await res.json();
            return this.klingAI_processTask(response);
        } catch (err) {
            console.error('❌ Error while creating Img2Video task: ' + err);
            return null;
        }
    }

    async klingAI_processTask(_response) {
        const response = _response.response;
        console.log('_response : ' + JSON.stringify(_response));
        console.log('response : ' + response);
        if (response.code != 0) {
            console.error(`Error [${response.code}]: ${response.message}`);
            return null;
        }

        const data = response.data;
        console.log('🆔 Request ID:', response.request_id);
        console.log('📌 Task ID:', data.task_id);
        console.log('📄 Task Status:', data.task_status);
        console.log('📣 Status Message:', data.task_status_msg || 'No error');

        const createdAt = new Date(data.created_at).toLocaleString();
        const updatedAt = new Date(data.updated_at).toLocaleString();
        console.log('📅 Created At:', createdAt);
        console.log('🔄 Updated At:', updatedAt);

        return data.task_id;
    }

    async processResponse(_response) {
        const response = _response.response;
        console.log('_response : ' + JSON.stringify(_response));
        console.log('response : ' + response);
        if (!response || response.code !== 0) {
            console.error(`Error [${response?.code}]: ${response?.message || 'Unknown error'}`);
            return null;
        }

        const data = response.data;
        const {
            task_id,
            task_status,
            task_status_msg,
            task_info,
            created_at,
            updated_at,
            task_result
        } = data;

        console.log("=== Task Details ===");
        console.log(`Request ID: ${response.request_id}`);
        console.log(`Task ID: ${task_id}`);
        console.log(`Status: ${task_status}`);
        if (task_status_msg) console.log(`Status Message: ${task_status_msg}`);
        if (task_info?.external_task_id) console.log(`External Task ID: ${task_info.external_task_id}`);
        console.log(`Created At: ${new Date(created_at).toISOString()}`);
        console.log(`Updated At: ${new Date(updated_at).toISOString()}`);

        switch (task_status) {
            case 'submitted':
            case 'processing':
                console.log("Task is still in progress...");
                return null;

            case 'failed':
                console.error(`Task failed: ${task_status_msg || 'No reason provided.'}`);
                return 0;

            case 'succeed':
            if (task_result?.images?.length) {
                const urls = task_result.images.map(img => img.url);
                console.log("Generated Images:", urls);
                return { type: 'image', urls };
            }

            if (task_result?.videos?.length) {
                const urls = task_result.videos.map(video => video.url);
                console.log("Generated Videos:", urls);
                return { type: 'video', urls };
            }

                console.warn("Task succeeded but no media found.");
                return null;

            default:
                console.warn(`Unhandled task status: ${task_status}`);
                return null;
        }
    }

    async queryTask_KlingAI(taskID, type) {
        console.log('taskID: ' + taskID);

        try {
            const res = await fetch("/api/queryTask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: taskID, endpoint: type})
            });

            const response = await res.json();
            const imgs = this.processResponse(response);

			if (imgs == 0) {
				throw new Error("Failed queryTask" );
			}

            if (imgs != null) {
                return imgs;
            } else {
                throw new Error("No task returned from KlingAI API");
            }
        } catch (err) {
            console.error('❌ Sorry, something went wrong while fetching the task.' + err);
            return null;
        }
    }
}
