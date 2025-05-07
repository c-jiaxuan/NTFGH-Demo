export const ws = new WebSocket('ws://localhost:3000');

// Generic function to send events through the server
export function send(data) {
    console.log('Sending payload to server:', data);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.warn('WebSocket is not open. Message not sent.');
    }
}

export function sendStep(type, stepIndex, substepIndex) {
    const payload = {
        eventType : 'STEP',
        type,
        stepIndex,
        substepIndex
    };

    send(payload);
}