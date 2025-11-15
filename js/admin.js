// ========================================
// Admin Authentication & State
// ========================================

console.log('✅ admin.js 로드됨');

const DEFAULT_PASSWORD = 'admin123'; // Default password

// 전역 스코프에 함수 노출 확인
window.addEventListener('load', function() {
    console.log('🔍 전역 함수 확인:');
    console.log('  - openGithubSettingsModal:', typeof openGithubSettingsModal);
    console.log('  - syncToGithub:', typeof syncToGithub);
    console.log('  - openChangePasswordModal:', typeof openChangePasswordModal);
});
let isAuthenticated = false;
let pressItems = [];
let editingItemId = null;

// Get current admin password (from localStorage or default)
function getAdminPassword() {
    const customPassword = localStorage.getItem('hillstone_admin_password');
    return customPassword || DEFAULT_PASSWORD;
}

// ========================================
// Initialize Admin App
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOMContentLoaded 이벤트 발생');
    console.log('🔍 githubSettingsBtn 요소:', document.getElementById('githubSettingsBtn'));
    console.log('🔍 githubSyncBtn 요소:', document.getElementById('githubSyncBtn'));
    console.log('🔍 changePasswordBtn 요소:', document.getElementById('changePasswordBtn'));
    
    checkAuthentication();
    initializeEventListeners();
    
    console.log('✅ initializeEventListeners() 호출 완료');
});

// ========================================
// Authentication
// ========================================

function checkAuthentication() {
    const authToken = sessionStorage.getItem('hillstone_admin_auth');
    if (authToken === 'authenticated') {
        isAuthenticated = true;
        showDashboard();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    console.log('📊 대시보드 표시 중...');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // 대시보드가 표시된 후 버튼 이벤트 리스너 다시 등록
    setTimeout(function() {
        console.log('🔄 대시보드 버튼 이벤트 리스너 재등록 중...');
        
        // GitHub Settings button
        const githubSettingsBtn = document.getElementById('githubSettingsBtn');
        if (githubSettingsBtn) {
            githubSettingsBtn.onclick = function() {
                console.log('🎯 GitHub Settings 버튼 클릭됨!');
                openGithubSettingsModal();
            };
            console.log('✅ GitHub Settings 버튼 onclick 등록됨');
        }
        
        // GitHub Sync button
        const githubSyncBtn = document.getElementById('githubSyncBtn');
        if (githubSyncBtn) {
            githubSyncBtn.onclick = function() {
                console.log('🎯 GitHub Sync 버튼 클릭됨!');
                syncToGithub();
            };
            console.log('✅ GitHub Sync 버튼 onclick 등록됨');
        }
        
        // Change Password button
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.onclick = function() {
                console.log('🎯 비밀번호 변경 버튼 클릭됨!');
                openChangePasswordModal();
            };
            console.log('✅ 비밀번호 변경 버튼 onclick 등록됨');
        }
        
        console.log('✅ 대시보드 버튼 리스너 재등록 완료');
    }, 100);
    
    loadPressItems();
    updateStats();
    renderAdminItems();
}

function logout() {
    sessionStorage.removeItem('hillstone_admin_auth');
    isAuthenticated = false;
    showLoginScreen();
}

// ========================================
// Event Listeners
// ========================================

