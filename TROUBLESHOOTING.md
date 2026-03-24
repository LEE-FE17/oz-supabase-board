# Mission 2 트러블슈팅 가이드 — 게시글 작성 페이지

---

### 1. 게시글 등록 시 RLS 권한 오류

**증상**
- 등록 버튼 클릭 시 `new row violates row-level security policy` 에러
- 폼 제출 후 오류 메시지만 표시되고 저장 안 됨

**원인**
Supabase `posts` 테이블에 INSERT를 허용하는 RLS 정책이 없음

**해결 방법**
Supabase 대시보드 → SQL Editor에서 실행:
```sql
CREATE POLICY "Allow public insert" ON posts
  FOR INSERT WITH CHECK (true);
```

---

### 2. 게시글 저장 후 날짜가 9시간 차이남

**증상**
- 오전 10시에 작성했는데 목록에서 오후 7시로 표시
- 실제 작성 시간과 정확히 9시간 차이

**원인**
timezone 정보 없이 날짜 문자열을 저장하면 Supabase(PostgreSQL)가 UTC로 해석하고,
조회 시 dayjs가 KST(UTC+9)로 변환하면서 9시간이 더해짐

```js
// ❌ timezone 정보 없음 → Supabase가 UTC로 해석
date: dayjs().format("YYYY-MM-DD HH:mm")

// ✅ UTC ISO 형식으로 저장 → 조회 시 정확하게 로컬 시간으로 변환
date: new Date().toISOString()
```

---

### 3. dayjs `is not defined` 에러

**증상**
- 콘솔에 `dayjs is not defined` 또는 `Cannot find module 'dayjs'` 출력

**원인**
dayjs 패키지 미설치 또는 import 누락

**해결 방법**
```bash
npm install dayjs
```
사용하는 파일 상단에 import 확인:
```js
import dayjs from "dayjs";
```

---

### 4. usePostForm Hook — 폼 입력이 반영되지 않음

**증상**
- input에 타이핑해도 값이 변하지 않음

**원인**
`handleChange`는 `e.target.name`으로 필드를 구분하므로 input에 `name` 속성이 없으면 동작하지 않음

```jsx
// ❌ name 속성 없음
<input value={form.title} onChange={handleChange} />

// ✅ name 속성 추가
<input name="title" value={form.title} onChange={handleChange} />
```

---

### 5. 등록 후 목록 페이지로 이동하지 않음

**증상**
- 게시글 저장은 되지만 페이지 이동이 안 됨

**원인**
`usePostForm`에 `onSuccess` 콜백이 전달되지 않음

```js
// ❌ 콜백 없음
const { handleSubmit } = usePostForm();

// ✅ navigate 콜백 전달
const navigate = useNavigate();
const { handleSubmit } = usePostForm(() => navigate("/"));
```

---

### 6. usePostForm import 경로 오류

**증상**
- `Failed to resolve import "../hooks/usePostForm"` 에러

**원인**
`pages/` 폴더에서 `hooks/` 폴더를 참조할 때 경로 오류

```js
// ❌ 잘못된 경로
import usePostForm from "./usePostForm";

// ✅ 올바른 경로
import usePostForm from "../hooks/usePostForm";
```
