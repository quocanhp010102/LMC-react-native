import { useCallback, useEffect } from "react";

import { useHandleResponsePagination } from "../../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../../services/ApiService";
import { DepartmentApi } from "../../../../services/api/Departments/DepartmentApi";

export const useListTeacherManage = () => {

  const handleRequestTeachers= useCallback(
    (pageToken: number, pageSize: number) => {   
      return generateApiService.get(DepartmentApi.getLecturer( pageToken ,pageSize) , true);
    },
    []
  );

  const teachers= useHandleResponsePagination<any>(
    handleRequestTeachers,
    20 , true
  );

  const onRefresh = useCallback(() => {
    teachers.pullToRefresh();
  }, []);

  const onEndReached = useCallback(() => {
    teachers.handleLoadMore();
  }, []);

  useEffect(() => {
    teachers.refresh();
  }, []);

  const keyExtractor = useCallback((_ : any, index : number) => {
    return index.toString();
  }, []);

  return {
    keyExtractor,
    onEndReached,
    teachers,
    onRefresh,
  };
};