function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === getAdminPassword()) {
            sessionStorage.setItem('hillstone_admin_auth', 'authenticated');
            isAuthenticated = true;
            showDashboard();
        } else {
            alert('비밀번호가 올바르지 않습니다.');
            document.getElementById('password').value = '';
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);

    // Add new button
    const addNewBtn = document.getElementById('addNewBtn');
    addNewBtn.addEventListener('click', function() {
        openEditModal();
    });

    // Edit form
    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveItem();
    });

    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    cancelEditBtn.addEventListener('click', function() {
        closeEditModalFunc();
    });

    // Close modal buttons
    const closeEditModalBtn = document.getElementById('closeEditModal');
    closeEditModalBtn.addEventListener('click', () => {
        closeEditModalFunc();
    });

    // Category change handler
    const editCategory = document.getElementById('editCategory');
    editCategory.addEventListener('change', function() {
        toggleImageInputs(this.value);
    });

    // Add image URL button
    const addImageUrlBtn = document.getElementById('addImageUrlBtn');
    addImageUrlBtn.addEventListener('click', addImageUrlInput);

    // Initial remove button for default image input
    const initialRemoveBtn = document.querySelector('#imageUrlsContainer .btn-remove-image');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            removeImageUrl(this);
        });
    }

    // Click outside modal to close
    const editModal = document.getElementById('editModal');
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModalFunc();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditModalFunc();
        }
    });

    // GitHub Settings button
    const githubSettingsBtn = document.getElementById('githubSettingsBtn');
    console.log('🔧 githubSettingsBtn 찾기:', githubSettingsBtn);
    if (githubSettingsBtn) {
        githubSettingsBtn.addEventListener('click', function() {
            console.log('🎯 GitHub Settings 버튼 클릭됨!');
            openGithubSettingsModal();
        });
        console.log('✅ GitHub Settings 버튼 리스너 등록됨');
    } else {
        console.error('❌ githubSettingsBtn 요소를 찾을 수 없습니다!');
    }

    // GitHub Sync button
    const githubSyncBtn = document.getElementById('githubSyncBtn');
    console.log('🔄 githubSyncBtn 찾기:', githubSyncBtn);
    if (githubSyncBtn) {
        githubSyncBtn.addEventListener('click', function() {
            console.log('🎯 GitHub Sync 버튼 클릭됨!');
            syncToGithub();
        });
        console.log('✅ GitHub Sync 버튼 리스너 등록됨');
    } else {
        console.error('❌ githubSyncBtn 요소를 찾을 수 없습니다!');
    }

    // Change Password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    console.log('🔑 changePasswordBtn 찾기:', changePasswordBtn);
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            console.log('🎯 비밀번호 변경 버튼 클릭됨!');
            openChangePasswordModal();
        });
        console.log('✅ 비밀번호 변경 버튼 리스너 등록됨');
    } else {
        console.error('❌ changePasswordBtn 요소를 찾을 수 없습니다!');
    }

    // GitHub Settings Form
    const githubSettingsForm = document.getElementById('githubSettingsForm');
    if (githubSettingsForm) {
        githubSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const settings = {
                token: document.getElementById('githubToken').value.trim(),
                owner: document.getElementById('githubOwner').value.trim(),
                repo: document.getElementById('githubRepo').value.trim(),
                branch: document.getElementById('githubBranch').value.trim()
            };
            
            if (!settings.token || !settings.owner || !settings.repo || !settings.branch) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
            
            saveGithubSettings(settings);
            closeGithubSettingsModal();
            alert('GitHub 설정이 저장되었습니다.');
        });
    }

    // Close GitHub Settings Modal buttons
    const closeGithubSettingsModalBtn = document.getElementById('closeGithubSettingsModal');
    if (closeGithubSettingsModalBtn) {
        closeGithubSettingsModalBtn.addEventListener('click', closeGithubSettingsModal);
    }
    
    const cancelGithubSettingsBtn = document.getElementById('cancelGithubSettingsBtn');
    if (cancelGithubSettingsBtn) {
        cancelGithubSettingsBtn.addEventListener('click', closeGithubSettingsModal);
    }

    // Change Password Form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate current password
            if (currentPassword !== getAdminPassword()) {
                alert('❌ 현재 비밀번호가 올바르지 않습니다.');
                return;
            }
            
            // Validate new password length
            if (newPassword.length < 6) {
                alert('❌ 새 비밀번호는 최소 6자 이상이어야 합니다.');
                return;
            }
            
            // Validate password confirmation
            if (newPassword !== confirmPassword) {
                alert('❌ 새 비밀번호가 일치하지 않습니다.');
                return;
            }
            
            // Validate new password is different
            if (newPassword === currentPassword) {
                alert('❌ 새 비밀번호는 현재 비밀번호와 달라야 합니다.');
                return;
            }
            
            // Save new password
            localStorage.setItem('hillstone_admin_password', newPassword);
            
            closeChangePasswordModal();
            alert('✅ 비밀번호가 변경되었습니다!\n\n다음 로그인부터 새 비밀번호를 사용하세요.');
        });
    }

    // Modal close listeners for Change Password
    const closeChangePasswordModalBtn = document.getElementById('closeChangePasswordModal');
    if (closeChangePasswordModalBtn) {
        closeChangePasswordModalBtn.addEventListener('click', closeChangePasswordModal);
    }
    
    const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
    if (cancelChangePasswordBtn) {
        cancelChangePasswordBtn.addEventListener('click', closeChangePasswordModal);
    }
}

