import { useCallback } from "react";

import React from "react";
import { useHandleResponsePagination } from "../../../../hooks/useHandleResponsePagination";
import { generateApiService } from "../../../../services/ApiService";
import { StudentApi } from "../../../../services/api/Student/StudentApi";

export const useAllStudentManage = ({ id }: { id: number }) => {
    const [queryInputStu, setQueryInputStu] = React.useState<string>("");
    const checkVadidateStudent = async (inputValue: any) => {
        if (inputValue.length <= 255) {
          setQueryInputStu(inputValue);
        } else {
          setQueryInputStu("");
        }
      };
      
  const onGetAllStudent = async (
    id: number,
    pageToken: number,
    pageSize: number,
    queryInputStu: string
  ) => {
   
    const response = await generateApiService.get(
      StudentApi.getStudentNotInCourse(
        id,
        pageToken,
        pageSize,
        queryInputStu || ""
      )
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
      return onGetAllStudent(id, pageToken, pageSize, queryInputStu);
    },
    [id, onGetAllStudent, queryInputStu]
  );

  const listStudent = useHandleResponsePagination<any>(
    handleRequestStudents,
    20,
    false
  );

  const onRefresh = useCallback(() => {
    listStudent.pullToRefresh();
  }, [id]);

  const onEndReached = useCallback(() => {
    // listStudent.handleLoadMore();
  }, [id]);
  
  React.useEffect(() => {
    if (queryInputStu && id) {
      const timeout = setTimeout(async () => {
        setQueryInputStu(queryInputStu);       
          listStudent.refresh();
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      if (id) {
        listStudent.refresh();
      }
    }
  }, [queryInputStu, id]);
  
  return {
    onEndReachedAllStudent: onEndReached,
    listStudent,
    onRefreshAllStudent: onRefresh,
    checkVadidateStudent ,
    queryInputStu  ,
    setQueryInputStu
  };
};
