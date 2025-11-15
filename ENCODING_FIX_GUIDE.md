# UTF-8 인코딩 문제 해결 가이드

## 🔍 문제 설명

### 증상
- 뉴스룸 페이지에서 카테고리 라벨이 한글 대신 깨진 문자로 표시됨
- 예: "기사" → "ÃÂÃÂÃÂªÃÂÃÂÃÂ¸ÃÂÃÂÃÂ°ÃÂÃÂÃÂ¬..."
- `js/main.js` 파일의 1165번 줄에서 발생

### 원인
1. **GitHub API 업로드 시 인코딩 오류**
   - 기존 방식: `btoa(unescape(encodeURIComponent(content)))`
   - 문제: UTF-8 한글을 올바르게 처리하지 못함

2. **영향 범위**
   - 관리자 페이지에서 "GitHub에 동기화" 실행 시
   - `js/main.js`의 `categoryLabels` 객체가 손상됨
   - 모든 사용자가 깨진 한글을 보게 됨

---

## ✅ 해결 방법

### 방법 1: 자동 복구 도구 (권장) ⭐

**파일**: `AUTO-FIX-AND-UPLOAD.html`

#### 단계:
1. **파일 열기**
   ```
   브라우저에서 AUTO-FIX-AND-UPLOAD.html 열기
   ```

2. **GitHub 설정**
   - GitHub Token 입력 (repo 권한 필요)
   - Owner: `harhie`
   - Repository: `hillstone-presskit`
   - Branch: `main`
   - "설정 저장" 클릭

3. **자동 복구 실행**
   - "자동 복구 & 업로드 시작" 버튼 클릭
   - 진행 상황 확인 (5단계)
   - 성공 메시지 확인

4. **확인**
   - 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
   - `newsroom.html` 새로고침
   - 카테고리 라벨이 "기사", "해외기사", "공지", "영상"으로 올바르게 표시되는지 확인

#### 작동 원리:
```javascript
// 1. 현재 main.js 다운로드
const content = await fetch('js/main.js').text();

// 2. categoryLabels 라인 찾아서 수정
lines[i] = "const categoryLabels = {article: '기사', foreign: '해외기사', photo: '공지', video: '영상'};";

// 3. 올바른 UTF-8 인코딩
const utf8Bytes = new TextEncoder().encode(fixedContent);
const base64 = btoa(String.fromCharCode(...utf8Bytes));

// 4. GitHub API로 업로드
await fetch(githubApiUrl, {
    method: 'PUT',
    body: JSON.stringify({
        content: base64,
        sha: currentFileSha
    })
});
```

---

### 방법 2: 수동 복구

**파일**: `fix-encoding-manual.html`

#### 단계:

**Step 1: 현재 상태 확인**
- "상태 확인" 버튼 클릭
- 1165번 줄의 내용 확인
- 인코딩 오류 여부 판단

**Step 2: 파일 다운로드 & 수정**
- "main.js 다운로드 & 복구" 버튼 클릭
- 수정된 `main.js` 파일이 자동 다운로드됨
- 다운로드된 파일을 프로젝트의 `js/` 폴더에 복사

**Step 3: admin.js 확인**
- "admin.js 확인" 버튼 클릭
- `base64EncodeUnicode` 함수가 있는지 확인
- 없다면 아래 "예방 조치" 섹션 참고

**Step 4: 테스트**
- 관리자 페이지에서 GitHub 동기화 테스트
- 뉴스룸 페이지에서 한글 표시 확인

---

### 방법 3: 직접 파일 수정

#### 3-1. main.js 직접 수정

**위치**: `js/main.js` 1165번 줄

**수정 전** (깨진 인코딩):
```javascript
const categoryLabels = {article: 'ÃÂÃÂÃÂªÃÂ...', foreign: 'ÃÂÃÂÃÂ­...', ...};
```

**수정 후** (올바른 한글):
```javascript
const categoryLabels = {article: '기사', foreign: '해외기사', photo: '공지', video: '영상'};
```

#### 3-2. GitHub에 직접 커밋

```bash
# 1. 파일 수정
nano js/main.js
# (1165번 줄을 위 내용으로 변경)

# 2. Git 커밋
git add js/main.js
git commit -m "Fix UTF-8 encoding for Korean categoryLabels"
git push origin main
```

---

## 🛡️ 예방 조치

### admin.js 업데이트

**위치**: `js/admin.js` 773번 줄 이후에 추가

```javascript
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
```

**사용 위치**: `syncToGithub()` 함수 내부 (880번 줄 근처)

**수정 전**:
```javascript
content: btoa(unescape(encodeURIComponent(newContent)))
```

**수정 후**:
```javascript
content: base64EncodeUnicode(newContent)
```

### 업데이트 확인

```javascript
// 브라우저 콘솔에서 실행
fetch('js/admin.js')
    .then(r => r.text())
    .then(text => {
        console.log('base64EncodeUnicode 함수 존재:', text.includes('base64EncodeUnicode'));
        console.log('구버전 인코딩 사용:', text.includes('btoa(unescape(encodeURIComponent'));
    });
```

---

## 🔬 기술적 설명

### 문제의 원인

