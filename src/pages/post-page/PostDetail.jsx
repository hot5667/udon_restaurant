import React, { useCallback, useContext, useEffect, useState } from "react";
import defaultProfileImg from "../../img/image.png";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import supabase from "../../supaBasecClient";
import styled from "@emotion/styled";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../../components/EmblaCarouselArrowButtons";
import { AuthContext } from "../../context/AuthContext";
import DeletePost from "../../components/DeletePost";
import Comment from "../../components/Comment";
import UnLikeImg from "../../img/heart-empty-icon.svg";
import LikeImg from "../../img/heart-icon.svg";
import defaultImg from "../../img/default-img.png";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const menu = {
  1: "한식",
  2: "중식",
  3: "일식",
  4: "양식",
  5: "분식",
  6: "야식/안주",
  7: "카페/디저트",
  8: "기타",
};

const PostDetail = () => {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("id");
  const { user, signOutUser } = useContext(AuthContext);
  const { state: PostUserID } = useLocation();

  const [post, setPost] = useState({
    PostDate: "",
    PostCity: "",
    PostTitle: "",
    PostContent: "",
    PostFoodType: "",
    PostImgs: [],
    UserID: "",
    PostLike: "[]",
    Comments: [],
    UserProfile: null,
  });

  const [like, setLike] = useState(0);

  useEffect(() => {
    const FindSamePost = async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*")
        .eq("PostID", postId);

      if (error) {
        console.log("error=>", error);
      } else {
        setPost((prev) => {
          const curPost = { ...prev, ...data[0] };
          curPost.PostImgs = JSON.parse(curPost.PostImgs);
          return curPost;
        });
        setLike(JSON.parse(data[0].PostLike).length);
      }
    };
    FindSamePost();
    const FindProfileImg = async () => {
      if (PostUserID) {
        const { data, error } = await supabase
          .from("User")
          .select("UserProfile")
          .eq("UserID", PostUserID);

        if (error) {
          console.log("error=>", error);
        } else {
          setPost((prev) => ({
            ...prev,
            UserProfile: data[0]?.UserProfile || null,
          }));
        }
      }
    };
    FindProfileImg();
  }, [like, postId, PostUserID]);
  let likeArray = JSON.parse(post.PostLike) || [];
  // 캐러셀
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ stopOnMouseEnter: true, stopOnInteraction: false }),
  ]);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);
  const onButtonAutoplayClick = useCallback(
    (callback) => {
      const autoplay = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi]
  );
  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return; // 사용자 로그인이 필요함

    if (likeArray.includes(user.UserID)) {
      try {
        likeArray = likeArray.filter((id) => id !== user.UserID);
        const { error } = await supabase
          .from("Post")
          .update({ PostLike: likeArray })
          .eq("PostID", post.PostID);
        if (error) throw error;
        setLike((prev) => prev - 1);
      } catch (error) {
        console.error("Error modifying Like:", error.message);
      }
    } else {
      try {
        likeArray.push(user.UserID);
        const { error } = await supabase
          .from("Post")
          .update({ PostLike: likeArray })
          .eq("PostID", post.PostID);
        if (error) throw error;
        setLike((prev) => prev + 1);
      } catch (error) {
        console.error("Error modifying Like:", error.message);
      }
    }
  };

  let tmp = post.PostContent;
  tmp = tmp.split("\n").map((line, idx) => (
    <span key={`${postId}_line_${idx}`}>
      {line}
      <br />
    </span>
  ));

  return (
    <DetailPost>
      <HeaderDiv>
        <div className="header">
          <Title
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          >
            우동집
          </Title>
          <UlDiv>
            <li>
              {user ? (
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  onClick={(e) => {
                    e.preventDefault();
                    signOutUser();
                    navigate("/");
                  }}
                >
                  로그아웃
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  로그인
                </Link>
              )}
            </li>
            <hr
              style={{
                height: "18px",
                width: "1px",
                backgroundColor: "black",
                border: "none",
                margin: "0 3px",
              }}
            />
            <li>
              <Link
                to="/sign-up"
                style={{ textDecoration: "none", color: "black" }}
              >
                회원가입
              </Link>
            </li>
          </UlDiv>
        </div>
      </HeaderDiv>
      {post.PostImgs.length === 0 ? (
        <DefaultImg defaultImg={defaultImg} />
      ) : (
        <Embla className="embla" ref={emblaRef}>
          <div className="embla__container">
            {post.PostImgs.map((img, idx) => {
              return (
                <div className="embla__slide" key={idx}>
                  <img
                    style={{ width: "700px", margin: "auto" }}
                    key={idx}
                    src={`${supabaseURL}/storage/v1/object/public/images/${post.PostID}/${img}`}
                  />
                </div>
              );
            })}
          </div>
          <EmblaControls className="embla__controls">
            <div className="embla__buttons">
              <PrevButton
                onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={() => onButtonAutoplayClick(onNextButtonClick)}
                disabled={nextBtnDisabled}
              />
            </div>
          </EmblaControls>
        </Embla>
      )}

      <ButtonStyle>
        {user && user.UserID === post.UserID ? (
          <div>
            <button
              onClick={() => {
                const fixedPost = {
                  ...post,
                  PostImgs: JSON.parse(post.PostImgs),
                };
                navigate(`/create?isToModify=${true}&id=${post.PostID}`, {
                  state: fixedPost,
                });
              }}
            >
              게시글 수정
            </button>
            <DeletePost id={post.PostID} />
          </div>
        ) : null}
      </ButtonStyle>
      <PostInfoDetail>
        <ProfileImg src={post.UserProfile || defaultProfileImg} />
        <p> 작성자: {post.PostUserName}</p>
        <p> 도시: {post.PostCity}</p>
        <p> 음식종류: {menu[post.PostFoodType]}</p>
        <p> 작성날짜: {post.PostDate}</p>
        <LikeButton onClick={handleLike}>
          {likeArray.includes(user?.UserID) ? (
            <img src={LikeImg} alt="Liked" />
          ) : (
            <img src={UnLikeImg} alt="Not Liked" />
          )}
        </LikeButton>
        {like}
      </PostInfoDetail>
      <PostContents>
        <p style={{ fontSize: "24px" }}> 제목: {post.PostTitle}</p>
        <p style={{ wordWrap: "break-word" }}>
          내용 <br />
          {tmp}
        </p>
      </PostContents>
      <CommentStyle>
        <Comment />
      </CommentStyle>

      {/* {post.Comments?.length ? (
        post.Comments.map((comment) => (
          <CommentStyle key={comment.CommentID}>
            <p>작성자:{comment.commentUserID}</p>
            <p>작성날짜:{comment.CommentDate}</p>
            <p style={{ wordWrap: "break-word" }}>
              내용:{comment.CommentContent}
            </p>
          </CommentStyle>
        ))
      ) : (
        <CommentStyle> 작성된 댓글이 없습니다</CommentStyle>
      )} */}
    </DetailPost>
  );
};

