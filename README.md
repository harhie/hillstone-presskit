# Hillstone Partners - Press Kit

힐스톤파트너스 공식 프레스킷 및 뉴스룸 웹사이트

## 🌟 주요 기능

### 공개 페이지 (newsroom.html)
- ✅ 언론 보도 기사 열람
- ✅ 카테고리별 필터링 (전체/기사/해외기사/공지/영상)
- ✅ 카테고리별 개수 표시
- ✅ 페이지네이션 (5개씩)
- ✅ 기사 클릭 시 원문 바로가기
- ✅ 공지 카테고리 다중 이미지 갤러리
- ✅ iframe 자동 높이 조절

### 관리자 페이지 (newsroom-admin.html)
- ✅ 기사 추가/수정/삭제 (CRUD)
- ✅ 통계 대시보드
- ✅ 다중 이미지 업로드 (공지 카테고리)
- ✅ 요약 필드 선택 사항
- ✅ **GitHub 자동 동기화** ⭐ NEW!
- ✅ LocalStorage 기반 데이터 관리

## 🚀 GitHub 동기화 기능 (NEW!)

### 작동 원리
1. 관리자 페이지에서 기사 추가/수정/삭제
2. **"GitHub에 동기화"** 버튼 클릭
3. `js/main.js` 파일 자동 업데이트
4. GitHub 저장소에 커밋
5. **모든 사용자에게 변경사항 반영** 🎉

### 설정 방법
1. [GitHub Token 생성 가이드](GITHUB_TOKEN_SETUP.md) 참고
2. 관리자 페이지 → "GitHub 설정" 클릭
3. Token 및 저장소 정보 입력
4. 저장 완료!

### 장점
- ✅ 어디서든 동일한 데이터 표시
- ✅ 브라우저/기기 제약 없음
- ✅ 자동 배포 (GitHub Pages)
- ✅ 버전 관리 (Git 히스토리)

## 📁 파일 구조

```
hillstone-presskit/
├── index.html              # 메인 홈페이지 (한국어)
├── index_en.html           # 메인 홈페이지 (영어)
├── newsroom.html           # 공개 프레스킷 페이지
├── newsroom-admin.html     # 관리자 페이지
├── export-data.html        # 데이터 추출 도구
├── css/
│   └── style.css          # 스타일시트
├── js/
│   ├── main.js            # 공개 페이지 로직
│   └── admin.js           # 관리자 페이지 로직 + GitHub API
├── images/
│   └── newsroom-logo.jpg  # 로고
├── GITHUB_TOKEN_SETUP.md     # GitHub Token 생성 가이드
├── ADMIN_GUIDE.md            # 관리자 사용 가이드
├── ENCODING_FIX_GUIDE.md     # UTF-8 인코딩 문제 해결 가이드
├── QUICK_START_FIX.md        # 빠른 복구 가이드
├── AUTO-FIX-AND-UPLOAD.html  # 자동 복구 도구 (권장)
├── fix-encoding-manual.html  # 수동 복구 도구
└── README.md                 # 프로젝트 문서
```

## 🎨 디자인

