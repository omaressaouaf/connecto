import { Container, Box, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PostFormPrv from "./PostFormPrv";
import PostSkeleton from "./PostSkeleton";
import PostItem from "./PostItem";
import { connect } from "react-redux";
import { resetPosts, fetchPosts } from "../../redux/actions/postActions";
import ProgressBar from "../shared/ProgressBar";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useParams } from "react-router-dom";
import { cancelUploadFile } from "../../redux/actions/postActions";
import InfiniteScroll from "react-infinite-scroll-component";


function Posts(props) {

  const { loggedUser, resetPosts, fetchPosts, posts, loading, progress, cancelUploadFile } = props;

  const { userId } = useParams();
  const [startAfterDoc, setStartAfterDoc] = useState();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    handleInitialFetch();
    // eslint-disable-next-line
  }, [userId]);

  // initial fetch
  const handleInitialFetch = () => {
    // reset the posts to an empty array every time the component mounts to avoid conflicts between the public posts and the profile posts (try it in order to see the conflicts)

    resetPosts();
    fetchPosts(userId).then(handleResFromFetchPosts);
  };
  // infinit scroll fetch
  const handleNext = () => {
    fetchPosts(userId, startAfterDoc).then(handleResFromFetchPosts);
  };

  // callback to handle what's coming from my fetch function response
  const handleResFromFetchPosts = res => {
    const { lastVisibleSnapShot, isEmpty } = res;
    setStartAfterDoc(() => lastVisibleSnapShot);
    setHasMore(() => !isEmpty);
  };

  const renderPostFormPrvAndProgress = () => {
    return (
      <>
        <PostFormPrv />
        {progress !== undefined && <ProgressBar progress={progress} cancelUploadFile={cancelUploadFile} />}
      </>
    );
  };

  const renderPostsSkeletons = () => {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  };
  const renderNoPostsAlert = () => {
    return (
      <Box mt={4}>
        <Paper elevation={5}>
          <Alert severity="warning">
            <AlertTitle>No Posts for now</AlertTitle>
            <ul style={{ padding: "0" }}>
              <li>Post something cool</li>
              <li>Wait for your following to post something cool</li>
              <li>Look for more followings</li>
            </ul>
          </Alert>
        </Paper>
      </Box>
    );
  };
  const infiniteScrollLoader = (
    <h1 style={{ textAlign: "center", color: "blue" }}>
      <i style={{ fontSize: "1.5em" }} className="fa fa-spinner fa-spin"></i>
    </h1>
  );

  const renderInfiniteScrollPosts = () => {
    return (
      <InfiniteScroll InfiniteScroll={1} dataLength={posts.length} next={handleNext} loader={infiniteScrollLoader} hasMore={hasMore}>
        {posts.map(post => {
          return (
            <Box my={7} mx={1} key={post.id}>
              <Paper elevation={5}>
                <PostItem post={post} />
              </Paper>
            </Box>
          );
        })}
      </InfiniteScroll>
    );
  };

  return (
    <Container>
      {/* if there is no userId (no profile) or the userId ===loggedUser.uid .then render form prev and progress */}
      {userId === undefined || userId === loggedUser.uid ? renderPostFormPrvAndProgress() : null}

      {/* if loading render skeletons else check if post length ==0 then show alert .  else render the infinitescroll */}
      {loading ? renderPostsSkeletons() : !posts.length ? renderNoPostsAlert() : renderInfiniteScrollPosts()}
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    loggedUser: state.authReducer.loggedUser,
    posts: state.postReducer.posts,
    loading: state.uiReducer.loading.Posts,
    progress: state.uiReducer.progress.PostForm,
  };
};

export default connect(mapStateToProps, { resetPosts, fetchPosts, cancelUploadFile })(Posts);
