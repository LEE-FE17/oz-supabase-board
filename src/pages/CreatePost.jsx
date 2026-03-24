import { useNavigate } from "react-router-dom";
import usePostForm from "../hooks/usePostForm";

function CreatePost() {
  const navigate = useNavigate();
  const { form, handleChange, handleSubmit, submitting, error } = usePostForm(
    () => navigate("/")
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">게시글 작성</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            name="contents"
            value={form.contents}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            required
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">오류: {error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