- **컬러 스킴**: Orange (#ff6b35)
- **Border Radius**: 4px
- **폰트**: Inter (Google Fonts)
- **아이콘**: Font Awesome 6.4.0
- **반응형**: 모바일 최적화

## 📊 데이터 구조

### 기사 객체
```javascript
{
    id: 'unique_id',              // 고유 ID
    title: '기사 제목',           // 필수
    category: 'article',          // 필수: article/foreign/photo/video
    date: '2023-05-23',          // 필수: YYYY-MM-DD
    source: '출처',               // 필수
    summary: '요약',              // 선택 (비어있어도 됨)
    link: 'https://...',         // 선택
    image: 'https://...',        // 선택 (단일 이미지)
    images: ['url1', 'url2']     // 선택 (공지 카테고리 다중 이미지)
}
```

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 반응형
- **JavaScript (ES6+)**: 비동기, 이벤트 처리
- **LocalStorage**: 클라이언트 데이터 저장
- **GitHub API**: 자동 파일 업데이트
- **Font Awesome**: 아이콘
- **Google Fonts**: 웹 폰트

## 📖 사용 가이드

### 공개 페이지 접속
```
https://[your-domain]/newsroom.html
```

### 관리자 페이지 접속
```
https://[your-domain]/newsroom-admin.html
비밀번호: admin123
```

### GitHub 동기화 설정
1. [GitHub Token 생성](GITHUB_TOKEN_SETUP.md)
2. 관리자 페이지 로그인
3. "GitHub 설정" 클릭
4. Token 입력 및 저장

### 기사 추가 워크플로우
1. 관리자 로그인
2. "+ 새 항목 추가" 클릭
3. 기사 정보 입력
4. "저장" 클릭
5. **"GitHub에 동기화"** 클릭 ⭐
6. 완료!

## 🔐 보안

### GitHub Token
- ✅ LocalStorage에 암호화 없이 저장 (클라이언트 전용)
- ✅ 비밀번호 타입 입력란
- ⚠️ 절대 코드에 하드코딩하지 마세요
- ⚠️ 다른 사람과 공유하지 마세요
- ⚠️ Public 저장소에 커밋하지 마세요

### 관리자 비밀번호
- 기본값: `admin123`
- 프로덕션 환경에서는 변경 권장
- `js/admin.js` 파일의 `ADMIN_PASSWORD` 상수 수정

## 🐛 문제 해결

### ⚠️ UTF-8 인코딩 오류 (한글 깨짐)
**증상**: 카테고리 라벨이 "기사" 대신 "ÃÂÃ..." 등으로 표시됨

**해결 방법 1 - 자동 복구 도구 사용 (권장)**:
1. `AUTO-FIX-AND-UPLOAD.html` 파일을 브라우저에서 열기
2. GitHub 설정 입력 (Token, Owner, Repo, Branch)
3. "자동 복구 & 업로드 시작" 버튼 클릭
4. 완료! 브라우저 캐시 삭제 후 새로고침

**해결 방법 2 - 수동 복구**:
1. `fix-encoding-manual.html` 파일 열기
2. 각 단계별 안내에 따라 진행
3. 수정된 파일 다운로드 후 `js/` 폴더에 덮어쓰기

**원인**: GitHub API 업로드 시 UTF-8 인코딩 처리 오류

**예방**: `js/admin.js`에 `base64EncodeUnicode()` 함수가 추가되어 앞으로는 이 문제가 발생하지 않습니다.

### LocalStorage 초기화
```javascript
// 브라우저 콘솔에서 실행
localStorage.removeItem('hillstone_press_items');
localStorage.removeItem('hillstone_github_settings');
location.reload();
```

### GitHub 동기화 실패
1. Token 권한 확인 (`repo` 필수)
2. 저장소 정보 확인 (Owner/Repo/Branch)
3. Token 만료 여부 확인
4. [상세 가이드](ADMIN_GUIDE.md#-문제-해결) 참고

### 기사가 안 보임
1. LocalStorage에 데이터가 있는지 확인
2. `getSampleData()` 함수에 데이터가 있는지 확인
3. 브라우저 캐시 삭제 (Ctrl+Shift+R)

## 📈 현재 상태

### 완료된 기능
✅ 프레스킷 공개 페이지
✅ 관리자 CRUD 시스템
✅ 카테고리 필터링 및 개수 표시
✅ 페이지네이션 (5개씩)
✅ 공지 다중 이미지 갤러리
✅ 요약 필드 선택 사항
✅ iframe 자동 높이 조절
✅ **GitHub API 자동 동기화** ⭐

### 진행 중
- 데이터 백업 시스템
- 관리자 권한 레벨 구분

### 향후 계획
- 이미지 자동 업로드 (Cloudinary 연동)
- 검색 기능 추가
- 엑셀 일괄 업로드
- 다국어 지원 (한/영)

## 🎯 배포

### GitHub Pages (자동)
- `main` 브랜치에 push 시 자동 배포
- URL: `https://[username].github.io/[repo]/`

### 커스텀 도메인
1. GitHub Repository → Settings → Pages
2. Custom domain 입력
3. DNS 설정 (CNAME 레코드)

## 📞 문의

- **Repository**: harhie/hillstone-presskit
- **Issues**: GitHub Issues 탭
- **Documentation**: [관리자 가이드](ADMIN_GUIDE.md)

## 📜 라이선스

Copyright © 2024 Hillstone Partners. All rights reserved.

---

**최종 업데이트**: 2024년 11월  
**버전**: 2.0 (GitHub 동기화 추가)  
**작성자**: Hillstone Partners IT Team