// ========================================
// Data Management
// ========================================

function loadPressItems() {
    const stored = localStorage.getItem('hillstone_press_items');
    if (stored) {
        try {
            pressItems = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored data:', e);
            pressItems = [];
        }
    } else {
        pressItems = [];
    }
}

function savePressItems() {
    localStorage.setItem('hillstone_press_items', JSON.stringify(pressItems));
}

// ========================================
// Statistics
// ========================================

function updateStats() {
    const total = pressItems.length;
    const articles = pressItems.filter(item => 
        item.category === 'article' || item.category === 'foreign'
    ).length;
    const photos = pressItems.filter(item => item.category === 'photo').length;
    const videos = pressItems.filter(item => item.category === 'video').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statArticles').textContent = articles;
    document.getElementById('statPhotos').textContent = photos;
    document.getElementById('statVideos').textContent = videos;
}

// ========================================
// Render Admin Items List
// ========================================

function renderAdminItems() {
    const tbody = document.getElementById('adminItemsList');
    const emptyState = document.getElementById('emptyAdminState');

    if (pressItems.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Sort by date (newest first)
    const sortedItems = [...pressItems].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    tbody.innerHTML = sortedItems.map(item => createAdminItemRow(item)).join('');

    // Add event listeners to action buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.id;
            openEditModal(itemId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.id;
            deleteItem(itemId);
        });
    });
}

// ========================================
// Create Admin Item Row
// ========================================

function createAdminItemRow(item) {
    const categoryLabels = {
        'article': '기사',
        'foreign': '해외기사',
        'photo': '공지',
        'video': '영상'
    };

    return `
        <tr>
            <td>
                <strong>${escapeHtml(item.title)}</strong>
            </td>
            <td>
                <span class="press-badge ${item.category}">
                    ${categoryLabels[item.category]}
                </span>
            </td>
            <td>${formatDate(item.date)}</td>
            <td>${escapeHtml(item.source)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-success btn-icon btn-edit" data-id="${item.id}" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-delete" data-id="${item.id}" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// ========================================
// Edit Modal Functions
// ========================================

function openEditModal(itemId = null) {
    editingItemId = itemId;
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('editForm');

    if (itemId) {
        // Edit mode
        const item = pressItems.find(i => i.id === itemId);
        if (!item) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> 항목 수정';
        document.getElementById('editId').value = item.id;
        document.getElementById('editTitle').value = item.title;
        document.getElementById('editCategory').value = item.category;
        document.getElementById('editDate').value = item.date;
        document.getElementById('editSource').value = item.source;
        document.getElementById('editSummary').value = item.summary;
        document.getElementById('editLink').value = item.link || '';
        
        // Load images based on category
        if (item.category === 'photo' && item.images && item.images.length > 0) {
            loadMultipleImages(item.images);
        } else {
            document.getElementById('editImage').value = item.image || '';
        }
        
        toggleImageInputs(item.category);
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> 새 항목 추가';
        form.reset();
        document.getElementById('editId').value = '';
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('editDate').value = today;
        
        // Reset image inputs
        resetImageInputs();
        toggleImageInputs('');
    }

    modal.classList.add('active');
}

function closeEditModalFunc() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    editingItemId = null;
}

// ========================================
// Save Item (Create or Update)
// ========================================

function saveItem() {
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value.trim();
    const category = document.getElementById('editCategory').value;
    const date = document.getElementById('editDate').value;
    const source = document.getElementById('editSource').value.trim();
    const summary = document.getElementById('editSummary').value.trim();
    const link = document.getElementById('editLink').value.trim();

    if (!title || !category || !date || !source) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    const item = {
        id: id || generateId(),
        title,
        category,
        date,
        source,
        summary,
        link
    };

    // Handle images based on category
    if (category === 'photo') {
        // Get all image URLs for photo category
        const imageInputs = document.querySelectorAll('#multipleImagesGroup .image-url-input');
        const images = Array.from(imageInputs)
            .map(input => input.value.trim())
            .filter(url => url !== '');
        item.images = images;
        item.image = images.length > 0 ? images[0] : ''; // Keep first image for backward compatibility
    } else {
        // Single image for other categories
        const image = document.getElementById('editImage').value.trim();
        item.image = image;
        item.images = [];
    }

    if (id) {
        // Update existing item
        const index = pressItems.findIndex(i => i.id === id);
        if (index !== -1) {
            pressItems[index] = item;
        }
    } else {
        // Add new item
        pressItems.push(item);
    }

    savePressItems();
    updateStats();
    renderAdminItems();
    closeEditModalFunc();

    // Show success message
    alert(id ? '항목이 수정되었습니다.' : '새 항목이 추가되었습니다.');
}

// ========================================
// Delete Item
// ========================================

function deleteItem(itemId) {
    const item = pressItems.find(i => i.id === itemId);
    if (!item) return;

    if (confirm(`"${item.title}" 항목을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
        pressItems = pressItems.filter(i => i.id !== itemId);
        savePressItems();
        updateStats();
        renderAdminItems();
        alert('항목이 삭제되었습니다.');
    }
}

