export class ChatModel {
    constructor() {

        const messageContentType = {
            TEXT_ONLY: 1,
            W_IMAGE: 2,
            W_VIDEO: 3
        };

        this.messages = [];

        this.result;
        this.followupQuestions = null;

        this.uploadedFile = null;
    }

    addMessage(sender, content, id, intent) {
        const timestamp = new Date(); // current date and time
        const message = { sender, content , id, intent, timestamp};
        console.log('\n(Chat-model) Pushing message: ');
        console.log(JSON.stringify(message), '\n');
        this.messages.push(message);
        return message;
    }

    getMessages() {
        return this.messages;
    }

    getMessage(id) {
        return this.messages.find(msg => msg.id === id);
    }

    getMessageIntent(id) {
        const message = this.getMessage(id);
        return message.intent;
    }

    isImageMessage(id) {
        const message = this.getMessage(id);
        return message && message.content && message.content.image !== undefined;
    }

    isVideoMessage(id) {
        const message = this.getMessage(id);
        return message && message.content && message.content.video !== undefined;
    }

    updateMessage(id, content) {
        const message = this.getMessage(id);
        if (message) {
            message.content = content;
            message.timestamp = new Date(); // update timestamp to reflect the edit time
            return true;
        }
        return false;
    }

    getUploadedFile() {
        return this.uploadedFile;
    }

    clearUploadedFile() {
        this.uploadedFile = null;
    }

    getUploadedFileType() {
        if (!this.uploadedFile) return null;
        // Heuristic: check first few characters of base64 for file type
        const base64Only = this.uploadedFile.replace(/^data:image\/\w+;base64,/, '');
        if (base64Only.startsWith('iVBOR')) return 'image'; // PNG
        if (base64Only.startsWith('/9j/')) return 'image'; // JPEG
        if (base64Only.startsWith('AAAA')) return 'video'; // MP4 (base64 of ftyp)
        return 'unknown';
    }

    async getBotResponse(userInput, language) {
        const response = await this.getSimilarity(userInput, language);
        console.log('getBotResponse = ' + response);

        // Validate response
        if (!response) {
            return null;
        }

        return response;
    }

