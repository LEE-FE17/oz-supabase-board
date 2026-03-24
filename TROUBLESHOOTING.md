# Mission 3 트러블슈팅 가이드 — 게시글 상세 페이지

---

### 1. 게시글 클릭 시 상세 페이지로 이동하지 않음

**증상**
- 게시글 카드 클릭해도 아무 반응 없음

**원인**
`PostCard`에 `<Link>` 컴포넌트가 없거나 경로가 잘못됨

```jsx
// ❌ Link 없음
<div onClick={...}>...</div>

// ✅ Link로 감싸기
import { Link } from "react-router-dom";
<Link to={`/post/${post.id}`}>...</Link>
```

---

### 2. 상세 페이지에서 "게시글을 찾을 수 없습니다" 표시

**증상**
- URL은 `/post/some-id`로 정상인데 데이터를 못 불러옴

**원인 A** — `useParams()`로 가져온 `id` 값이 Supabase의 uuid 타입과 불일치

**해결**
Supabase 테이블의 `id` 컬럼이 `uuid` 타입인지 확인:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'posts' AND column_name = 'id';
```

**원인 B** — RLS SELECT 정책 미설정

```sql
CREATE POLICY "Allow public read" ON posts
  FOR SELECT USING (true);
```

---

### 3. usePost Hook — 데이터 로딩 후 계속 로딩 상태 유지

**증상**
- 스피너가 사라지지 않고 계속 표시됨

**원인**
`usePost` 내부에서 `setLoading(false)`가 호출되지 않는 경우
(에러 처리 블록에서 누락되는 경우 발생)

```js
// ❌ error 발생 시 loading이 false로 안 바뀜
if (error) {
  setError(error.message);
}

// ✅ finally로 항상 loading 해제
} finally {
  setLoading(false);
}
```

---

### 4. Supabase `.single()` 에러

**증상**
- 콘솔에 `JSON object requested, multiple (or no) rows returned` 에러

**원인**
`.single()`은 결과가 정확히 1건일 때만 정상 동작. 0건이거나 2건 이상이면 에러 발생

**해결**
존재하지 않는 id 접근 시 에러가 반환되므로 반드시 에러 처리:
```js
const { data, error } = await supabase
  .from("posts")
  .select("*")
  .eq("id", id)
  .single();

if (error) {
  setError(error.message); // "게시글을 찾을 수 없습니다" UI 표시
  return;
}
```

---

### 5. 상세 페이지 새로고침 시 404

**증상**
- `/post/some-uuid` 주소에서 새로고침하면 404 오류

**원인**
Vite 개발 서버가 React Router의 동적 경로(`/post/:id`)를 처리하지 못함

**해결** — `vite.config.js` 수정:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
})
```

---

### 6. 날짜가 `Invalid Date`로 표시

**증상**
- 상세 페이지에서 작성일이 `Invalid Date`로 나옴

**원인**
Supabase에서 가져온 `date` 값이 dayjs가 파싱할 수 없는 형식

**해결**
게시글 저장 시 ISO 형식 사용 확인:
```js
date: new Date().toISOString() // "2026-03-24T01:23:00.000Z"
```
표시 시:
```js
dayjs(post.date).format("YYYY년 MM월 DD일 HH:mm")
```
