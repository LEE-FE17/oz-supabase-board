import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import usePost from "../hooks/usePost";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error } = usePost(id);

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
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 mb-6 transition-colors"
      >
        ← 목록으로
      </button>

      <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{dayjs(post.date).format("YYYY년 MM월 DD일 HH:mm")}</span>
          </div>
        </div>

        <div className="px-8 py-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.contents}
          </p>
        </div>

        <div className="px-8 pb-8 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            목록으로
          </button>
        </div>
      </article>
    </div>
  );
}

export default PostDetail;
