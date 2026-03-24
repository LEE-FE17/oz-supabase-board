import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import usePost from "../hooks/usePost";
import useEditPost from "../hooks/useEditPost";
import ConfirmModal from "../components/ConfirmModal";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error, setPost } = usePost(id);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    isEditing,
    form,
    handleChange,
    handleEditStart,
    handleEditCancel,
    handleUpdate,
    handleDelete,
    submitting,
    error: editError,
  } = useEditPost(post ?? { title: "", contents: "", id }, {
    onUpdated: (updated) => setPost(updated),
    onDeleted: () => navigate("/"),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-gray-500">게시글을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        {/* 목록으로 버튼 */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 mb-6 transition-colors"
        >
          ← 목록으로
        </button>

        <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {isEditing ? (
            /* ── 수정 모드 ── */
            <form onSubmit={handleUpdate} className="flex flex-col gap-5 p-8">
              <h2 className="text-lg font-bold text-gray-800">게시글 수정</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  name="contents"
                  value={form.contents}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>

              {editError && (
                <p className="text-sm text-red-500">오류: {editError}</p>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
                >
                  {submitting ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>

          ) : (
            /* ── 조회 모드 ── */
            <>
              {/* 헤더 */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{dayjs(post.date).format("YYYY년 MM월 DD일 HH:mm")}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="px-8 py-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {post.contents}
                </p>
              </div>

              {/* 하단 버튼 */}
              <div className="px-8 pb-8 flex justify-between">
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  목록으로
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditStart}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </>
          )}
        </article>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <ConfirmModal
          message="해당 게시물을 삭제 하시겠습니까?"
          onConfirm={() => {
            setShowConfirm(false);
            handleDelete();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default PostDetail;
