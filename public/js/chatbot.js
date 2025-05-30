// LLMs API Settings
// Change these to change the LLMs response
const adl_questions = [
    {
        question: 'Do you need any help with your meals or feeding?',
        choices: { 'Dependant': 'Yes, I need full assistance to eat. Such as someone actively needing to feed me.',
            'Needs Assistance': 'I need some help, like cutting or opening packaging. Does not include using cutlery such as chopsticks, spoons, forks and others',
            'Independant': 'No help needed, I can manage fully on my own.', 
            'Unable to assess': 'Unable to classify.'}
    },
    // {
    //     question: 'Do you need any help with dressing or grooming?',
    //     choices: { 'Dependant': 'Yes, I need full assistance to dress and groom myself',
    //         'Needs-Assistance': 'I need some help',
    //         'Independant': 'No help needed, I can manage fully on my own.', 
    //         'Unable to assess': 'Unable to classify.'}
    // },
    {
        question: 'Do you need any help with your toileting or bathing?',
        choices: { 'Dependant': 'Yes, I need full assistance to toileting and bathing, such as someone to bathe me and clean after',
            'Needs Assistance': 'I need some help',
            'Independant': 'No help needed, I can manage fully on my own.', 
            'Unable to assess': 'Unable to classify.'}
    },
    // {
    //     question: 'Do you need any help with turning in bed?',
    //     choices: { 'Dependant': 'Yes, I need full assistance to turning in bed, such as having a helper to turn me',
    //         'Needs-Assistance': 'I need some help, such as holding onto the bed frame or by using some assistive devices',
    //         'Independant': 'No help needed, I can manage fully on my own.', 
    //         'Unable to assess': 'Unable to classify.'}
    // },
    // {
    //     question: 'Do you need any help with ambulation?',
    //     choices: { 'Dependant': 'Yes, I need full assistance with ambulation. Such as requiring someone to push my wheelchair',
    //         'Needs-Assistance': 'I need some help, like a walking stick or a wheelchair I can wheel on my own',
    //         'Independant': 'No help needed, I can manage fully on my own.', 
    //         'Unable to assess': 'Unable to classify.'}
    // }
]

window.adl_questions = adl_questions;

var bot_app = "sgroots"; // Don't change this
var bot_tone = "Succinct"; // Professional, Casual, Enthusiastic, Informational, Funny, Succinct
var bot_format = "Summary"; // Summary, Report, Bullet Points, LinkedIn Post, Email
var bot_language = "English";
var bot_followup = true;

var llm_summarise_api_url = 'https://gramener.com/docsearch/summarize';
var llm_similarity_api_url = 'https://gramener.com/docsearch/similarity';
var llmClassifyLink = 'https://voicewebapp.straivedemo.com/classify';

var selectedQuestion = adl_questions[0];

// For similarity
let result;
// Retrieve the top 3 similar documents
const maxSelected = 10;

// Used to store followup questions
var follow_up_questions = null;

var processing_status = null;
var oneTime_txt_bubble = null;

let processingSpeak = false;

const chatBody = document.getElementById('chat-history-container');
const userInput = document.getElementById('input');

const USER_BUBBLE = 'message user';
const BOT_BUBBLE = 'message bot';

const keywords = ['hotline', 'eligibility'];

let startChat = false;

// Store interval reference
let animationInterval;

const now = new Date();
const dateString = now.toLocaleDateString();
const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const speakLanguages = ['English', 'Chinese'];

document.addEventListener('LANGUAGE_CHANGE', function (evt) {
    setBotLanguage(evt.detail.index);
});

// Takes in the index of the selector
// 0 = English
// 1 = Chinese
// WILL HAVE TO IMPROVE ON THIS
function setBotLanguage(index) {
    bot_language = speakLanguages[index];
    console.log("aiLangauge = " + bot_language);
}

// Dispatches event signalling for the avatar to speak
function dispatchSpeakEvent(_message, _gesture) {
    const speakEvent = new CustomEvent('SPEAK_EVENT', {
        detail: {
            message: _message,
            gesture: _gesture
        }
    });
    document.dispatchEvent(speakEvent);
}

// Showing loading chat bubble before beginChat
function loadChat() {
    createTempBubble(BOT_BUBBLE, "Loading AI, please wait", 0);

    // Do a check every 2-3 seconds to check if preloading is stuck
    
}

