/**
 * NoteApp Frontend Interactivity Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initToastEngine();
  initNoteCharacterCounter();
  initLiveSearch();
  initClipboardCopy();
  initDeleteModal();
});

/* Initialize Lucide Icons if loaded */
function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* 1. Toast Notification Engine */
function initToastEngine() {
  const toastDataElements = document.querySelectorAll('.flash-data-item');
  if (!toastDataElements.length) return;

  const container = getOrCreateToastContainer();

  toastDataElements.forEach((el, index) => {
    const message = el.dataset.message;
    const category = el.dataset.category || 'info';

    setTimeout(() => {
      createToast(container, message, category);
    }, index * 200);
  });
}

function getOrCreateToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function createToast(container, message, category = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${category}`;

  const iconName = category === 'success' ? 'check-circle' :
                   category === 'error' ? 'alert-circle' :
                   category === 'warning' ? 'alert-triangle' : 'info';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <div class="toast-message">${escapeHtml(message)}</div>
    <button class="toast-close" aria-label="Close notification">
      <i data-lucide="x" style="width: 16px; height: 16px;"></i>
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons({ targets: [toast] });

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => dismissToast(toast));

  // Auto dismiss after 4 seconds
  setTimeout(() => {
    dismissToast(toast);
  }, 4000);
}

function dismissToast(toast) {
  if (toast.classList.contains('toast-exit')) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

function showToast(message, category = 'info') {
  const container = getOrCreateToastContainer();
  createToast(container, message, category);
}

/* 2. Character Counter Gauge for Note Creation */
function initNoteCharacterCounter() {
  const textarea = document.getElementById('noteTextarea');
  const countDisplay = document.getElementById('charCount');
  if (!textarea || !countDisplay) return;

  const maxLength = 200;

  const updateCount = () => {
    const currentLength = textarea.value.length;
    countDisplay.textContent = `${currentLength} / ${maxLength}`;

    const counterParent = countDisplay.parentElement;
    if (currentLength >= maxLength) {
      counterParent.classList.add('at-limit');
      counterParent.classList.remove('near-limit');
    } else if (currentLength >= maxLength * 0.85) {
      counterParent.classList.add('near-limit');
      counterParent.classList.remove('at-limit');
    } else {
      counterParent.classList.remove('near-limit', 'at-limit');
    }
  };

  textarea.addEventListener('input', updateCount);
  updateCount();
}

/* 3. Live Client-Side Search & Filter */
function initLiveSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const noteCards = document.querySelectorAll('.note-card');
  const notesGrid = document.querySelector('.notes-grid');
  const emptyState = document.getElementById('notesEmptyState');
  const totalCountBadge = document.getElementById('totalNotesCount');

  if (!searchInput) return;

  const filterNotes = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    if (query.length > 0) {
      if (clearBtn) clearBtn.style.display = 'block';
    } else {
      if (clearBtn) clearBtn.style.display = 'none';
    }

    noteCards.forEach((card) => {
      const content = card.querySelector('.note-content').textContent.toLowerCase();
      if (content.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0 && noteCards.length > 0) {
        emptyState.style.display = 'block';
        const emptyText = emptyState.querySelector('p');
        if (emptyText) emptyText.textContent = `No notes match "${query}". Try searching another keyword!`;
      } else if (noteCards.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
    }

    if (totalCountBadge) {
      totalCountBadge.textContent = visibleCount;
    }
  };

  searchInput.addEventListener('input', filterNotes);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterNotes();
      searchInput.focus();
    });
  }
}

/* 4. Copy to Clipboard */
function initClipboardCopy() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.btn-copy-note');
    if (!copyBtn) return;

    const noteCard = copyBtn.closest('.note-card');
    if (!noteCard) return;

    const content = noteCard.querySelector('.note-content').textContent;
    navigator.clipboard.writeText(content).then(() => {
      showToast('Note copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy note.', 'error');
    });
  });
}

/* 5. Delete Modal Dialog Confirmation */
let formToDelete = null;

function initDeleteModal() {
  const modalOverlay = document.getElementById('deleteModal');
  const cancelBtn = document.getElementById('cancelDeleteBtn');
  const confirmBtn = document.getElementById('confirmDeleteBtn');

  if (!modalOverlay) return;

  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-trigger-delete');
    if (!deleteBtn) return;

    e.preventDefault();
    formToDelete = deleteBtn.closest('form');
    openModal(modalOverlay);
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeModal(modalOverlay);
      formToDelete = null;
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (formToDelete) {
        formToDelete.submit();
      }
      closeModal(modalOverlay);
    });
  }

  // Close modal on outside click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal(modalOverlay);
      formToDelete = null;
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
