let isLoading = false;
let recognitionActive = false;
let recognition = null;

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const chatBox = document.getElementById('chat-box');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user-message');
    userMessageDiv.innerHTML = `<div class="message">${userInput}</div>`;
    chatBox.appendChild(userMessageDiv);

    document.getElementById('user-input').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    if (!isLoading) {
        isLoading = true;
        const loadingMessageDiv = document.createElement('div');
        loadingMessageDiv.classList.add('chat-message', 'loading-message');
        loadingMessageDiv.innerHTML = `<div class="message">Bot is typing...</div>`;
        chatBox.appendChild(loadingMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) loadingMessage.remove();

        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('chat-message', 'bot-message');
        botMessageDiv.innerHTML = `<div class="message">${data.content}</div>`;
        chatBox.appendChild(botMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        isLoading = false;
    })
    .catch(error => {
        console.error('Error:', error);
        isLoading = false;
    });
}

function toggleSpeechRecognition() {
    if (recognitionActive) {
        stopSpeechRecognition();
    } else {
        startSpeechRecognition();
    }
}

function startSpeechRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        console.log('Speech recognition started');
        document.getElementById('mic-btn').style.backgroundColor = '#dc3545';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        document.getElementById('user-input').value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
        document.getElementById('mic-btn').style.backgroundColor = '#28a745';
        recognitionActive = false;
    };

    recognition.start();
    recognitionActive = true;
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
        recognitionActive = false;
        document.getElementById('mic-btn').style.backgroundColor = '#28a745';
    }
}