// ========================================
// Image Input Functions
// ========================================

function toggleImageInputs(category) {
    const singleImageGroup = document.getElementById('singleImageGroup');
    const multipleImagesGroup = document.getElementById('multipleImagesGroup');
    
    if (category === 'photo') {
        singleImageGroup.style.display = 'none';
        multipleImagesGroup.style.display = 'block';
    } else {
        singleImageGroup.style.display = 'block';
        multipleImagesGroup.style.display = 'none';
    }
}

function addImageUrlInput() {
    const container = document.getElementById('imageUrlsContainer');
    const newInput = document.createElement('div');
    newInput.className = 'image-url-item';
    newInput.innerHTML = `
        <input type="url" class="image-url-input" placeholder="https://example.com/image.jpg">
        <button type="button" class="btn-remove-image">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newInput);
    
    // Add event listener to remove button
    const removeBtn = newInput.querySelector('.btn-remove-image');
    removeBtn.addEventListener('click', function() {
        removeImageUrl(this);
    });
}

function removeImageUrl(button) {
    const container = document.getElementById('imageUrlsContainer');
    const items = container.querySelectorAll('.image-url-item');
    
    // Keep at least one input
    if (items.length > 1) {
        button.closest('.image-url-item').remove();
    } else {
        alert('최소 1개의 이미지 입력란이 필요합니다.');
    }
}

function resetImageInputs() {
    const container = document.getElementById('imageUrlsContainer');
    container.innerHTML = `
        <div class="image-url-item">
            <input type="url" class="image-url-input" placeholder="https://example.com/image1.jpg">
            <button type="button" class="btn-remove-image">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add event listener to remove button
    const removeBtn = container.querySelector('.btn-remove-image');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            removeImageUrl(this);
        });
    }
}

