# Vercel 배포 가이드 (정적 웹페이지)

우리가 방금 만든 순수 HTML, CSS, Javascript 파일들(`customer.html` 등)을 Vercel에 배포하여 인터넷상에서 누구나 접속할 수 있도록 만드는 방법입니다.

## 1. 사전 준비 작업 및 GitHub에 리포지토리(Repository) 올리기
Vercel은 GitHub와 연동할 때 가장 강력하고 간편하므로, 우선 작업한 코드를 GitHub에 업로드해야 합니다.

1. **계정 준비**
   - [GitHub](https://github.com/) 회원가입 및 로그인
   - [Vercel](https://vercel.com/) 회원가입 (GitHub 계정으로 연동 권장)

2. **GitHub에 새 리포지토리 생성**
   - GitHub 로그인 후 우측 상단의 `+` 버튼을 누르고 **New repository**를 클릭합니다.
   - `Repository name`을 적당히 입력합니다 (예: `customer-management`).
   - 나머지 설정은 그대로 두고 화면 맨 밑의 **Create repository** 초록색 버튼을 클릭합니다.

3. **터미널을 통해 로컬 코드를 GitHub에 올리기 (Push)**
   - 현재 작업 중인 VS Code 화면에서 터미널(단축키 `Ctrl + \` 또는 상단 메뉴 Terminal -> New Terminal)을 엽니다.
   - 아래 명령어들을 순서대로 한 줄씩 복사하여 터미널에 붙여넣기하고 엔터를 칩니다.
   
   ```bash
   # 1. 현재 폴더를 Git 저장소로 초기화
   git init

   # 2. 모든 파일(html, css, js 등)을 장바구니에 담기
   git add .

   # 3. 무엇을 담았는지 메모장(커밋 메시지)과 함께 포장하기
   git commit -m "첫 빌드: 고객 관리 페이지 완성"

   # 4. 기본 가지(branch) 이름을 'main'으로 설정
   git branch -M main

   # 5. 방금 만든 내 GitHub 리포지토리 주소를 연결 (★주소를 본인 것으로 수정하세요!)
   # 예: git remote add origin https://github.com/my-id/customer-management.git
   git remote add origin https://github.com/본인아이디/생성한-리포지토리이름.git

   # 6. GitHub로 파일들을 밀어올리기(Push)
   git push -u origin main
   ```
   - 전부 실행한 뒤 GitHub 페이지를 새로고침 해보면 내 컴퓨터의 소스코드들이 온라인에 무사히 올라간 것을 확인할 수 있습니다. 이 상태가 되면 Vercel 연동 준비가 끝난 것입니다.

## 2. 파일 이름 변경 (권장)
Vercel이나 일반적인 웹 서버는 프로젝트 폴더로 접속했을 때 기본적으로 `index.html` 파일을 맨 처음 보여줍니다. 
* 방금 만든 메인 페이지인 `customer.html`의 이름을 **`index.html`**로 변경해 주시면 기본 주소 접속 시 바로 페이지가 뜹니다.
* 혹은 Vercel 환경설정 파일(`vercel.json`)을 만들어 `customer.html`로 리다이렉트 시킬 수도 있지만, 이름 변경이 가장 직관적입니다.

> **작업 디렉토리 구조 예시:**
> ```text
> 40_MyInfo0416/
> ├── index.html        (기존 customer.html에서 이름 변경)
> ├── customer.css
> ├── customer.js
> └── customer_management_page_plan.md
> ```
*`index.html`로 이름을 바꿀 경우, 파일 내의 `<script src="customer.js">` 및 `<link rel="stylesheet" href="customer.css">` 태그는 그대로 유지해도 됩니다.*

---

## 3. Vercel 웹사이트에서 배포하기 (가장 추천하는 방법)

GitHub에 프로젝트를 Push해 두었다면 클릭 몇 번으로 끝납니다.

1. **Vercel Dashboard 이동**: 로그인 후 [Vercel 대시보드](https://vercel.com/dashboard)로 이동합니다.
2. **새 프로젝트 만들기**: 우측 상단의 검은색 **`Add New...`** 버튼을 누르고 **`Project`**를 선택합니다.
3. **GitHub 레포지토리 연결**: 방금 올린 코드가 들어있는 GitHub 저장소 우측의 **`Import`** 버튼을 누릅니다.
4. **설정 확인 및 배포**:
    * **Project Name**: 원하는 웹사이트 이름 설정 (배포 URL의 앞부분이 됩니다.)
    * **Framework Preset**: 우리는 순수 HTML/JS 이므로 자동으로 **`Other`**로 잡히면 됩니다.
    * **Root Directory**: 최상위 폴더에 파일이 있다면 기본값(`./`)으로 둡니다.
    * 파란색 **`Deploy`** 버튼을 누릅니다.
5. **완료!**: 1~2분 내로 배포가 끝나고 축하 화면과 함께 URL 링크가 제공됩니다. 해당 링크를 통해 실 서버에 뜬 프로젝트를 확인할 수 있습니다.

---

## 4. (참고) Vercel CLI로 배포하기
명령어(터미널) 환경이 익숙하신 경우 이 방법이 더 빠를 수도 있습니다. 컴퓨터에 Node.js가 설치되어 있어야 합니다.

1. 터미널(VS Code의 `Ctrl + \` 혹은 `Cmd + J`)을 엽니다.
2. **Vercel 설치**: 
   ```bash
   npm i -g vercel
   ```
3. **배포 명령어 실행**: 파일들이 있는 디렉토리(`c:/MaxWork/80_DevPrj/40_MyInfo0416`)에서 터미널을 열고 다음 명령어를 칩니다.
   ```bash
   vercel
   ```
4. 안내에 따라 Vercel 계정 로그인을 진행합니다 (이메일 인증코드 혹은 브라우저 인증).
5. Y / N 등의 설정을 물어보는데 대부분 엔터(기본값)를 치면 됩니다.
6. 완료되면 터미널에 **Production 배포용 링크(URL)**가 뜹니다.

---

## 5. 지속적 통합 (CI/CD)
Vercel을 GitHub와 연동(위의 3번 방법)하여 배포한 경우, 이후 로컬에서 코드를 수정하고 **GitHub의 `main` 브랜치에 Push하면 Vercel이 알아서 감지하고 자동으로 재배포(Auto Deploy)**를 진행합니다. 추가적인 작업이 전혀 필요하지 않아 매우 편리합니다.
