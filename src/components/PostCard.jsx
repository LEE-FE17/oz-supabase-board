import { Link } from "react-router-dom";
import dayjs from "dayjs";

function PostCard({ post }) {
  const formattedDate = dayjs(post.date).format("YYYY-MM-DD HH:mm");

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
