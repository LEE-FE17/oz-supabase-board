import { Link } from "react-router-dom";

function PostCard({ post }) {
  const formattedDate = new Date(post.date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link to={`/post/${post.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <h2 className="text-lg font-semibold text-gray-800 truncate mb-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-400">{formattedDate}</p>
      </div>
    </Link>
  );
}

export default PostCard;
