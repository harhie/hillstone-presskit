# GitHub Personal Access Token 생성 가이드

프레스킷 어드민에서 GitHub 자동 업데이트 기능을 사용하려면 GitHub Personal Access Token이 필요합니다.

## 📝 Token 생성 단계

### 1. GitHub 설정 페이지 이동

1. GitHub에 로그인: https://github.com
2. 오른쪽 상단 프로필 클릭 → **Settings** 클릭
3. 왼쪽 메뉴 맨 아래 **Developer settings** 클릭
4. **Personal access tokens** → **Tokens (classic)** 클릭
5. **Generate new token** → **Generate new token (classic)** 클릭

### 2. Token 설정

**Note (토큰 이름)**:
```
Hillstone Presskit Admin
```

**Expiration (만료일)**:
- `No expiration` 선택 (권장: 90 days)

**Select scopes (권한 선택)**:
- ✅ `repo` (전체 체크) - 저장소 전체 접근 권한
  - repo:status
  - repo_deployment
  - public_repo
  - repo:invite
  - security_events

### 3. Token 생성 및 복사

1. 페이지 하단 **Generate token** 버튼 클릭
2. 생성된 토큰이 표시됩니다 (예: `ghp_xxxxxxxxxxxxxxxxxxxx`)
3. ⚠️ **즉시 복사하세요!** 페이지를 벗어나면 다시 볼 수 없습니다
4. 안전한 곳에 보관하세요

## 🔐 Token 사용 방법

### 어드민 페이지에서 설정

1. `newsroom-admin.html` 로그인
2. 상단 **"GitHub 설정"** 버튼 클릭
3. 다음 정보 입력:
   - **GitHub Token**: 위에서 복사한 토큰 (ghp_로 시작)
   - **Repository Owner**: `harhie`
   - **Repository Name**: `hillstone-presskit`
   - **Branch**: `main`
4. **"설정 저장"** 클릭

### GitHub 동기화 사용

1. 어드민에서 기사 추가/수정/삭제
2. **"GitHub에 동기화"** 버튼 클릭
3. 자동으로 `js/main.js` 파일이 업데이트됩니다
4. 완료 메시지 확인

## ⚠️ 보안 주의사항

### 중요!

- **Token은 절대 공개하지 마세요**
- **코드에 직접 하드코딩하지 마세요**
- **다른 사람과 공유하지 마세요**

### Token이 노출된 경우

1. GitHub Settings → Developer settings
2. Personal access tokens
3. 해당 토큰 찾아서 **Delete** 클릭
4. 새 토큰 재생성

## 🔧 문제 해결

### "Bad credentials" 오류
- Token이 잘못되었거나 만료됨
- 새 Token 생성 필요

### "Not Found" 오류
- Repository 정보 확인 (소유자/이름/브랜치)
- Token 권한 확인 (`repo` 권한 필수)

### 동기화 후 변경사항이 안 보임
- GitHub Pages 배포는 1-2분 소요
- 브라우저 캐시 삭제 후 새로고침

## 📞 지원

문제가 계속되면 GitHub 저장소 Issues 탭에 문의하세요.