function beginChat() {
    if (isPreloadingFinished() && !startChat && !document.getElementById('chat-container').classList.contains('hidden')) {
        console.log("beginning chat");
        deleteTempBubble();
        botMessage(botMessages["greeting_msg"].message, botMessages["greeting_msg"].gesture, false);
        startChat = true;
    }
}

function processUserMessage(msg){
    if (msg == '') 
    {
        // Reset all parameters
        return;
    }
    createMsgBubble(USER_BUBBLE, msg);

    userInput.value = '';

    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    sendToLLM(msg);
}

function checkForPreloadedResponse(message) {
    for (var i = 0; i < keywords.length; i++) {
        if (message.toLowerCase().includes(keywords[i].toLowerCase())) {
            return botMessages['preloaded_msgs'][i];
        }
    }
    return null;
}

// Received input from chatbox
function sendMessageFromChatbox() {
    console.log("Triggered input from chatbox");
    processUserMessage(userInput.value.trim());
}

// Received input from speech
function sendMessageFromSpeech(message){
    console.log("Received message from stt");
    processUserMessage(message);
}

async function sendToLLM(message) {
    sentToSimilarity(message);
}

async function sentToSimilarity(message) {
    //const similarityResult = await fetch(llm_similarity_api_url + new URLSearchParams(form).toString()).then((d) => d.json());

    if (message == '') {
        // If there is no message, return
        console.log("No message detected, returning...");
        var res = getRandomElement(botMessages['default_msgs']);
        createMsgBubble(BOT_BUBBLE, res.message);

        // Send out event with message contents in script.js
        // script.js will tell avatar module to speak
        dispatchSpeakEvent(res.message, res.gesture);

        return;
    }

    var queryString = llm_similarity_api_url + "?app=" + bot_app + "&q=" + message + "&k=" + maxSelected;
    console.log("queryString = " + queryString);

    startTime = performance.now();

    fetch(queryString, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())  // Convert response to JSON
    .then(data => {
        console.log(data); 

        result = { content: "" };
        Object.assign(result, data);

        // Assign relevance to each document based on the score
        result.matches.forEach((doc) => (doc.relevance = (1.5 - doc.score) / (1.5 - 0.8)));
        // Sort by relevance
        result.matches.sort((a, b) => b.relevance - a.relevance);

        result.links = [];
        result.similarity.forEach((values, i) =>
          values.forEach((similarity, j) => {
            if (i != j) result.links.push({ source: result.matches[i], target: result.matches[j], similarity });
          }),
        );

        // Start by showing the top few links
        const similarities = result.links.map((d) => d.similarity).sort((a, b) => b - a);
        var similarityValue = similarities[Math.min(50, similarities.length - 1)];
        
        //console.log("similarityValue = " + similarityValue);
        //console.log("result = " + JSON.stringify(result));

        // Safely extract message content   
        // let context = data.matches?.[0]?.page_content || "No content available";
        // let score = data.similarity?.[0]?.[0] || "No scores available";

        sendToSummarize(message, context);
    })    // Handle the data
    .catch(error => console.error('Error:', error)); // Handle errors
}

