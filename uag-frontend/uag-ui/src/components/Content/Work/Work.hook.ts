import { useWorksGetById, WorkGetByIdResult } from "@/apis/openapi/works/useWorksGetById";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { UsersActivitySearchResult, useUsersActivitySearch } from "@/apis/openapi/users/useUsersActivitySearch";
import { getCsrfTokenFromCookies } from "@/utils/authCookies";
import { useUsersRatedRegister } from "@/apis/openapi/users/useUsersRatedRegister";
import { useUsersLikedRegister } from "@/apis/openapi/users/useUsersLikedRegister";
import { useUsersLikedDelete } from "@/apis/openapi/users/useUsersLikedDelete";
import { useNavigate } from "@/utils/navigate";
import { useUserTokenContext } from "@/providers/auth/userTokenProvider";
import { useAccessTokenContext } from "@/providers/auth/accessTokenProvider";

type UseWorkProps = {
  workId: string;
};

export const useWork = (
  { workId }: UseWorkProps
) => {
  const router = useRouter();
  const [workData, setWorkData] = useState<WorkGetByIdResult>();
  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localRating, setLocalRating] = useState<number | undefined>();
  const [loading, setLoading] = useState(true); // ローディング状態
  const { trigger: triggerWorksGetById, data, error } = useWorksGetById();
  const { trigger: triggerActivity, data: activityData } = useUsersActivitySearch();
  const { trigger: triggerRated } = useUsersRatedRegister();
  const { trigger: triggerLiked } = useUsersLikedRegister();
  const { trigger: triggerDeliked } = useUsersLikedDelete();
  const { isAuthenticated } = useAccessTokenContext();
  const { userToken } = useUserTokenContext();
  const [activitiesData, setActivitiesData] = useState<UsersActivitySearchResult>();
  const navigate = useNavigate();

  const [headers, setHeaders] = useState({
    Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
    "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
  });

  useEffect(() => {
    if (userToken != null) {
      setHeaders({
        Authorization: `Bearer ${userToken}` as `Bearer ${string}`,
        "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
      });
    }
  }, [userToken]);


  useEffect(() => {
    const handleFetchWork = async () => {
      try {
        await triggerWorksGetById({ workId });
      } catch (err) {
        console.error("Failed to fetch work:", err);
      }
    };
    setLoading(true);
    handleFetchWork();
  }, [workId]);

  // workの取得
  useEffect(() => {
    console.log(isAuthenticated)
    if (data) {
      setWorkData(data);
    }
    if (error) {
      console.error("エラーが発生しました:", error);
    }
  }, [data, error]);

  // works データが変更されたときの処理
  useEffect(() => {
    console.log("worksData:", workData);
    console.log("headers:", headers)
    if (workData) {
      console.log("workData", workData);
      console.log("isAuthenticated:", isAuthenticated)
      console.log("userToken:", userToken)
      if (isAuthenticated && userToken != null) {
        console.log("isAuthenticated is true and userToken isnot null");
        if (workData.apiWork?.workId) {
          console.log("workData.apiWork?.workId isnot null");
          const workIds = [workData.apiWork?.workId]
          // アクティビティ情報を取得
          triggerActivity({ headers, body: { workIds } });
        }
      } else {
        console.log("setActivitiesData:0");
        setActivitiesData({})
      }
    }
  }, [workData, headers, isAuthenticated]);

  // activityDataの取得
  useEffect(() => {
    if (workData && activityData) {
      setActivitiesData(activityData)
    }
  }, [activityData]);

  // activityData が変更されたときの処理
  useEffect(() => {
    if (workData && activitiesData) {
      console.log("workData", workData)
      console.log("activitiesData", activitiesData)
      if (activitiesData.apiLikeds != undefined &&
        activitiesData.apiLikeds.length > 0 &&
        activitiesData.apiLikeds[0].workId != undefined) {
        console.log("setLocalIsLiked true")
        setLocalIsLiked(true)
      } else {
        console.log("setLocalIsLiked false")
        setLocalIsLiked(false)
      }
      if (activitiesData?.apiRateds != undefined &&
        activitiesData.apiRateds.length > 0 &&
        activitiesData.apiRateds[0].rating != undefined) {
        setLocalRating(activitiesData.apiRateds[0].rating)
      } else {
        setLocalRating(0)
      }
      console.log("workData:", workData)
      console.log("activitiesData:", activitiesData)
      setLoading(false);
    }
  }, [workData, activitiesData]);

  const onRateClick = (rating: number) => {
    triggerRated({ headers, workId, rating: rating });
    setLocalRating(rating);
  };

  const onLikeClick = () => {
    if (localIsLiked) {
      triggerDeliked({ headers, workId });
      setLocalIsLiked(false);
    } else {
      triggerLiked({ headers, workId });
      setLocalIsLiked(true);
    }
  };

  const onTagClick = (tag: string | undefined) => {
    if (tag) {
      navigate(`/tag/${encodeURIComponent(tag)}?page=1`);
    }
  };

  const onCreatorClick = (creator: string | undefined) => {
    if (creator) {
      navigate(`/creator/${encodeURIComponent(creator)}?page=1`);
    }
  };

  const onCharacterClick = (character: string | undefined) => {
    if (character) {
      navigate(`/character/${encodeURIComponent(character)}?page=1`);
    }
  };

  const onGenreClick = (genre: string | undefined) => {
    if (genre) {
      navigate(`/genre/${encodeURIComponent(genre)}?page=1`);
    }
  };

  return {
    workData,
    loading: loading,
    localIsLiked,
    localRating,
    onRateClick,
    onLikeClick,
    onTagClick,
    onCreatorClick,
    onCharacterClick,
    onGenreClick,
    isAuthenticated
  };
};