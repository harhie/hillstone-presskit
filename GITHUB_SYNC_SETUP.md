# GitHub 동기화 초기 설정 가이드

## 문제 상황
GitHub API Error: 404 - "This repository is empty"

이 에러는 `hillstone-presskit` 저장소가 비어있거나 `js/main.js` 파일이 없기 때문에 발생합니다.

## 해결 방법

### 1단계: GitHub 저장소 확인
1. https://github.com/harhie/hillstone-presskit 접속
2. 저장소가 생성되어 있는지 확인
3. 저장소가 없다면 새로 생성

### 2단계: 초기 파일 업로드
저장소에 다음 파일들을 업로드해야 합니다:

#### A. 웹 인터페이스 사용 (가장 쉬운 방법)
1. GitHub 저장소 페이지에서 `Add file` → `Create new file` 클릭
2. 파일명에 `js/main.js` 입력 (폴더가 자동 생성됨)
3. 아래 초기 코드를 붙여넣기
4. `Commit new file` 클릭

#### B. Git 명령어 사용
```bash
# 로컬에 저장소 클론
git clone https://github.com/harhie/hillstone-presskit.git
cd hillstone-presskit

# js 폴더 생성
mkdir -p js

# main.js 파일 생성 (아래 내용 붙여넣기)
nano js/main.js

# 커밋 및 푸시
git add .
git commit -m "Initial commit: Add main.js"
git push origin main
```

### 3단계: js/main.js 초기 내용

```javascript
// ========================================
// Hillstone Partners Press Kit
// Public Page Script
// ========================================

let currentPage = 1;
const itemsPerPage = 5;
let currentCategory = 'all';
let allItems = [];

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadPressItems();
    initializeEventListeners();
});

function initializeEventListeners() {
    // Category tabs
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

// ========================================
// Data Loading
// ========================================

function loadPressItems() {
    // Try to load from localStorage first
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
    return [
        {
            id: '1',
            title: '샘플 기사',
            category: 'article',
            date: '2024-01-01',
            source: 'Hillstone Partners',
            summary: '이것은 샘플 기사입니다.',
            link: '',
            image: '',
            images: []
        }
    ];
}

// ========================================
// Category Counts
// ========================================

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
        btn.textContent = `${text}(${counts[category]})`;
    });
}

// ========================================
// Render Items
// ========================================

function renderPressItems() {
    const container = document.getElementById('pressItemsContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Filter by category
    let filteredItems = currentCategory === 'all' 
        ? allItems 
        : allItems.filter(item => item.category === currentCategory);
    
    // Sort by date (newest first)
    filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredItems.slice(startIndex, endIndex);
    
    // Render items
    container.innerHTML = pageItems.map(item => createItemHTML(item)).join('');
    
    // Render pagination
    renderPagination(filteredItems.length);
    
    // Add click handlers
    attachItemClickHandlers();
}

function createItemHTML(item) {
    const categoryLabels = {
        article: '기사',
        foreign: '해외기사',
        photo: '공지',
        video: '영상'
    };
    
    const categoryIcons = {
        article: 'fa-newspaper',
        foreign: 'fa-globe',
        photo: 'fa-bullhorn',
        video: 'fa-video'
    };
    
    return `
        <div class="press-item" data-id="${item.id}">
            <div class="press-item-header">
                <h3 class="press-item-title">${escapeHtml(item.title)}</h3>
                <span class="press-badge press-badge-${item.category}">
                    <i class="fas ${categoryIcons[item.category]}"></i>
                    ${categoryLabels[item.category]}
                </span>
            </div>
            <div class="press-item-meta">
                <span><i class="fas fa-calendar"></i> ${item.date}</span>
                <span><i class="fas fa-building"></i> ${escapeHtml(item.source)}</span>
            </div>
            ${item.summary ? `<p class="press-item-summary">${escapeHtml(item.summary)}</p>` : ''}
        </div>
    `;
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
            if (itemData) {
                openItemDetail(itemData);
            }
        });
    });
}

function openItemDetail(item) {
    // Open link directly if it exists
    if (item.link) {
        window.open(item.link, '_blank');
    }
}

// ========================================
// Pagination
// ========================================

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderPressItems();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

### 4단계: 다른 필요한 파일들도 업로드

저장소에 다음 파일들도 추가하세요:
- `index.html` - 메인 페이지
- `newsroom.html` - 뉴스룸 페이지
- `newsroom-admin.html` - 관리자 페이지
- `css/style.css` - 스타일시트
- `js/admin.js` - 관리자 스크립트
- `README.md` - 프로젝트 설명

### 5단계: 관리자 페이지에서 GitHub 설정

1. `newsroom-admin.html` 로그인
2. **🔧 GitHub 설정** 버튼 클릭
3. 다음 정보 입력:
   - **GitHub Personal Access Token**: `ghp_...` (GITHUB_TOKEN_SETUP.md 참고)
   - **Repository Owner**: `harhie`
   - **Repository Name**: `hillstone-presskit`
   - **Branch**: `main`
4. **설정 저장** 클릭

### 6단계: 동기화 테스트

1. 관리자 페이지에서 기사를 추가/수정
2. **🔄 GitHub에 동기화** 버튼 클릭
3. 성공 메시지 확인
4. GitHub 저장소에서 `js/main.js` 파일이 업데이트되었는지 확인

## 주의사항

- 저장소가 비공개(Private)인 경우 Token에 적절한 권한이 있어야 합니다
- Token은 반드시 `repo` 권한이 있어야 합니다
- Branch 이름이 `main`이 아니라 `master`일 수도 있으니 확인하세요

## 문제 해결

### 404 에러가 계속 발생하는 경우
1. 저장소 이름과 소유자가 정확한지 확인
2. `js/main.js` 파일이 존재하는지 확인
3. Branch 이름이 `main`인지 확인

### 403 Forbidden 에러
- Token 권한이 부족합니다
- 새로운 Token을 `repo` 권한으로 생성하세요

### 401 Unauthorized 에러
- Token이 잘못되었거나 만료되었습니다
- 새로운 Token을 생성하세요