1. **JavaScript의 btoa() 함수**
   - ASCII 문자열만 처리 가능
   - UTF-8 멀티바이트 문자(한글)는 오류 발생

2. **기존 인코딩 체인의 문제**
   ```javascript
   btoa(unescape(encodeURIComponent(str)))
   ```
   - `encodeURIComponent`: URL 인코딩 (% + hex)
   - `unescape`: URL 디코딩 (deprecated, 불완전)
   - `btoa`: Base64 인코딩
   - **문제**: `unescape`가 UTF-8을 올바르게 처리하지 못함

3. **결과**
   - 한글 "기사" → UTF-8 bytes: `0xEA 0xB8 0xB0 0xEC 0x82 0xAC`
   - 잘못된 인코딩 → "ÃÂÃÂÃÂª..." 등의 깨진 문자

### 올바른 해결책

```javascript
function base64EncodeUnicode(str) {
    // 1. TextEncoder로 UTF-8 바이트 배열 생성
    const utf8Bytes = new TextEncoder().encode(str);
    
    // 2. 바이트를 binary string으로 변환
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    
    // 3. Base64 인코딩
    return btoa(binaryString);
}
```

**장점**:
- ✅ UTF-8 완벽 지원
- ✅ 모든 언어 문자 처리
- ✅ TextEncoder는 현대 브라우저 표준
- ✅ GitHub API와 완벽 호환

---

## 📊 테스트

### 1. 인코딩 테스트

```javascript
// 브라우저 콘솔에서 실행
const testStr = "기사 해외기사 공지 영상";

// 구버전 (잘못된 방식)
const oldWay = btoa(unescape(encodeURIComponent(testStr)));
console.log('구버전:', oldWay);

// 신버전 (올바른 방식)
const utf8Bytes = new TextEncoder().encode(testStr);
let binaryString = '';
for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
}
const newWay = btoa(binaryString);
console.log('신버전:', newWay);

// 디코딩 테스트
const decoded = new TextDecoder().decode(
    Uint8Array.from(atob(newWay), c => c.charCodeAt(0))
);
console.log('디코딩 결과:', decoded);
console.log('일치 여부:', decoded === testStr);
```

### 2. GitHub 동기화 테스트

1. 관리자 페이지 로그인
2. 테스트 기사 추가:
   - 제목: "테스트 - 한글 인코딩 확인"
   - 카테고리: 기사
   - 날짜: 오늘
   - 출처: "테스트"
3. "GitHub에 동기화" 클릭
4. GitHub에서 `js/main.js` 파일 확인
5. 1165번 줄의 `categoryLabels` 확인
6. 한글이 올바르게 표시되는지 확인

### 3. 브라우저 호환성

| 브라우저 | TextEncoder | 지원 |
|---------|-------------|------|
| Chrome  | ✅ v38+     | 완벽 |
| Firefox | ✅ v19+     | 완벽 |
| Safari  | ✅ v10.1+   | 완벽 |
| Edge    | ✅ v79+     | 완벽 |
| IE 11   | ❌          | 미지원 |

---

## 🎯 체크리스트

### 복구 완료 확인

- [ ] `AUTO-FIX-AND-UPLOAD.html` 실행 완료
- [ ] GitHub에 성공적으로 커밋됨
- [ ] `js/main.js` 1165번 줄에 올바른 한글 확인
- [ ] `js/admin.js`에 `base64EncodeUnicode` 함수 존재
- [ ] 브라우저 캐시 삭제 완료
- [ ] `newsroom.html`에서 카테고리 라벨 한글 정상 표시
- [ ] 관리자 페이지에서 GitHub 동기화 테스트 성공

### 예방 조치 확인

- [ ] `js/admin.js`에서 구버전 인코딩 코드 제거됨
- [ ] 새로운 `base64EncodeUnicode` 함수 사용 중
- [ ] 테스트 기사로 동기화 테스트 완료
- [ ] GitHub 커밋 로그 확인

---

## 📞 추가 지원

### 문제가 계속되는 경우

1. **브라우저 캐시 완전 삭제**
   - Ctrl+Shift+Delete
   - 전체 기간 선택
   - 캐시/쿠키 삭제

2. **GitHub 파일 직접 확인**
   ```
   https://raw.githubusercontent.com/harhie/hillstone-presskit/main/js/main.js
   ```
   - 1165번 줄 검색
   - 한글 확인

3. **LocalStorage 초기화**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

4. **전체 재동기화**
   - 관리자 페이지에서 모든 기사 확인
   - "GitHub에 동기화" 다시 실행
   - 최신 `admin.js`가 적용되었는지 확인

---

## 📝 변경 이력

### 2024-11-15
- ✅ `base64EncodeUnicode()` 함수 추가
- ✅ `AUTO-FIX-AND-UPLOAD.html` 도구 생성
- ✅ `fix-encoding-manual.html` 도구 생성
- ✅ README.md 업데이트
- ✅ 이 가이드 문서 작성

### 향후 계획
- 자동 인코딩 테스트 추가
- CI/CD 파이프라인에 인코딩 검증 추가
- 다국어 지원 강화

---

**최종 업데이트**: 2024-11-15  
**작성자**: Hillstone Partners IT Team