function loadMultipleImages(images) {
    const container = document.getElementById('imageUrlsContainer');
    container.innerHTML = '';
    
    if (images.length === 0) {
        resetImageInputs();
        return;
    }
    
    images.forEach((imageUrl, index) => {
        const newInput = document.createElement('div');
        newInput.className = 'image-url-item';
        newInput.innerHTML = `
            <input type="url" class="image-url-input" placeholder="https://example.com/image.jpg" value="${escapeHtml(imageUrl)}">
            <button type="button" class="btn-remove-image">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newInput);
        
        // Add event listener to remove button
        const removeBtn = newInput.querySelector('.btn-remove-image');
        removeBtn.addEventListener('click', function() {
            removeImageUrl(this);
        });
    });
}

// ========================================
// Utility Functions
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========================================
// GitHub API Integration
// ========================================

// GitHub Settings
function loadGithubSettings() {
    const settings = localStorage.getItem('hillstone_github_settings');
    if (settings) {
        try {
            return JSON.parse(settings);
        } catch (e) {
            console.error('Error parsing GitHub settings:', e);
        }
    }
    return {
        token: '',
        owner: 'harhie',
        repo: 'hillstone-presskit',
        branch: 'main'
    };
}

function saveGithubSettings(settings) {
    localStorage.setItem('hillstone_github_settings', JSON.stringify(settings));
}

// GitHub Settings Modal
function openGithubSettingsModal() {
    const modal = document.getElementById('githubSettingsModal');
    const settings = loadGithubSettings();
    
    document.getElementById('githubToken').value = settings.token;
    document.getElementById('githubOwner').value = settings.owner;
    document.getElementById('githubRepo').value = settings.repo;
    document.getElementById('githubBranch').value = settings.branch;
    
    modal.classList.add('active');
}

function closeGithubSettingsModal() {
    const modal = document.getElementById('githubSettingsModal');
    modal.classList.remove('active');
}

// ========================================
// Change Password Modal Functions
// ========================================

function openChangePasswordModal() {
    console.log('🔑 openChangePasswordModal 함수 호출됨');
    const modal = document.getElementById('changePasswordModal');
    console.log('🔍 changePasswordModal 요소:', modal);
    
    if (!modal) {
        console.error('❌ changePasswordModal을 찾을 수 없습니다!');
        alert('비밀번호 변경 모달을 찾을 수 없습니다. 페이지를 새로고침 해주세요.');
        return;
    }
    
    const form = document.getElementById('changePasswordForm');
    console.log('🔍 changePasswordForm 요소:', form);
    
    if (form) {
        form.reset();
    }
    
    modal.classList.add('active');
    console.log('✅ 모달 열림 - active 클래스 추가됨');
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    modal.classList.remove('active');
}

// ========================================
// GitHub Sync Function
// ========================================

// Proper UTF-8 to Base64 encoding for GitHub API
function base64EncodeUnicode(str) {
    // First, encode the string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(str);
    
    // Convert bytes to binary string
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    
    // Encode binary string to base64
    return btoa(binaryString);
}

async function syncToGithub(retryCount = 0) {
    const settings = loadGithubSettings();
    
    console.log('=== GitHub 동기화 시작 ===');
    if (retryCount > 0) {
        console.log(`🔄 재시도 ${retryCount}회`);
    }
    console.log('Settings:', {
        hasToken: !!settings.token,
        tokenPrefix: settings.token ? settings.token.substring(0, 4) + '...' : 'none',
        owner: settings.owner,
        repo: settings.repo,
        branch: settings.branch
    });
    
    if (!settings.token) {
        alert('GitHub 설정이 필요합니다. "GitHub 설정" 버튼을 클릭하여 Token을 입력하세요.');
        openGithubSettingsModal();
        return;
    }
    
    const syncBtn = document.getElementById('githubSyncBtn');
    const originalText = syncBtn.innerHTML;
    
    try {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 동기화 중...';
        
        // Get current press items
        const items = pressItems;
        console.log('총 기사 수:', items.length);
        console.log('첫 번째 기사:', items[0]);
        console.log('마지막 기사:', items[items.length - 1]);
        
        // Convert to JavaScript code
        const jsCode = generateGetSampleDataCode(items);
        console.log('생성된 코드 길이:', jsCode.length, 'characters');
        console.log('생성된 코드 미리보기 (처음 500자):', jsCode.substring(0, 500));
        
        // Get current main.js file from GitHub (항상 최신 버전 가져오기)
        const getFileUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/js/main.js?ref=${settings.branch}&_=${Date.now()}`;
        console.log('GET 요청 URL:', getFileUrl);
        
        const getResponse = await fetch(getFileUrl, {
            headers: {
                'Authorization': `token ${settings.token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            cache: 'no-cache'
        });
        
        console.log('GET 응답 상태:', getResponse.status, getResponse.statusText);
        
        let fileSha = null;
        let newContent = '';
        
        if (getResponse.status === 404) {
            // 파일이 없으면 새로 생성
            console.log('⚠️ js/main.js 파일이 없습니다. 새로 생성합니다.');
            newContent = createNewMainJs(jsCode);
            console.log('새로 생성된 파일 크기:', newContent.length, 'bytes');
            console.log('생성된 파일 내용 미리보기 (getSampleData 부분):', 
                newContent.match(/function getSampleData\(\)[\s\S]{0,1000}/)?.[0] || 'NOT FOUND');
        } else if (!getResponse.ok) {
            const errorBody = await getResponse.text();
            console.error('GET 에러 상세:', errorBody);
            throw new Error(`GitHub API Error: ${getResponse.status} ${getResponse.statusText}\n상세: ${errorBody}`);
        } else {
            // 파일이 있으면 업데이트
            const fileData = await getResponse.json();
            console.log('📄 파일 데이터 전체:', fileData);
            console.log('파일 정보:', {
                name: fileData.name,
                size: fileData.size,
                sha: fileData.sha ? fileData.sha.substring(0, 8) + '...' : 'NO SHA!'
            });
            
            if (!fileData.sha) {
                console.error('❌ fileData.sha가 없습니다!');
                throw new Error('GitHub에서 받은 파일 데이터에 sha가 없습니다.');
            }
            
            fileSha = fileData.sha;
            console.log('✅ fileSha 설정됨:', fileSha.substring(0, 8) + '...');
            
            const currentContent = atob(fileData.content);
            console.log('현재 파일 크기:', currentContent.length, 'bytes');
            
            // Replace getSampleData function
            newContent = replaceGetSampleData(currentContent, jsCode);
            console.log('새 파일 크기:', newContent.length, 'bytes');
            console.log('새 파일 내용 미리보기 (getSampleData 부분):', 
                newContent.match(/function getSampleData\(\)[\s\S]{0,1000}/)?.[0] || 'NOT FOUND');
        }
        
        // Create or Update file on GitHub
        const updateUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/js/main.js`;
        console.log('PUT 요청 URL:', updateUrl);
        console.log('🔍 fileSha 값:', fileSha);
        
        const requestBody = {
            message: fileSha 
                ? `Update press items (${items.length} items) - Admin Sync`
                : `Create main.js with ${items.length} press items`,
            content: base64EncodeUnicode(newContent),
            branch: settings.branch
        };
        
        // sha는 파일이 이미 존재할 때만 필요
        if (fileSha) {
            requestBody.sha = fileSha;
            console.log('✅ sha 추가됨:', fileSha.substring(0, 8) + '...');
        } else {
            console.log('⚠️ sha 없음 (새 파일 생성)');
        }
        
        console.log('📤 요청 Body:', {
            message: requestBody.message,
            hasSha: !!requestBody.sha,
            branch: requestBody.branch,
            contentLength: requestBody.content.length
        });
        
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${settings.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('PUT 응답 상태:', updateResponse.status, updateResponse.statusText);
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            console.error('PUT 에러 상세:', errorData);
            
            // SHA 충돌 감지 - 파일이 변경되었음
            if (errorData.message && (errorData.message.includes('does not match') || errorData.message.includes('but expected'))) {
                console.error('⚠️ SHA 충돌 감지! 파일이 변경되었습니다.');
                
                // 최대 3번까지 재시도
                if (retryCount < 3) {
                    console.log(`🔄 1초 후 자동 재시도... (${retryCount + 1}/3)`);
                    syncBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 재시도 중... (${retryCount + 1}/3)`;
                    
                    // 1초 대기 후 재시도
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // 버튼 상태 복원
                    syncBtn.disabled = false;
                    syncBtn.innerHTML = originalText;
                    
                    // 재귀 호출로 재시도
                    return await syncToGithub(retryCount + 1);
                } else {
                    throw new Error('SHA 충돌: 3번 재시도 후에도 실패했습니다.\n다른 곳에서 파일을 수정 중일 수 있습니다.');
                }
            }
            
            throw new Error(`Failed to update: ${errorData.message}`);
        }
        
        const updateData = await updateResponse.json();
        console.log('업데이트 완료:', updateData.commit.sha.substring(0, 8) + '...');
        console.log('=== GitHub 동기화 완료 ===');
        
        alert('✅ GitHub 동기화 완료!\n\n변경사항이 웹사이트에 반영되었습니다.\n(GitHub Pages 배포는 1-2분 소요될 수 있습니다)');
        
    } catch (error) {
        console.error('=== GitHub 동기화 실패 ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        
        let errorMsg = error.message;
        
        // 구체적인 에러 메시지 추가
        if (errorMsg.includes('401')) {
            errorMsg += '\n\n💡 Token이 잘못되었거나 만료되었습니다.\n새 Token을 생성하여 다시 설정하세요.';
        } else if (errorMsg.includes('404')) {
            errorMsg += '\n\n💡 Repository 정보를 확인하세요:\n- Owner: harhie\n- Repo: hillstone-presskit\n- Branch: main';
        } else if (errorMsg.includes('403')) {
            errorMsg += '\n\n💡 Token 권한을 확인하세요:\n- repo 권한이 필요합니다.';
        }
        
        alert(`❌ 동기화 실패\n\n${errorMsg}\n\n콘솔(F12)에서 상세 로그를 확인하세요.`);
    } finally {
        syncBtn.disabled = false;
        syncBtn.innerHTML = originalText;
    }
}

// Generate getSampleData function code
function generateGetSampleDataCode(items) {
    const itemsCode = items.map(item => {
        return `        {
            id: '${item.id}',
            title: '${escapeForJs(item.title)}',
            category: '${item.category}',
            date: '${item.date}',
            source: '${escapeForJs(item.source)}',
            summary: '${escapeForJs(item.summary)}',
            link: '${item.link || ''}',
            image: '${item.image || ''}',
            images: ${JSON.stringify(item.images || [])}
        }`;
    }).join(',\n');
    
    return `return [\n${itemsCode}\n    ];`;
}

// Escape string for JavaScript
function escapeForJs(str) {
    if (!str) return '';
    return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

// Replace getSampleData function in main.js
function replaceGetSampleData(content, newCode) {
    const regex = /function getSampleData\(\) \{[\s\S]*?return \[[\s\S]*?\];[\s\S]*?\}/;
    const replacement = `function getSampleData() {\n    ${newCode}\n}`;
    
    if (regex.test(content)) {
        return content.replace(regex, replacement);
    } else {
        throw new Error('getSampleData 함수를 찾을 수 없습니다.');
    }
}

// Create new main.js file with getSampleData
function createNewMainJs(dataCode) {
    return `// ========================================
// Hillstone Partners Press Kit
// Public Page Script (Auto-generated by Admin)
// ========================================

let currentPage = 1;
const itemsPerPage = 5;
let currentCategory = 'all';
let allItems = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPressItems();
    initializeEventListeners();
});

function initializeEventListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            renderPressItems();
        });
    });
}

function loadPressItems() {
    const stored = localStorage.getItem('hillstone_press_items');
    if (stored) {
        try {
            allItems = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored data:', e);
            allItems = getSampleData();
        }
    } else {
        allItems = getSampleData();
    }
    updateCategoryCounts();
    renderPressItems();
}

function getSampleData() {
    ${dataCode}
}

function updateCategoryCounts() {
    const counts = {
        all: allItems.length,
        article: allItems.filter(item => item.category === 'article').length,
        foreign: allItems.filter(item => item.category === 'foreign').length,
        photo: allItems.filter(item => item.category === 'photo').length,
        video: allItems.filter(item => item.category === 'video').length
    };
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const category = btn.dataset.category;
        const text = btn.textContent.split('(')[0].trim();
        btn.textContent = \`\${text}(\${counts[category]})\`;
    });
}

function renderPressItems() {
    const container = document.getElementById('pressItemsContainer');
    const emptyState = document.getElementById('emptyState');
    let filteredItems = currentCategory === 'all' ? allItems : allItems.filter(item => item.category === currentCategory);
    filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filteredItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    emptyState.style.display = 'none';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, endIndex);
    container.innerHTML = pageItems.map(item => createItemHTML(item)).join('');
    renderPagination(filteredItems.length);
    attachItemClickHandlers();
}

function createItemHTML(item) {
    const categoryLabels = {article: '기사', foreign: '해외기사', photo: '공지', video: '영상'};
    const categoryIcons = {article: 'fa-newspaper', foreign: 'fa-globe', photo: 'fa-bullhorn', video: 'fa-video'};
    return \`
        <div class="press-item" data-id="\${item.id}">
            <div class="press-item-header">
                <h3 class="press-item-title">\${escapeHtml(item.title)}</h3>
                <span class="press-badge press-badge-\${item.category}">
                    <i class="fas \${categoryIcons[item.category]}"></i>
                    \${categoryLabels[item.category]}
                </span>
            </div>
            <div class="press-item-meta">
                <span><i class="fas fa-calendar"></i> \${item.date}</span>
                <span><i class="fas fa-building"></i> \${escapeHtml(item.source)}</span>
            </div>
            \${item.summary ? \`<p class="press-item-summary">\${escapeHtml(item.summary)}</p>\` : ''}
        </div>
    \`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function attachItemClickHandlers() {
    document.querySelectorAll('.press-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const itemData = allItems.find(i => i.id === itemId);
            if (itemData && itemData.link) {
                window.open(itemData.link, '_blank');
            }
        });
    });
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    pagination.style.display = 'flex';
    let paginationHTML = '';
    if (currentPage > 1) {
        paginationHTML += \`<button class="pagination-btn" onclick="changePage(\${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>\`;
    }
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += \`<button class="pagination-btn active">\${i}</button>\`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += \`<button class="pagination-btn" onclick="changePage(\${i})">\${i}</button>\`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += \`<span class="pagination-ellipsis">...</span>\`;
        }
    }
    if (currentPage < totalPages) {
        paginationHTML += \`<button class="pagination-btn" onclick="changePage(\${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>\`;
    }
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderPressItems();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
`;
}
