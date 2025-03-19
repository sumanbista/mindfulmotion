import React, { useState } from 'react';
import PostCard from '../components/PostCard';

export default function Community() {
  // Sample posts state
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alice",
      content: "Just had an amazing meditation session!",
      loves: 3,
      userLoved: false,
      comments: [
        { id: 1, author: "Bob", text: "That's awesome!" },
        { id: 2, author: "Charlie", text: "I want to try it too." },
      ],
    },
    {
      id: 2,
      author: "Dave",
      content: "Feeling grateful for this community.",
      loves: 5,
      userLoved: false,
      comments: [],
    },
  ]);

  const [newPostContent, setNewPostContent] = useState("");

  // Add a new post
  const handleAddPost = () => {
    if (newPostContent.trim() === "") return;
    const newPost = {
      id: posts.length + 1,
      author: "CurrentUser", // replace with actual user info
      content: newPostContent,
      loves: 0,
      userLoved: false,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  // Toggle love reaction for a post
  const handleToggleLove = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (post.userLoved) {
            return { ...post, loves: post.loves - 1, userLoved: false };
          } else {
            return { ...post, loves: post.loves + 1, userLoved: true };
          }
        }
        return post;
      })
    );
  };

  // Add a comment to a post
  const handleAddComment = (postId, commentText) => {
    if (commentText.trim() === "") return;
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: post.comments.length + 1, author: "CurrentUser", text: commentText },
            ],
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Community</h1>

      {/* New Post Form */}
      <div className="max-w-2xl mx-auto mb-8 bg-white p-4 rounded-lg shadow">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={3}
        ></textarea>
        <button
          onClick={handleAddPost}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </div>

      {/* Posts List */}
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onToggleLove={handleToggleLove}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </div>
  );
}
