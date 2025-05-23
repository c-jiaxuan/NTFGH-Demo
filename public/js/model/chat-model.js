export class ChatModel {
    constructor() {

        this.messages = [];

        this.result;
        this.followupQuestions = null;
    }

    addMessage(sender, text) {
        const message = { sender, text, timestamp: new Date() };
        this.messages.push(message);
        return message;
    }

    getMessages() {
        return this.messages;
    }

    async getBotResponse(userInput) {
        const response = await this.getSimilarity(userInput);
        console.log('getBotResponse = ' + response);

        // Optional: validate response
        if (!response) {
            return "Sorry, I didn't understand that.";
        }

        return response;
    }

    // Updates this.result
    async getSimilarity(userInput) {
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
            return await this.getSummarize(userInput);

        } catch (error) {
            console.error('Fetch or processing error:', error);
        }
    }

    async getSummarize(userInput) {
        try {

            const payload = {
                input: userInput,
                results: this.result
            };

            console.log('Sending to Summarize: ' + JSON.stringify(payload));

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

            return messageContent;
        } catch (error) {
            console.error('Summarize API Error:', error);
            return "An error occurred while summarizing.";
        }
    }
}