// Send user question to LLMs => retrieve and process the response
function sendToSummarize(message, context) {
    console.log("posting API...");
    // Display processing status
    createTempBubble(BOT_BUBBLE, "Retrieving Answer", 0);

    result.content = "";
    result.done = false;

    //Setup request body
    const payload = {
        "app": bot_app,
        "q": message + ". Answer in 2 full and very short sentences. Don't put the title in front.",
        "context": result.matches
                .slice(0, maxSelected)
                .map((d, i) => `DOC_ID: ${i + 1}\nTITLE: ${d.metadata.h1}\n${d.page_content}\n`)
                .join("\n"),
        "Followup": bot_followup,
        "Tone": bot_tone,
        "Format": bot_format,
        "Language": bot_language
    };

    // Make API call
    fetch(llm_summarise_api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        // Handle response
        if (response.ok) {
            return response.json(); // Parse JSON response
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    })
    .then(data => {
        console.log('Success:', data);

        // Safely extract message content
        let messageContent = data.choices?.[0]?.message?.content || "No content available";

        // Remove follow-up questions header and inline references like [[1](#1)]
        messageContent = messageContent.replace(/\*\*Follow-up questions:\*\*/i, '').trim();
        messageContent = messageContent.replace(/\[\[\d+\]\(#\d+\)\]/g, '').trim();

        // Extract follow-up questions (optional, if present)
        var followUpQuestions = messageContent.match(/- \[.*?\]/g)?.map(question => question.slice(3, -1)) || [];

        // Remove follow-up questions from the main content
        if (followUpQuestions.length > 0) {
            var splitIndex = messageContent.indexOf('- ['); // Find where follow-up starts
            messageContent = messageContent.substring(0, splitIndex).trim(); // Keep only the main content
        }

        // Output results
        console.log("Cleaned Message Content:", messageContent);
        console.log("Follow-Up Questions:", followUpQuestions);

        processBotMessage(messageContent, followUpQuestions);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Send user question to LLMs => retrieve and process the response
function sendToClassify(message) {
    console.log("posting API...");
    // Display processing status
    createTempBubble(BOT_BUBBLE, "Retrieving Answer", 0);

    //Setup request body
    const payload = {
        "question": selectedQuestion.question,
        "user_input": message,
        "choices": selectedQuestion.choices,
    };

    // Make API call
    fetch(llmClassifyLink, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        // Handle response
        if (response.ok) {
            return response.json(); // Parse JSON response
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    })
    .then(data => {
        console.log('Success:', data);

        var botResponse = formatResponse(data);

        processBotMessage(botResponse);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Process the message from LLMs to display to user
function processBotMessage(answer, followUpQns){
    //LLMs doesn't reply anything => didn't understand the question
    if (answer == "" || answer == undefined)
    {
        //Change this => using external variables
        answer = getRandomElement(botMessages['default_msgs']).message;
    }
    else
    {
        // Send out event with message contents in script.js
        // script.js will tell avatar module to speak
        dispatchSpeakEvent(botMessages["processing_msg"].message);

        // Show processing status
        createTempBubble(BOT_BUBBLE, "Processing the answer", 0);

        // Remove asterisks from chinese text and use it as the one sent to TTS
        var speakableText = removeAsterisks(answer);

        setTimeout(() => { 
            // Delete processing status after 2 seconds
            deleteTempBubble();
            //Display bot message to user
            createMsgBubble(BOT_BUBBLE, answer);

            showRecordBtn();

            //Store follow up questions for future usage
            follow_up_questions = followUpQns;
            if (follow_up_questions != null) {
                var followupMessageElement = createMsgBubble(BOT_BUBBLE, "");
                var followupSpan = followupMessageElement.querySelector('span');
    
                let header = document.createElement("p");
                //**Add avatar talking**
                header.textContent = "Some common follow-up questions:";
                header.style.fontWeight = "bold"; // Make header bold
                followupSpan.append(header);
                
                // Loop through follow-up questions and create bullet points
                follow_up_questions.forEach(question => {
                    let li = document.createElement("li");
                    li.textContent = question;
                    followupSpan.appendChild(li);
                });
                
                console.log("Follow up questions found, sending follow up question...");
                follow_up_questions = null;
            }
        }, 2000);
    }

    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // Send out event with message contents in script.js
    // script.js will tell avatar module to speak
    dispatchSpeakEvent(speakableText);
}

function removeAsterisks(text) {
    return text.replace(/\*/g, '');
}

let flagTriggered = false;
// Takes in a message to be sent by the bot
function botMessage(setMessage, gesture, delay) {
    if(delay)
    {
        registerNextSpeak(setMessage.toString());
        setTimeout(() => {
            // Event listener for early trigger
            function flagHandler() {
                flagTriggered = true;
                console.log(Error, "Flag triggered");
                document.removeEventListener("AICLIPSET_PLAY_STARTED", flagHandler); // Clean up
            }
        
            document.addEventListener("AICLIPSET_PLAY_STARTED", flagHandler)
    
            new Promise((resolve) => {
                // Check for 7 seconds timeout
                const timeout = setTimeout(() => {
                    console.log(Error, "Timeout return");
                    document.removeEventListener("AICLIPSET_PLAY_STARTED", flagHandler);
                    showBotMessage();
                    resolve();
                }, 7000);
    
                // Check every 300ms
                const interval = setInterval(() => {
                    if(flagTriggered){
                        console.log(Error, "flag return");
                        flagTriggered = false;
                        clearTimeout(timeout);
                        clearInterval(interval);
                        showBotMessage();
                        document.removeEventListener("AICLIPSET_PLAY_STARTED", flagHandler); // Clean up
                        resolve();
                    }
                }, 300);
            });
    
            function showBotMessage(){
                showRecordBtn();
                createMsgBubble(BOT_BUBBLE, setMessage);
    
                deleteTempBubble();
    
                if (follow_up_questions != null) {
                    const followupMessageElement = createMsgBubble(BOT_BUBBLE, "");
                    const followupSpan = followupMessageElement.querySelector('span');
    
                    let header = document.createElement("p");
                    //**Add avatar talking**
                    header.textContent = "Some common follow-up questions:";
                    header.style.fontWeight = "bold"; // Make header bold
                    followupSpan.append(header);
                    
                    // Loop through follow-up questions and create bullet points
                    follow_up_questions.forEach(question => {
                        let li = document.createElement("li");
                        li.textContent = question;
                        followupSpan.appendChild(li);
                    });
                    console.log("Follow up questions found, sending follow up question...");
                    //botMessage(g_follow_up_questions[0]);
                    follow_up_questions = null;
                }
    
                // Scroll to the bottom
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }, 0);
    }
    else
    {
        console.log("show answer without delay");

        // Send out event with message contents in script.js
        // script.js will tell avatar module to speak
        dispatchSpeakEvent(setMessage.toString(), gesture);
        
        createMsgBubble(BOT_BUBBLE, setMessage);

        showRecordBtn();

        deleteTempBubble();

        if (follow_up_questions != null) {
            const followupMessageElement = createMsgBubble(USER_BUBBLE, "");
            const followupSpan = followupMessageElement.querySelector('span');

            let header = document.createElement("p");
            //**Add avatar talking**
            header.textContent = "Some common follow-up questions:";
            header.style.fontWeight = "bold"; // Make header bold
            followupSpan.append(header);
            
            // Loop through follow-up questions and create bullet points
            follow_up_questions.forEach(question => {
                let li = document.createElement("li");
                li.textContent = question;
                followupSpan.appendChild(li);
            });
            console.log("Follow up questions found, sending follow up question...");
            follow_up_questions = null;
        }

        // Scroll to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

function createMsgBubble(userID, message) {
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = userID;
    botMessageDiv.innerHTML = `<span>${message}</span><div class="message-time">${dateString} ${timeString}</div>`;
    chatBody.appendChild(botMessageDiv);

    const botSpan = botMessageDiv.querySelector('span');
    // After typing finishes, swap to HTML with bold formatting
    botSpan.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    return botMessageDiv;
}

function createTempBubble(userID, message, timing) {
    // If there is a temp bubble around, update it else create one
    if (oneTime_txt_bubble != null) {
        oneTime_txt_bubble.innerHTML = `<span>${message}</span><div class="message-time">${dateString} ${timeString}</div>`;
        const botSpan = oneTime_txt_bubble.querySelector('span');
        // After typing finishes, swap to HTML with bold formatting
        botSpan.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    } else {
        oneTime_txt_bubble = createMsgBubble(userID, message);
    }
    // If timing is given, delete the bubble after some time
    if (timing != 0) {
        // Delete bubble after 'timing' seconds
        setTimeout(function () { deleteTempBubble(); }, timing);
    }

    // Scroll to the bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    animateMsgBubble();
    return oneTime_txt_bubble;
}

function animateMsgBubble() {
    if (!oneTime_txt_bubble) return; // Ensure the bubble exists

    let dots = 0;
    const botSpan = oneTime_txt_bubble.querySelector('span');
    const baseMessage = botSpan.innerText; // Store the original message

    animationInterval = setInterval(() => {
        dots = (dots % 3) + 1; // Cycle between 1 to 3 dots
        botSpan.innerText = baseMessage + ".".repeat(dots); // Append dots
    }, 500); // Adjust speed as needed
}

function stopAnimateMsgBubble() {
    clearInterval(animationInterval); // Stop the animation
    if (oneTime_txt_bubble) {
        const botSpan = oneTime_txt_bubble.querySelector('span');
        botSpan.innerText = botSpan.innerText.replace(/\.+$/, ""); // Remove trailing dots
    }
}

function deleteTempBubble() {
    stopAnimateMsgBubble();
    oneTime_txt_bubble?.remove();
    oneTime_txt_bubble = null;
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}
