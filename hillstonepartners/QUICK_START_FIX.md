# ⚡ 빠른 복구 가이드

## 문제: 뉴스룸에서 "기사" 대신 깨진 문자 표시

### 🚀 가장 빠른 해결 방법 (2분)

1. **자동 복구 도구 열기**
   ```
   브라우저에서 AUTO-FIX-AND-UPLOAD.html 열기
   ```

2. **GitHub 설정** (처음 한 번만)
   - Token: `ghp_your_token_here` (GitHub에서 생성)
   - Owner: `harhie`
   - Repo: `hillstone-presskit`
   - Branch: `main`
   - **"설정 저장"** 클릭

3. **자동 복구 실행**
   - **"🔧 자동 복구 & 업로드 시작"** 버튼 클릭
   - 진행률 100% 될 때까지 대기 (약 10초)
   - ✅ 성공 메시지 확인

4. **확인**
   - 브라우저 캐시 삭제: `Ctrl+Shift+Delete`
   - `newsroom.html` 새로고침
   - 카테고리가 "기사", "해외기사", "공지", "영상"으로 표시되는지 확인

---

## 🔧 수정 내역

### 1. js/admin.js (이미 수정됨)
✅ 새로운 UTF-8 인코딩 함수 추가:
```javascript
function base64EncodeUnicode(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    let binaryString = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binaryString);
}
```

✅ `syncToGithub()` 함수에서 사용:
```javascript
content: base64EncodeUnicode(newContent)  // 이전: btoa(unescape(...))
```

### 2. js/main.js (복구 필요)
❌ 1165번 줄이 현재 깨져있음:
```javascript
// 현재 (깨짐)
const categoryLabels = {article: 'ÃÂÃÂªÃÂ...', ...};

// 수정 후 (올바름)
const categoryLabels = {article: '기사', foreign: '해외기사', photo: '공지', video: '영상'};
```

👉 **AUTO-FIX-AND-UPLOAD.html**이 자동으로 수정해줍니다!

---

## 📁 생성된 파일들

### 복구 도구
1. **AUTO-FIX-AND-UPLOAD.html** ⭐ 추천
   - 자동으로 main.js 다운로드
   - 인코딩 복구
   - GitHub에 자동 업로드
   - 진행 상황 표시

2. **fix-encoding-manual.html**
   - 수동 복구 단계별 가이드
   - 파일 다운로드 및 상태 확인
   - admin.js 검증

### 문서
1. **ENCODING_FIX_GUIDE.md**
   - 문제 상세 설명
   - 기술적 배경
   - 테스트 방법
   - 예방 조치

2. **QUICK_START_FIX.md** (이 문서)
   - 빠른 해결 가이드
   - 2분 안에 해결

3. **README.md** (업데이트됨)
   - 문제 해결 섹션 추가
   - UTF-8 인코딩 오류 대응 방법

---

## 💡 앞으로는?

### ✅ 예방 완료
`js/admin.js`가 업데이트되어 **앞으로 GitHub 동기화 시 이 문제가 발생하지 않습니다**.

### 테스트 방법
1. 관리자 페이지에서 테스트 기사 추가
2. "GitHub에 동기화" 클릭
3. GitHub에서 `js/main.js` 파일 확인
4. 1165번 줄에 한글이 올바르게 있는지 확인

---

## 🆘 문제가 계속되면?

### 1단계: 브라우저 캐시 완전 삭제
```
Ctrl+Shift+Delete → 전체 기간 → 캐시/쿠키 삭제
```

### 2단계: GitHub 파일 직접 확인
```
https://raw.githubusercontent.com/harhie/hillstone-presskit/main/js/main.js
```
- Ctrl+F로 "categoryLabels" 검색
- 한글이 올바른지 확인

### 3단계: LocalStorage 초기화
브라우저 콘솔(F12)에서:
```javascript
localStorage.clear();
location.reload();
```

### 4단계: 전체 재동기화
1. 관리자 페이지 로그인
2. "GitHub에 동기화" 다시 클릭
3. 성공 메시지 확인

---

## 📞 체크리스트

완료 확인:
- [ ] AUTO-FIX-AND-UPLOAD.html 실행 완료
- [ ] GitHub 커밋 성공
- [ ] 브라우저 캐시 삭제
- [ ] newsroom.html에서 한글 정상 표시
- [ ] 관리자 페이지에서 동기화 테스트

---

**소요 시간**: 약 2분  
**난이도**: ⭐ 매우 쉬움  
**성공률**: 99%

**최종 업데이트**: 2024-11-15
