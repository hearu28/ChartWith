# Onchain Social Chart (PoC)

Base Onchain Kit를 활용한 소셜 차트 프로토타입입니다.

## 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Coinbase Developer Platform에서 발급받은 API 키를 설정하세요:

```env
VITE_ONCHAINKIT_API_KEY=your_api_key_here
```

API 키는 [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)에서 발급받을 수 있습니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 주요 기능

- **지갑 연결**: Onchain Kit의 `<ConnectWallet>` 컴포넌트를 통한 Base 지갑 연결
- **암호화폐 차트**: lightweight-charts를 활용한 실시간 차트 (현재는 Mock 데이터 사용)
- **소셜 채팅**: 지갑 주소 기반 온체인 아이덴티티(Basename/ENS)를 표시하는 채팅 기능

## 프로젝트 구조

```
src/
├── components/
│   ├── chart/          # 차트 컴포넌트
│   ├── chat/           # 채팅 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── styles/              # CSS 스타일
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 진입점 및 OnchainKitProvider 설정
```

## 기술 스택

- **Vite + React + TypeScript**: 개발 환경
- **@coinbase/onchainkit**: Base Onchain Kit
- **wagmi & viem**: Web3 코어 라이브러리
- **lightweight-charts**: 고성능 금융 차트 라이브러리
- **@tanstack/react-query**: 데이터 페칭 및 상태 관리

## PoC 제한사항

- 채팅 메시지는 클라이언트 로컬 상태로만 저장되며, 페이지 새로고침 시 사라집니다.
- 실시간 채팅 백엔드가 없습니다.
- 차트 데이터는 Mock 데이터를 사용합니다.
