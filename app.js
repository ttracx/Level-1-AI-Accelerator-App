const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');
const clearBtn = document.getElementById('clear-btn');
const aboutBtn = document.getElementById('about-btn');
const aboutModal = document.getElementById('about-modal');
const closeModal = document.getElementById('close-modal');
const quickBtns = document.querySelectorAll('.quick-btn');

function appendMessage(content, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.classList.add('message');

    if (isUser) {
        messageElement.innerText = content;
    } else {
        messageElement.innerHTML = content;
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendMessage(message) {
    appendMessage(message, true);
    userInput.value = '';

    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTypingIndicator();
        appendMessage(data.message, false);

    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        appendMessage('There was an error processing your message. Please try again.', false);
    }
}

sendBtn.addEventListener('click', function() {
    const message = userInput.value.trim();
    if (message === '') return;
    sendMessage(message);
});

quickBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const topic = btn.textContent;
        sendMessage(topic);
    });
});

clearBtn.addEventListener('click', function() {
    chatMessages.innerHTML = '';
    appendMessage('Chat cleared. How can I assist you with AI Accelerator?', false);
});

aboutBtn.addEventListener('click', function() {
    aboutModal.style.display = 'block';
});

closeModal.addEventListener('click', function() {
    aboutModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
});

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Initial greeting message
appendMessage('Welcome to the Level 1 AI Accelerator Generation App! How can I assist you today?', false);