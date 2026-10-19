# Sieve and Sage · Project page

React + TypeScript + Vite로 만든 GitHub Pages용 영문 논문 소개 페이지입니다.
논문: https://arxiv.org/abs/2609.35794

이번 작업 범위는 **정적 프로젝트 페이지 우선 구현**입니다. 백엔드나 GPU 모델을
실행하지 않습니다. 데모에는 `Example simulation`을 표시하며, 사전 작성된 가상
예제 세 가지로 논문의 흐름을 설명합니다. 사용자 입력을 임의로 분류하지 않습니다.

## 로컬 실행

Node.js **22.12 이상**(권장: Node 22)과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

표시된 localhost 주소로 접속합니다. 개발 서버 중지는 `Ctrl+C`입니다.

```bash
npm test                 # 시뮬레이션 규칙 및 논문 표의 40개 행 검증
npm run build           # TypeScript, Vite, 배포 파일 검사
npx playwright install chromium
npm run test:browser     # 데스크톱 + 모바일 Chromium 동작 검사
npm run preview         # dist의 로컬 미리보기, Ctrl+C로 종료
```

브라우저가 이미 설치되어 있으면 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`에 실행
파일 경로를 지정할 수 있습니다. 테스트는 별도 HTTP 서버를 자동으로 시작/중지합니다.

## GitHub Pages 배포

이 디렉터리는 현재 유효한 Git 저장소가 아니며, 아래의 `Sieve-and-Sage/`는 별도
연구 코드 checkout입니다. 사이트 파일은 현재 디렉터리를 루트로 하는 새 저장소에
넣으세요. 연구 checkout 자체를 덮어쓸 필요는 없습니다.

1. `Jongbin-kr` 계정에서 새 저장소(예: `sns-project-page`)를 만듭니다.
2. 이 디렉터리의 사이트 소스, `package-lock.json`, `public/`, `tests/`,
   `scripts/`, `docs/`, `.github/workflows/pages.yml`을 저장소 루트에 넣습니다.
   `node_modules/`, `dist/`, 로컬 `paper.md`, `poster.md`, 연구 checkout은 제외합니다.
   `.gitignore`에 제외 항목이 설정되어 있습니다.
3. 기본 브랜치를 `main`으로 하고 **Settings → Pages → Source → GitHub Actions**를 선택합니다.
4. `main`에 push하거나 Actions에서 `Verify and deploy GitHub Pages`를 수동 실행합니다.
5. 검증을 통과하면 배포 작업에 사이트 URL이 표시됩니다. 저장소명이
   `sns-project-page`라면 예상 주소는 `https://jongbin-kr.github.io/sns-project-page/`입니다.
   **현재 실제 배포된 주소는 아닙니다.**

PR은 검증만 수행하고 공개 배포하지 않습니다. `base: './'`와 해시 탐색을 사용해
저장소 이름을 바꾸거나 프로젝트 하위 경로에 배포해도 정적 자산이 작동합니다.
별도 SPA 라우터나 GitHub Pages의 404 우회는 필요하지 않습니다.

배포를 중지하려면 Settings → Pages에서 사이트를 Unpublish하고, 자동 재배포를
막으려면 해당 Actions 워크플로도 Disable합니다. 로컬 서버 중지는 `Ctrl+C`입니다.
배포 구성은 [Vite의 공식 Pages 가이드](https://vite.dev/guide/static-deploy.html)를 따릅니다.

## 구성과 콘텐츠

| 경로 | 역할 |
| --- | --- |
| `src/App.tsx` | 논문 소개, 개념도, 방법론, 데모, 결과 비교, 인용 |
| `src/styles.css` | 반응형 스타일, 키보드 포커스, reduced-motion 대응 |
| `src/data.ts` | 저자·논문·코드 링크, 예제, Table 15 결과, BibTeX |
| `src/simulation.ts` | 입력 검증과 명시적 fixture 시뮬레이션 |
| `public/results.csv` | 로컬 원문에서 별도로 추출한 논문 수치 40행 |
| `public/implementation-audit.md` | 확인된 모델 설정, 원본 코드와 논문의 차이, 미확인 사항 |
| `docs/architecture.md` | 현재 구조, 후속 API 통합 경계 |
| `.github/workflows/pages.yml` | 테스트·빌드·브라우저 검사 후 정적 배포 |

페이지의 Code 링크는 기존 연구 저장소를 가리킵니다. `.env.example`은 선택적인
공개 메타데이터만 담습니다. `.env.local`에 공개 논문 링크나 base 경로를 설정해
override할 수 있습니다. `VITE_*`는 모두 공개되므로 비밀값을 넣으면 안 됩니다.
현재 빌드는 허용된 두 환경변수 외의 `VITE_*` 설정을 거절합니다.

## 데모의 정확한 범위

- 질문과 문서 ID/본문 편집, 문서 추가·삭제, 정상/근거 부족/방해 예제 선택.
- 사전 예제는 `Run example`으로 실행. 입력을 바꾸면 이전 결과를 지우고
  실행을 비활성화합니다. `Reset`으로 해당 예제의 원문을 복원할 수 있습니다.
- Sieve 보류 시 제안 경로의 가상 Sage 호출은 0회, 통과 시 1회입니다.
- `Compare paths`를 눌렀을 때만 Sage-only 호출 경로를 추가합니다. baseline
  답변을 만들지 않으며, 논문의 baseline을 재현했다고 주장하지 않습니다.
- 모델 점수, 토큰 수, 잘림 여부, 지연 시간, cold start는 측정하지 않아 숫자를 표시하지 않습니다.
- 실제 원격 호출은 항상 0회입니다. 사용자 입력은 브라우저 메모리에만 존재합니다.
- Google Fonts를 외부에서 읽으며 네트워크 차단 시 시스템 serif/sans-serif로 대체됩니다.

## 연구 코드 조사 결과와 다음 단계

**논문과 코드에 실행상의 차이가 있습니다.** 논문은 Sieve가 보류하면 Sage를 건너뛰는
구조를 설명하지만, 현재 `inference.py`는 전체 데이터에 Sage를 실행한 후 분류 결과로
덮어씁니다. 실제 서비스에서는 원본 전처리·분류 결과를 유지하면서 유료 제출 이전에
분기하는 wrapper와 parity 테스트가 필요합니다.

일반 도메인 모델 ID와 LoRA revision은 확인했지만, Sieve/base/tokenizer의 고정
revision, numeric label mapping, effective global attention, 공개 이용 조건,
baseline prompt는 추가 검증해야 합니다. Sage의 현재 HF 경로는 **2048 입력 토큰**으로
제한되므로 Sieve의 4096과 별도 검증이 필요합니다.

자세한 근거는 [소스 조사 문서](public/implementation-audit.md)를 참고하세요.
GPU 재현, FastAPI/Docker, Runpod, polling, 실제 성능 측정은 이번 페이지 범위에 포함되지 않습니다.
공개 모델 링크는 이용 조건과 checkpoint 확정 후 추가합니다.

라이선스: 연구 코드·모델·데이터의 배포 허가를 이 페이지가 대신 부여하지 않습니다.
기존 파일의 라이선스를 변경하지 않았으며, 사이트의 최종 라이선스는 소유자가 결정해야 합니다.
# sieve-and-sage-demo
