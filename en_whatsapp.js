// ==UserScript==
// @name         WhatsApp Auto Messenger
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Stable auto message sender for WhatsApp Web
// @author       Pomerd
// @match        https://web.whatsapp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let queue = [];
    let isSending = false;
    let delay = 500;

    function createUI() {
        const container = document.createElement('div');
        container.id = 'auto-msg-container';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#202c33';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
        container.style.zIndex = '9999';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        container.style.color = 'white';
        container.style.fontFamily = 'Segoe UI, Helvetica, Arial, sans-serif';
        container.style.width = '300px';
        container.style.display = 'none';

        const title = document.createElement('h3');
        title.textContent = 'Auto Message';
        title.style.margin = '0 0 15px';
        title.style.textAlign = 'center';
        title.style.color = '#00a884';

        const msgLabel = document.createElement('label');
        msgLabel.textContent = 'Message:';
        msgLabel.style.display = 'block';
        msgLabel.style.marginBottom = '5px';

        const msgInput = document.createElement('textarea');
        msgInput.id = 'auto-msg-text';
        msgInput.style.width = '100%';
        msgInput.style.height = '60px';
        msgInput.style.marginBottom = '15px';
        msgInput.style.padding = '8px';
        msgInput.style.borderRadius = '4px';
        msgInput.style.border = '1px solid #3b4a54';
        msgInput.style.backgroundColor = '#2a3942';
        msgInput.style.color = 'white';

        const countLabel = document.createElement('label');
        countLabel.textContent = 'Repeat Count:';
        countLabel.style.display = 'block';
        countLabel.style.marginBottom = '5px';

        const countInput = document.createElement('input');
        countInput.id = 'auto-msg-count';
        countInput.type = 'number';
        countInput.value = '5';
        countInput.min = '1';
        countInput.max = '1000';
        countInput.style.width = '100%';
        countInput.style.marginBottom = '15px';
        countInput.style.padding = '8px';
        countInput.style.borderRadius = '4px';
        countInput.style.border = '1px solid #3b4a54';
        countInput.style.backgroundColor = '#2a3942';
        countInput.style.color = 'white';

        const delayLabel = document.createElement('label');
        delayLabel.textContent = 'Delay (ms):';
        delayLabel.style.display = 'block';
        delayLabel.style.marginBottom = '5px';

        const delayInput = document.createElement('input');
        delayInput.id = 'auto-msg-delay';
        delayInput.type = 'number';
        delayInput.value = '500';
        delayInput.min = '100';
        delayInput.max = '5000';
        delayInput.style.width = '100%';
        delayInput.style.marginBottom = '15px';
        delayInput.style.padding = '8px';
        delayInput.style.borderRadius = '4px';
        delayInput.style.border = '1px solid #3b4a54';
        delayInput.style.backgroundColor = '#2a3942';
        delayInput.style.color = 'white';

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        startBtn.style.width = '100%';
        startBtn.style.padding = '10px';
        startBtn.style.border = 'none';
        startBtn.style.borderRadius = '6px';
        startBtn.style.backgroundColor = '#00a884';
        startBtn.style.color = 'white';
        startBtn.style.cursor = 'pointer';
        startBtn.style.marginBottom = '10px';

        const status = document.createElement('div');
        status.id = 'auto-msg-status';
        status.style.textAlign = 'center';
        status.style.fontSize = '14px';
        status.style.marginTop = '10px';

        container.appendChild(title);
        container.appendChild(msgLabel);
        container.appendChild(msgInput);
        container.appendChild(countLabel);
        container.appendChild(countInput);
        container.appendChild(delayLabel);
        container.appendChild(delayInput);
        container.appendChild(startBtn);
        container.appendChild(status);

        document.body.appendChild(container);

        startBtn.addEventListener('click', () => {
            const text = msgInput.value.trim();
            const count = parseInt(countInput.value);
            delay = parseInt(delayInput.value);

            if (!text || count < 1) {
                updateStatus('⚠️ Invalid message or count!', 'error');
                return;
            }

            for (let i = 0; i < count; i++) {
                queue.push(text);
            }
            updateStatus(`✔️ ${count} messages queued`);
            if (!isSending) sendQueue();
        });
    }

    function sendQueue() {
        if (queue.length === 0) {
            isSending = false;
            updateStatus('✅ All messages sent', 'success');
            return;
        }
        isSending = true;
        const text = queue.shift();
        sendMessage(text);
        updateStatus(`${queue.length} messages left...`);
        setTimeout(sendQueue, delay + Math.floor(Math.random() * 100));
    }

    function sendMessage(text) {
        const box = document.querySelector('footer [contenteditable="true"]');
        if (!box) return;

        box.focus();
        document.execCommand('insertText', false, text);

        const enter = new KeyboardEvent('keydown', {
            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
        });
        box.dispatchEvent(enter);
    }

    function updateStatus(msg, type = 'info') {
        const el = document.getElementById('auto-msg-status');
        if (!el) return;
        el.textContent = msg;
        el.style.color = type === 'error' ? '#f15b6c' : (type === 'success' ? '#00a884' : 'white');
    }

    function addButton() {
        const container = document.querySelector('footer .x78zum5.xpvyfi4');
        if (container && !document.getElementById('auto-msg-btn')) {
            const btn = document.createElement('button');
            btn.id = 'auto-msg-btn';
            btn.textContent = '⚡';
            btn.title = 'Auto Message';
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.color = '#8696a0';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '22px';
            btn.style.marginRight = '10px';

            btn.addEventListener('click', () => {
                const ui = document.getElementById('auto-msg-container');
                ui.style.display = (ui.style.display === 'none') ? 'block' : 'none';
            });

            container.insertBefore(btn, container.firstChild);
        }
    }

    window.addEventListener('load', () => {
        createUI();
        const obs = new MutationObserver(addButton);
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(addButton, 3000);
    });
})();
