# 트러블슈팅 가이드

## 자주 발생하는 문제와 해결 방법

---

### 1. Supabase 연결 오류 (환경 변수 미설정)

**증상**
- 콘솔에 `supabaseUrl is required` 또는 `Invalid API key` 에러 출력
- 게시글 목록이 로딩만 되고 데이터가 나타나지 않음

**원인**
`.env` 파일에 Supabase URL과 API Key가 설정되지 않았거나 값이 기본값(your_supabase_...)으로 남아 있음

**해결 방법**
1. Supabase 대시보드 → Project Settings → API 로 이동
2. `Project URL`과 `anon public` 키 복사
3. 프로젝트 루트의 `.env` 파일 수정:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. 개발 서버 재시작 (`npm run dev`)

> **주의**: Vite 환경변수는 반드시 `VITE_` 접두사를 가져야 합니다.

---

### 2. Supabase 테이블이 없어서 오류 발생

**증상**
- 콘솔에 `relation "posts" does not exist` 에러
- 게시글 목록 화면에 오류 메시지 표시

**원인**
Supabase에 `posts` 테이블이 생성되지 않음

**해결 방법**
Supabase 대시보드 → SQL Editor에서 아래 SQL 실행:

```sql
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  contents text NOT NULL,
  date timestamptz NOT NULL DEFAULT now()
);
```

---

### 3. 게시글 작성 시 권한 오류 (Row Level Security)

**증상**
- 게시글 등록 시 `new row violates row-level security policy` 에러

**원인**
Supabase의 RLS(Row Level Security)가 활성화되어 있고 허용 정책이 없음

**해결 방법 A** (개발/학습용 — 인증 없이 전체 허용)

Supabase 대시보드 → SQL Editor에서 실행:

```sql
-- 읽기 허용
CREATE POLICY "Allow public read" ON posts
  FOR SELECT USING (true);

-- 쓰기 허용
CREATE POLICY "Allow public insert" ON posts
  FOR INSERT WITH CHECK (true);
```

**해결 방법 B** (빠른 방법)

Supabase 대시보드 → Table Editor → posts 테이블 → RLS 비활성화

---

### 4. Tailwind CSS 스타일이 적용되지 않음

**증상**
- 페이지가 스타일 없이 날 것의 HTML처럼 보임

**원인 A** — `index.css`에 Tailwind 디렉티브 누락

**해결**: `src/index.css` 상단에 아래 세 줄 확인
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**원인 B** — `tailwind.config.js`의 `content` 경로 누락

**해결**: `tailwind.config.js` 확인
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

---

### 5. React Router — 페이지 새로고침 시 404

**증상**
- `/create`, `/post/123` 등 직접 URL 입력 시 404 오류

**원인**
Vite 개발 서버가 SPA 라우팅을 처리하지 못함

**해결** — `vite.config.js`에 히스토리 폴백 설정 추가
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
})
```

---

### 6. `date` 표시 형식이 이상하게 나옴

**증상**
- 날짜가 `Invalid Date`로 표시

**원인**
Supabase에 저장된 `date` 컬럼의 값이 올바른 ISO 8601 형식이 아님

**해결**
`CreatePost.jsx`에서 날짜 저장 시 `new Date().toISOString()` 사용 확인:
```js
date: new Date().toISOString(),
```

---

### 7. 게시글 상세 페이지에서 데이터를 못 찾는 경우

**증상**
- "게시글을 찾을 수 없습니다" 메시지 표시

**원인 A** — URL의 `id`와 Supabase의 `id` 타입 불일치 (`uuid` vs `integer`)

**해결**
테이블의 `id` 컬럼 타입이 `uuid`인지 확인. `integer`라면 SQL로 수정하거나, `PostDetail.jsx`의 쿼리에서 타입 변환 적용

**원인 B** — RLS로 인한 읽기 차단 → 위의 [3번 해결 방법](#3-게시글-작성-시-권한-오류-row-level-security) 참고
