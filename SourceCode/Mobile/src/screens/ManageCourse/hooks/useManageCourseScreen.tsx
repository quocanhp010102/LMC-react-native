import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useHandleResponsePagination } from "../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../services/ApiService";
import { CourseApi } from "../../../services/Course/CourseApi";

export const useManageCourseScreen = () => {
  const [queryInput, setQueryInput] = useState<string>("");
  const handleRequestCourses = useCallback(
    (pageToken: number, pageSize: number) => {
      return generateApiService.get(
        CourseApi.getCoursesByLecturersId(pageToken, pageSize),
        true
      );
    },
    []
  );

  const courses = useHandleResponsePagination<any>(
    handleRequestCourses,
    20,
    true
  );
  const checkVadidate = (inputValue: any) => {
    if (inputValue.length <= 255) {
      setQueryInput(inputValue);
    } else {
      setQueryInput("");
    }
  };

  const onRefresh = useCallback(() => {
    courses.pullToRefresh();
  }, []);

  const onEndReached = useCallback(() => {
    courses.handleLoadMore();
  }, []);

  useLayoutEffect(() => {
    courses.refresh();
  }, []);

  useEffect(() => {
    if (queryInput) {
      const timeout = setTimeout(async () => {
        setQueryInput(queryInput);
        const response = await generateApiService.get(
          CourseApi.searchCourses(queryInput)
        );
        if (response) {
          courses.setData(response.content);
        }
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      courses.refresh();
    }
  }, [queryInput]);

  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReached,
    courses,
    onRefresh,
    queryInput,
    setQueryInput,
    checkVadidate,
  };
};
