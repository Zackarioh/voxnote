// Main Application JavaScript

// Check authentication
const currentUser = JSON.parse(localStorage.getItem('voxnoteUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user name
document.getElementById('userName').textContent = currentUser.name;

// Initialize variables
let recognition;
let isRecording = false;
let recordingStartTime;
let timerInterval;
let currentEditingNoteId = null;

// Initialize Speech Recognition
let finalTranscript = '';
let interimTranscript = '';

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.getElementById('languageDropdown').value;
    
    recognition.onstart = function() {
        isRecording = true;
        updateRecordingUI(true);
        startTimer();
        // Reset transcripts when starting new recording
        finalTranscript = '';
        interimTranscript = '';
    };
    
    recognition.onresult = function(event) {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        document.getElementById('transcript').value = finalTranscript + interimTranscript;
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showToast('Error: ' + event.error, 'error');
        stopRecording();
    };
    
    recognition.onend = function() {
        if (isRecording) {
            recognition.start(); // Restart if still recording
        }
    };
}

// Language selection
document.getElementById('languageDropdown').addEventListener('change', function(e) {
    if (recognition) {
        recognition.lang = e.target.value;
        if (isRecording) {
            stopRecording();
            showToast('Recording stopped. Language changed.', 'info');
        }
    }
});

// Record button handler
document.getElementById('recordBtn').addEventListener('click', function() {
    if (!recognition) {
        showToast('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

function startRecording() {
    try {
        recognition.start();
        showToast('Recording started...', 'success');
    } catch (error) {
        console.error('Error starting recognition:', error);
        showToast('Failed to start recording', 'error');
    }
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
    isRecording = false;
    updateRecordingUI(false);
    stopTimer();
    showToast('Recording stopped', 'info');
}

function updateRecordingUI(recording) {
    const recordBtn = document.getElementById('recordBtn');
    const micVisual = document.getElementById('micVisual');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTimer = document.getElementById('recordingTimer');
    
    if (recording) {
        recordBtn.classList.add('recording');
        micVisual.classList.add('active');
        recordingStatus.textContent = 'Listening...';
        recordingTimer.style.display = 'flex';
    } else {
        recordBtn.classList.remove('recording');
        micVisual.classList.remove('active');
        recordingStatus.textContent = 'Click the microphone to start recording';
        recordingTimer.style.display = 'none';
    }
}

function startTimer() {
    recordingStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById('timerDisplay').textContent = '00:00';
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

// Clear transcript
document.getElementById('clearTranscript').addEventListener('click', function() {
    document.getElementById('transcript').value = '';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteTags').value = '';
    
    // Reset transcript variables
    if (typeof finalTranscript !== 'undefined') {
        finalTranscript = '';
    }
    if (typeof interimTranscript !== 'undefined') {
        interimTranscript = '';
    }
    
    // Stop recording if active
    if (isRecording) {
        stopRecording();
    }
    
    showToast('Transcript cleared', 'info');
});

// Copy transcript
document.getElementById('copyTranscript').addEventListener('click', function() {
    const transcript = document.getElementById('transcript').value;
    if (transcript) {
        navigator.clipboard.writeText(transcript).then(() => {
            showToast('Copied to clipboard!', 'success');
        });
    } else {
        showToast('Nothing to copy', 'warning');
    }
});

// Save note
document.getElementById('saveNote').addEventListener('click', function() {
    const transcript = document.getElementById('transcript').value.trim();
    
    if (!transcript) {
        showToast('Please record something first', 'warning');
        return;
    }
    
    const title = document.getElementById('noteTitle').value.trim() || 
                  'Note ' + new Date().toLocaleString();
    const tags = document.getElementById('noteTags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    const note = {
        id: Date.now().toString(),
        userId: currentUser.id,
        title: title,
        content: transcript,
        tags: tags,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    saveNoteToStorage(note);
    
    // Clear form and reset transcripts
    document.getElementById('transcript').value = '';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteTags').value = '';
    
    // Reset transcript variables
    if (typeof finalTranscript !== 'undefined') {
        finalTranscript = '';
    }
    if (typeof interimTranscript !== 'undefined') {
        interimTranscript = '';
    }
    
    showToast('Note saved successfully!', 'success');
    loadNotes();
    updateStats();
    updateTagsList();
});

// Save note to localStorage
function saveNoteToStorage(note) {
    const notes = getAllNotes();
    notes.unshift(note);
    localStorage.setItem('voxnoteNotes', JSON.stringify(notes));
}

// Get all notes
function getAllNotes() {
    const notes = JSON.parse(localStorage.getItem('voxnoteNotes') || '[]');
    return notes.filter(note => note.userId === currentUser.id);
}

// Load and display notes
function loadNotes(filterType = 'all', searchQuery = '', sortBy = 'date-desc') {
    let notes = getAllNotes();
    
    // Apply filters
    if (filterType === 'today') {
        const today = new Date().toDateString();
        notes = notes.filter(note => new Date(note.createdAt).toDateString() === today);
    } else if (filterType === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        notes = notes.filter(note => new Date(note.createdAt) >= weekAgo);
    } else if (filterType === 'favorites') {
        notes = notes.filter(note => note.favorite);
    } else if (filterType.startsWith('tag:')) {
        const tag = filterType.substring(4);
        notes = notes.filter(note => note.tags.includes(tag));
    }
    
    // Apply search
    if (searchQuery) {
        notes = notes.filter(note => 
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    
    // Apply sorting
    notes.sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'date-asc':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
    
    displayNotes(notes);
}

// Display notes in grid
function displayNotes(notes) {
    const notesGrid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (notes.length === 0) {
        notesGrid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    notesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    notesGrid.innerHTML = notes.map(note => `
        <div class="note-card" data-note-id="${note.id}">
            <div class="note-header">
                <h3>${escapeHtml(note.title)}</h3>
                <button class="favorite-btn ${note.favorite ? 'active' : ''}" onclick="toggleFavorite('${note.id}')">
                    <i class="fas fa-star"></i>
                </button>
            </div>
            <div class="note-content">
                ${escapeHtml(note.content.substring(0, 200))}${note.content.length > 200 ? '...' : ''}
            </div>
            <div class="note-footer">
                <div class="note-tags">
                    ${note.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')}
                </div>
                <div class="note-meta">
                    <span><i class="fas fa-clock"></i> ${formatDate(note.createdAt)}</span>
                    <span><i class="fas fa-font"></i> ${note.content.split(' ').length} words</span>
                </div>
                <div class="note-actions">
                    <button onclick="readNote('${note.id}')" class="action-btn" title="Read aloud">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button onclick="editNote('${note.id}')" class="action-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="exportNote('${note.id}')" class="action-btn" title="Export">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="deleteNote('${note.id}')" class="action-btn delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle favorite
function toggleFavorite(noteId) {
    const notes = JSON.parse(localStorage.getItem('voxnoteNotes') || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        note.favorite = !note.favorite;
        localStorage.setItem('voxnoteNotes', JSON.stringify(notes));
        loadNotes();
        showToast(note.favorite ? 'Added to favorites' : 'Removed from favorites', 'success');
    }
}

// Read note aloud
function readNote(noteId) {
    const notes = getAllNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (note && 'speechSynthesis' in window) {
        // Stop any ongoing speech first
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(note.content);
        utterance.lang = document.getElementById('languageDropdown').value;
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume
        
        utterance.onend = function() {
            showToast('Finished reading note', 'info');
        };
        
        utterance.onerror = function(event) {
            showToast('Error reading note: ' + event.error, 'error');
        };
        
        window.speechSynthesis.speak(utterance);
        showToast('Reading note...', 'info');
    } else {
        showToast('Text-to-speech not supported', 'error');
    }
}

// Edit note
function editNote(noteId) {
    const notes = getAllNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        currentEditingNoteId = noteId;
        document.getElementById('editTitle').value = note.title;
        document.getElementById('editContent').value = note.content;
        document.getElementById('editTags').value = note.tags.join(', ');
        document.getElementById('editModal').classList.add('active');
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingNoteId = null;
}

function saveEditedNote() {
    if (!currentEditingNoteId) return;
    
    const title = document.getElementById('editTitle').value.trim();
    const content = document.getElementById('editContent').value.trim();
    
    // Validation
    if (!title) {
        showToast('Please enter a title', 'warning');
        return;
    }
    
    if (!content) {
        showToast('Note content cannot be empty', 'warning');
        return;
    }
    
    const notes = JSON.parse(localStorage.getItem('voxnoteNotes') || '[]');
    const noteIndex = notes.findIndex(n => n.id === currentEditingNoteId);
    
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].tags = document.getElementById('editTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        notes[noteIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('voxnoteNotes', JSON.stringify(notes));
        loadNotes();
        updateTagsList();
        closeEditModal();
        showToast('Note updated successfully!', 'success');
    }
}

// Export note
function exportNote(noteId) {
    const notes = getAllNotes();
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        const content = `Title: ${note.title}\nDate: ${new Date(note.createdAt).toLocaleString()}\nTags: ${note.tags.join(', ')}\n\n${note.content}`;
        downloadFile(content, `${note.title}.txt`, 'text/plain');
        showToast('Note exported!', 'success');
    }
}

// Export all notes
document.getElementById('exportAll').addEventListener('click', function() {
    const notes = getAllNotes();
    
    if (notes.length === 0) {
        showToast('No notes to export', 'warning');
        return;
    }
    
    const content = notes.map(note => 
        `Title: ${note.title}\nDate: ${new Date(note.createdAt).toLocaleString()}\nTags: ${note.tags.join(', ')}\n\n${note.content}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    downloadFile(content, `VoxNote_Export_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
    showToast('All notes exported!', 'success');
});

// Delete note
function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        const notes = JSON.parse(localStorage.getItem('voxnoteNotes') || '[]');
        const filtered = notes.filter(n => n.id !== noteId);
        localStorage.setItem('voxnoteNotes', JSON.stringify(filtered));
        loadNotes();
        updateStats();
        showToast('Note deleted', 'success');
    }
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchQuery = e.target.value;
    const filterType = document.querySelector('.filter-btn.active').dataset.filter;
    const sortBy = document.getElementById('sortSelect').value;
    loadNotes(filterType, searchQuery, sortBy);
});

// Sort functionality
document.getElementById('sortSelect').addEventListener('change', function(e) {
    const sortBy = e.target.value;
    const filterType = document.querySelector('.filter-btn.active').dataset.filter;
    const searchQuery = document.getElementById('searchInput').value;
    loadNotes(filterType, searchQuery, sortBy);
});

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filterType = this.dataset.filter;
        const searchQuery = document.getElementById('searchInput').value;
        const sortBy = document.getElementById('sortSelect').value;
        loadNotes(filterType, searchQuery, sortBy);
    });
});

// Update statistics
function updateStats() {
    const notes = getAllNotes();
    const totalWords = notes.reduce((sum, note) => sum + note.content.split(' ').length, 0);
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekNotes = notes.filter(note => new Date(note.createdAt) >= weekAgo);
    
    document.getElementById('totalNotes').textContent = notes.length;
    document.getElementById('totalWords').textContent = totalWords.toLocaleString();
    document.getElementById('weekNotes').textContent = weekNotes.length;
}

// Update tags list
function updateTagsList() {
    const notes = getAllNotes();
    const tagsMap = new Map();
    
    notes.forEach(note => {
        note.tags.forEach(tag => {
            tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
        });
    });
    
    const tagsList = document.getElementById('tagsList');
    
    if (tagsMap.size === 0) {
        tagsList.innerHTML = '<p class="no-tags">No tags yet</p>';
        return;
    }
    
    const sortedTags = Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1]);
    
    tagsList.innerHTML = sortedTags.map(([tag, count]) => `
        <button class="tag-item" onclick="filterByTag('${escapeHtml(tag)}')">
            <span>#${escapeHtml(tag)}</span>
            <span class="tag-count">${count}</span>
        </button>
    `).join('');
}

function filterByTag(tag) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    loadNotes('tag:' + tag);
    showToast(`Filtered by #${tag}`, 'info');
}

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('voxnoteDarkMode', 'true');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('voxnoteDarkMode', 'false');
    }
});

// Load dark mode preference
if (localStorage.getItem('voxnoteDarkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('#darkModeToggle i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// User menu toggle
function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('voxnoteUser');
        window.location.href = 'index.html';
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('active');
    }
    
    if (!e.target.closest('.modal-content') && e.target.classList.contains('modal')) {
        closeEditModal();
    }
});

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app
loadNotes();
updateStats();
updateTagsList();

// Refresh stats and tags periodically
setInterval(() => {
    updateStats();
    updateTagsList();
}, 5000);
