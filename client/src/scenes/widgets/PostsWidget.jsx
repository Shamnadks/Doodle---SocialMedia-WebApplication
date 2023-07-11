import React, { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts} from "state";
import PostWidget from "./PostWidget";
import axios from "../../utils/axios";
import { getPost } from "../../utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const postAdded = useSelector((state) => state.postAdded);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getPost);
      const data = response.data;
      dispatch(setPosts({ posts: data }));
      setPage(1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getUserPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/posts/${userId}/posts`);
      const data = response.data;
      dispatch(setPosts({ posts: data }));
      setPage(1);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    try {
      setLoading(true);
      const nextPage = page + 1;
      let response;
      if (isProfile) {
        response = await axios.get(`/posts/${userId}/posts?page=${nextPage}`);
      } else {
        response = await axios.get(`/posts?page=${nextPage}`);
      }
      const data = response.data;
      dispatch(setPosts({ posts: [...posts, ...data] }));
      setPage(nextPage);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCommentAdded = () => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  };

  const handlePostDeleted = () => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  };



  useLayoutEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId, postAdded]);


  return (
    <>
      {posts.length === 0 ? (
        <div>
          <img
            style={{ marginLeft: "130px", height: "200px" }}
            src="https://usagif.com/wp-content/uploads/2022/hqgif/ghost-50-pixel-ghost-transparent-background.gif"
            alt="no posts"
          />
          <h3
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginTop: "10px",
              fontWeight: "600",
              color: "primary",
              fontFamily: "initial",
            }}
          >
            No Post found!
          </h3>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={true}
          loader={loading && <h4>Loading...</h4>}
        >
          {posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
              createdAt,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                createdAt={createdAt}
                onCommentAdded={handleCommentAdded}
                onPostDeleted={handlePostDeleted}
              />
            )
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default PostsWidget;