    async generateImage_stabilityAI(userInput) {
        try {
            const res = await fetch("/api/generateImg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput })
            });

            const response = await res.json();
            const data = response.response;
            console.log('/api/generateImg data: ' + JSON.stringify(data));

            if (data.artifacts && data.artifacts.length > 0 && data.artifacts[0].base64) {
                const base64 = data.artifacts[0].base64;
                const imageSrc = `data:image/png;base64,${base64}`;
                return imageSrc;
            } else {
                throw new Error("No image returned from StabilityAI API");
            }
        } catch (err) {
            console.error('❌ Sorry, something went wrong while generating the image.' + err);
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
            const taskID = this.klingAI_processTask(response);

            if (taskID != null) {
                return taskID;
            } else {
                throw new Error("Task not created in KlingAI API");
            }
        } catch (err) {
            console.error('❌ Sorry, something went wrong while creating the task.' + err);
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
            const taskID = this.klingAI_processTask(response);

            if (taskID != null) {
                return taskID;
            } else {
                throw new Error("Task not created in KlingAI API");
            }
        } catch (err) {
            console.error('❌ Sorry, something went wrong while creating the task.' + err);
            return null;
        }
    }

    async generateImg2Video_KlingAI(userInput, image) {
        try {
            console.log('[chat-model] Receieved: ' + userInput + ', ' + image);
            // Removes prefix for the API call
            const base64Only = image.replace(/^data:image\/\w+;base64,/, '');
            const res = await fetch("/api/generateImg2Vid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userInput, base64: base64Only})
            });

            const response = await res.json();
            const taskID = this.klingAI_processTask(response);

            if (taskID != null) {
                return taskID;
            } else {
                throw new Error("Task not created in KlingAI API");
            }
        } catch (err) {
            console.error('❌ Sorry, something went wrong while creating the task.' + err);
            return null;
        }
    }

    async queryTask_KlingAI(messageID, taskID) {
        const msg = this.getMessage(messageID);
        if (msg == undefined) {
            console.log('(chat-model) queryTask_KlingAI : no message with messageID found');
            return null;
        }

        console.log('msg: ' + msg);
        const type = msg.intent;

        console.log('MessageID: ' + messageID);
        console.log('taskID: ' + taskID);
        console.log('Intent: ' + type);

        try {
            const res = await fetch("/api/queryTask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: taskID, endpoint: type})
            });

            const response = await res.json();
            const imgs = this.processResponse(response);

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

    // Updates this.result
    async getSimilarity(userInput, language) {
        try {
            const response = await fetch('/api/gramanerSimilarity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: userInput })
            });

            const output = await response.json();
            const data = output.response;
            console.log('Similarity API Response:', data);

            // Ensure required fields are present
            if (!data.matches || !Array.isArray(data.matches)) {
                console.error('Error: matches is missing or not an array');
                return;
            }

            if (!data.similarity || !Array.isArray(data.similarity)) {
                console.error('Error: similarity is missing or not an array');
                return;
            }

            this.result = { content: "", ...data };

            // Assign relevance to each document
            this.result.matches.forEach(doc => {
                doc.relevance = (1.5 - doc.score) / (1.5 - 0.8);
            });

            // Sort by relevance
            this.result.matches.sort((a, b) => b.relevance - a.relevance);

            // Build similarity links
            this.result.links = [];
            this.result.similarity.forEach((values, i) => {
                if (!Array.isArray(values)) return;  // Guard inner arrays
                values.forEach((similarity, j) => {
                    if (i !== j) {
                        this.result.links.push({
                            source: this.result.matches[i],
                            target: this.result.matches[j],
                            similarity
                        });
                    }
                });
            });

            // Start by showing the top few links
            const similarities = this.result.links.map(d => d.similarity).sort((a, b) => b - a);
            const similarityValue = similarities[Math.min(50, similarities.length - 1)];

            // Optionally log
            // console.log("similarityValue = ", similarityValue);
            // console.log("result = ", result);

            // Trigger summarize
            return await this.getSummarize(userInput, language);

        } catch (error) {
            console.error('Fetch or processing error:', error);
        }
    }

    async getSummarize(userInput, language) {
        try {

            const payload = {
                input: userInput,
                results: this.result,
                lang: language
            };

            // console.log('Sending to Summarize: ' + JSON.stringify(payload));

            const response = await fetch('/api/gramanerSummarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Summarize API Success:', data);
            
            // Safely extract message content
            let messageContent = data.response?.choices?.[0]?.message?.content || "No content available";

            console.log("Summarize API messageContent = " + messageContent);

            // Remove "Follow-up questions" section header and inline citations like [[1](#1)]
            messageContent = messageContent.replace(/\*\*Follow-up questions:\*\*/i, '').trim();
            messageContent = messageContent.replace(/\[\[\d+\]\(#\d+\)\]/g, '').trim();

            // Extract follow-up questions (optional)
            let followUpQuestions = [];
            const matchQuestions = messageContent.match(/- \[.*?\]/g);
            if (matchQuestions) {
                followUpQuestions = matchQuestions.map(q => q.slice(3, -1));

                // Remove the follow-up question section from the main content
                const splitIndex = messageContent.indexOf('- [');
                if (splitIndex !== -1) {
                    messageContent = messageContent.substring(0, splitIndex).trim();
                }
            }

            // Output results
            console.log("Cleaned Summary Content:", messageContent);
            console.log("Extracted Follow-Up Questions:", followUpQuestions);

            return { content: messageContent, followUp: followUpQuestions };
        } catch (error) {
            console.error('Summarize API Error:', error);
            return "An error occurred while summarizing.";
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
                return null;

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

    async convertToBase64Img(image) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                const base64Full = event.target.result;
                // const base64Only = base64Full.replace(/^data:image\/\w+;base64,/, '');
                this.uploadedFile = base64Full;
                console.log('[chat-model] Set uploaded file to be: ' + this.uploadedFile);
                resolve(base64Full);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsDataURL(image);
        });
    }
}
