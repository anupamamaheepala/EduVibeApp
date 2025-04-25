import React from "react";
import ViewSinglePost from './ViewSinglePost'; // Correct import path if needed
import CommentSection from "./CommentSystem"; // Correct import path if needed

const PostWithComments = ({ post }) => {
  return (
    <div className="post-wrapper">
      <ViewSinglePost post={post} />  {/* Correctly use ViewSinglePost */}
      <CommentSection postId={post.id} />  {/* Render CommentSection */}
    </div>
  );
};

export default PostWithComments;
