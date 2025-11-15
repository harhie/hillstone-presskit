# GitHub 동기화 후 로컬 파일 업데이트 방법

## 문제 상황
- 관리자 페이지에서 GitHub 동기화 성공 ✅
- GitHub 저장소의 `js/main.js`에 98개 기사가 있음 ✅
- 하지만 로컬의 `js/main.js`는 여전히 5개만 있음 ❌

## 해결 방법

### 방법 1: GitHub에서 직접 다운로드

1. **GitHub 저장소 접속**:
   - https://github.com/harhie/hillstone-presskit

2. **js/main.js 파일 찾기**:
   - `js` 폴더 클릭
   - `main.js` 클릭

3. **Raw 버튼 클릭**:
   - 우측 상단의 "Raw" 버튼 클릭
   - 전체 내용이 표시됨

4. **파일 저장**:
   - `Ctrl + S` (Windows/Linux) 또는 `Cmd + S` (Mac)
   - 로컬 프로젝트의 `js/main.js` 경로에 저장 (덮어쓰기)

5. **페이지 새로고침**:
   - `newsroom.html` 페이지를 `Ctrl + Shift + R`로 새로고침

### 방법 2: Git 명령어 사용 (더 간단)

프로젝트 폴더에서 터미널을 열고:

```bash
# 원격 저장소에서 최신 버전 가져오기
git pull origin main
```

### 방법 3: 관리자 페이지에서 다시 동기화

1. **관리자 페이지 로그인**
2. **LocalStorage 확인**:
   - F12 → Console 탭
   - 입력: `JSON.parse(localStorage.getItem('hillstone_press_items')).length`
   - 98이 나오는지 확인

3. **다시 동기화**:
   - "GitHub에 동기화" 버튼 클릭
   - 성공 메시지 확인

## 확인 방법

로컬 `js/main.js` 파일을 열어서:
- `function getSampleData()` 함수 찾기
- `return [` 다음에 몇 개의 기사가 있는지 세기
- 98개 기사가 있어야 함

## 주의사항

**앞으로 작업 순서**:
1. 관리자 페이지에서 기사 추가/수정
2. "GitHub에 동기화" 버튼 클릭
3. **Git pull 또는 파일 다운로드**로 로컬 업데이트
4. 로컬에서 테스트
5. 완료!

또는:

**GitHub Pages 사용 시**:
- 로컬 파일은 신경쓰지 않아도 됨
- GitHub 저장소만 최신 상태로 유지
- GitHub Pages가 자동으로 배포
- https://harhie.github.io/hillstone-presskit/newsroom.html 에서 확인