export default PostDetail;

const PostInfoDetail = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 1px solid lightgrey;
`;

const PostContents = styled.div`
  line-height: 30px;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const CommentStyle = styled.div`
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const DetailPost = styled.div`
  max-width: 900px;
  display: flex;
  padding-bottom: 30px;
  line-height: 30px;
  gap: 50px;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto; // margin 0은 위아래를 0 좌우 margin을 auto 가운데 정렬에 유용
`;

const ButtonStyle = styled.div`
  display: flex;
  margin: 0 0 0 auto;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
`;

const HeaderDiv = styled.header`
  background-color: white;
  width: 100%;
  height: fit-content;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 50px;
  font-family: "LOTTERIACHAB";
  color: #fea100;
  margin: 0;
  cursor: pointer;
  user-select: none;
`;

const UlDiv = styled.ul`
  height: fit-content;
  position: absolute;
  top: 8px;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
`;

const LikeButton = styled.button`
  height: fit-content;
  background-color: transparent;
  border: none;
  img {
    width: 30px;
  }
`;

// 캐러셀
const Embla = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: lightgray;

  position: relative;

  .embla__container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%; /* Each slide covers x % of the viewport */
    grid-gap: 0 20px;
  }

  .embla__slide {
    width: 100%;
    height: 500px;

    display: grid;

    flex: 0 0 100%;
    min-width: 0;
  }

  .embla__slide:last-child {
    margin-right: 20px;
  }
`;

const EmblaControls = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  .embla__buttons {
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      background-color: transparent;
      margin: 0;
      width: 30px;
      height: 40px;
      border-radius: 0;
      padding: 3px 0 0 0;
      cursor: pointer;
    }
  }
`;

const DefaultImg = styled.div`
  background: white url(${(props) => props.defaultImg}) no-repeat center;
  /* background-position: center; */
  background-size: contain;
  width: 100%;
  height: 500px;
`;
