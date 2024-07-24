import { useCallback, useEffect } from "react";

import { useHandleResponsePagination } from "../../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../../services/ApiService";
import { CourseApi } from "../../../../services/api/Course/CourseApi";

export const useListStudentManage = ({ id }: { id: number }) => {
  
  const onGetAllStudent = async (id : number , pageToken: number, pageSize: number ) => {
    const response = await generateApiService.get(
      CourseApi.getStudentByCourse(id ,pageToken, pageSize )
    );

    if (response) {
      return {
        data: response,
        success: true,
      };
    }
    return response;
  };

  const handleRequestStudents = useCallback(
    (pageToken: number, pageSize: number) => {
      return onGetAllStudent(id, pageToken, pageSize);
    },
    [id ,onGetAllStudent]
  );

  const students = useHandleResponsePagination<any>(
    handleRequestStudents,
    20,
    true
  );
  const onRefresh = useCallback(() => {
    students.pullToRefresh();
  }, [id]);

  const onEndReached = useCallback(() => {
    students.handleLoadMore();
  }, [id]);

  useEffect(() => {    
    if(id) {
    students.refresh();
    }
  }, [id]);
  const keyExtractor = useCallback((_: any, index: number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReachedStudent : onEndReached,
    students,
    onRefreshStudent : onRefresh,
  };
};
