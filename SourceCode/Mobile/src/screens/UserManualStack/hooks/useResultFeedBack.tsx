import { useCallback, useEffect, useState } from "react";
import { generateApiService } from "../../../services/ApiService";
import { API } from "../../../services";
import {
  Response,
  useHandleResponsePagination,
} from "../../../hooks/useHandleResponsePagination";

export const useResultFeedBack = () => {
  const getData = useCallback(
    async (pageToken: number, pageSize: number): Promise<Response> => {
      const dataFeedback = await generateApiService.get(
        `${API.PUBLIC}services/lmsbackendtest/api/question-and-answers-userId?page=${pageToken}&size=${pageSize}`,
        true
      );
      return dataFeedback;
    },
    []
  );
  const feedBack = useHandleResponsePagination(getData );
  useEffect(() => {
    feedBack.refresh();
  }, []);
  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  return {
    feedBack,
    keyExtractor
  };
};
