class ConfessionBoard {
    constructor() {
        this.confessions = JSON.parse(localStorage.getItem('confessions')) || [];
        this.setupEventListeners();
        this.renderConfessions();
    }

    setupEventListeners() {
        document.getElementById('postButton').addEventListener('click', () => this.postConfession());
        document.getElementById('confessionText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.postConfession();
            }
        });
    }

    postConfession() {
        const textArea = document.getElementById('confessionText');
        const text = textArea.value.trim();
        
        if (!text) return;

        const confession = {
            id: Date.now(),
            text,
            timestamp: new Date().toISOString(),
            reactions: {
                '': 0,
                '❤️': 0,
                '👍': 0,
                '😮': 0
            }
        };

        this.confessions.unshift(confession);
        this.saveConfessions();
        this.renderConfessions();
        textArea.value = '';
    }

    handleReaction(confessionId, emoji) {
        const confession = this.confessions.find(c => c.id === confessionId);
        if (confession) {
            confession.reactions[emoji]++;
            this.saveConfessions();
            this.renderConfessions();
        }
    }

    saveConfessions() {
        localStorage.setItem('confessions', JSON.stringify(this.confessions));
    }

    renderConfessions() {
        const feed = document.getElementById('confessionsFeed');
        feed.innerHTML = this.confessions.map(confession => `
            <div class="confession-card">
                <div class="confession-text">${this.escapeHTML(confession.text)}</div>
                <div class="reaction-bar">
                    ${Object.entries(confession.reactions).map(([emoji, count]) => `
                        <button 
                            class="reaction-button"
                            onclick="confessionBoard.handleReaction(${confession.id}, '${emoji}')"
                        >
                            ${emoji}
                            <span class="reaction-count">${count}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

const confessionBoard = new ConfessionBoard(); 