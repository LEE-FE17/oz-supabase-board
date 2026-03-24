# Mission 4 트러블슈팅 가이드 — 게시글 수정/삭제

---

### 1. 수정/삭제 시 RLS 권한 오류

**증상**
- 수정 저장 시 `new row violates row-level security policy` 에러
- 삭제 시 아무 반응 없거나 권한 오류 발생

**원인**
Supabase에 UPDATE, DELETE RLS 정책이 없음

**해결 방법**
Supabase 대시보드 → SQL Editor에서 실행:
```sql
CREATE POLICY "Allow public update" ON posts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON posts
  FOR DELETE USING (true);
```

---

### 2. 수정 폼에 기존 내용이 표시되지 않음

**증상**
- 수정 버튼 클릭 시 입력 필드가 비어있음

**원인**
`useEditPost` Hook 초기화 시 `post` 값이 전달되지 않았거나 `form` 초기값 설정 오류

```js
// ❌ post 없이 호출
const { form } = useEditPost(null, { ... });

// ✅ post 데이터가 로드된 후 호출
const { post } = usePost(id);
const { form } = useEditPost(post, { ... });
```

---

### 3. 수정 저장 후 화면이 업데이트되지 않음

**증상**
- 저장 성공했지만 상세 페이지에 이전 내용이 그대로 표시됨

**원인**
`onUpdated` 콜백에서 `setPost`를 호출하지 않아 로컬 상태가 갱신되지 않음

```js
// ❌ 콜백 없음
useEditPost(post, {});

// ✅ setPost로 화면 즉시 반영
const { post, setPost } = usePost(id);
useEditPost(post, {
  onUpdated: (updated) => setPost(updated),
});
```

---

### 4. 삭제 확인 모달이 표시되지 않음

**증상**
- 삭제 버튼 클릭 시 모달 없이 바로 삭제되거나 아무 반응 없음

**원인 A** — `showConfirm` 상태가 `true`로 변경되지 않음

```jsx
// ❌ setShowConfirm 호출 없음
<button onClick={handleDelete}>삭제</button>

// ✅ 모달 먼저 표시
<button onClick={() => setShowConfirm(true)}>삭제</button>
```

**원인 B** — `ConfirmModal` import 경로 오류

```js
// ✅ 올바른 경로
import ConfirmModal from "../components/ConfirmModal";
```

---

### 5. 삭제 후 목록 페이지로 이동하지 않음

**증상**
- 삭제는 되지만 상세 페이지에 그대로 머무름

**원인**
`useEditPost`의 `onDeleted` 콜백에 `navigate` 전달 누락

```js
// ❌ 콜백 없음
useEditPost(post, { onUpdated: ... });

// ✅ onDeleted 콜백 추가
useEditPost(post, {
  onUpdated: (updated) => setPost(updated),
  onDeleted: () => navigate("/"),
});
```

---

### 6. usePost — `setPost is not a function` 에러

**증상**
- 콘솔에 `setPost is not a function` 에러

**원인**
`usePost` hook이 `setPost`를 반환하지 않음

```js
// ❌ setPost 반환 없음
return { post, loading, error };

// ✅ setPost 포함해서 반환
return { post, setPost, loading, error };
```
