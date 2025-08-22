import { ImagesCreateBody, ImagesCreateHeaders, useImagesCreate } from "@/apis/openapi/images/useImagesCreate";
import { getCsrfTokenFromCookies, getUserTokenFromCookies } from "@/utils/authCookies";
import { useState } from "react";

export const useImageCreate = () => {
  // フォームのステート
  const [prompt, setPrompt] = useState<string>("");
  const { trigger: triggerImageCreate } = useImagesCreate();

  const onCreateButtonClick = async () => {
    const headers: ImagesCreateHeaders = {
      Authorization: `Bearer ` + getUserTokenFromCookies() as `Bearer ${string}`,
      "x-xsrf-token": getCsrfTokenFromCookies() ?? ''
    }
    const requestBody: ImagesCreateBody = {
      prompt: prompt
    };
    // API呼び出し
    await triggerImageCreate({ headers, body: requestBody });
  }

  return {
    prompt,
    onPromptChange: setPrompt,
    onCreateButtonClick,
  };
};