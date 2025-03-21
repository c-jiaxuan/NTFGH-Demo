function createWarningOverlay(message) {
    // Check if an existing overlay is present
    if (document.getElementById('warningOverlay')) {
        return;
    }

    // Create overlay
    let overlay = document.createElement('div');
    overlay.id = 'warningOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Translucent effect
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    
    // Create message box
    let messageBox = document.createElement('div');
    messageBox.style.background = 'white';
    messageBox.style.padding = '20px';
    messageBox.style.borderRadius = '10px';
    messageBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    messageBox.style.textAlign = 'center';
    messageBox.style.width = '500px';
    messageBox.style.height = 'auto';
    messageBox.style.display = 'flex';
    messageBox.style.flexDirection = 'column';
    messageBox.style.justifyContent = 'space-between';
    
    // Create warning sign
    let warningSign = document.createElement('div');
    warningSign.textContent = '⚠️';
    warningSign.style.fontSize = '80px';
    warningSign.style.marginBottom = '10px';
    
    // Create message text
    let messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.margin = '10px 0';
    messageText.style.fontSize = '32px';
    fontWeight = 'bold';
    
    // Create close button
    let closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#d9534f';
    closeButton.style.color = 'white';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '10px';
    closeButton.style.alignSelf = 'center';
    closeButton.onclick = function () {
        document.body.removeChild(overlay);
    };
    
    // Append elements
    messageBox.appendChild(warningSign);
    messageBox.appendChild(messageText);
    messageBox.appendChild(closeButton);
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
}

// Example usage
// createWarningOverlay('This is a warning message!');
