import styled from 'styled-components';
import { Text } from '@team-aliens/design-system';
import {
  GetStudentDetailResponse,
  StudentInfo,
} from '@/apis/managers/response';
import { ModeType } from '@/pages/Home';
import { DetailBox } from './DetailBox';
import { StudentPointHistoryResponse } from '@/apis/points/response';
import { HistoryList } from './HistoryList';
import { PointHistoryList } from '@/context/pointHistoryList';
import { IsUseAbleFeature } from '@/apis/auth/response';
import { useSelectedStudentIdStore } from '@/store/useSelectedStudentIdStore';

interface Props {
  mode: ModeType;
  studentDetail: GetStudentDetailResponse;
  studentList: StudentInfo[];
  availableFeature: IsUseAbleFeature;
  studentPointHistory: StudentPointHistoryResponse;
  studentsPointHistoryList: PointHistoryList[];
}

export function StudentDetail({
  mode,
  studentDetail,
  studentList,
  availableFeature,
  studentPointHistory,
  studentsPointHistoryList,
}: Props) {
  const [selectedStudentId] = useSelectedStudentIdStore((state) => [
    state.selectedStudentId,
  ]);

  return (
    <>
      <_Wrapper isSelected={!selectedStudentId[0]}>
        {mode === 'POINTS' && (
          <>
            <Text size="titleM" color="gray10">
              학생 {selectedStudentId.length}명 선택됨
            </Text>
          </>
        )}
        <_ScrollArea>
          <Text size="titleL" color="gray6">
            {mode === 'GENERAL' && '학생 상세 확인'}
          </Text>
          {mode === 'GENERAL' ? (
            selectedStudentId.length > 0 ? (
              studentDetail && (
                <DetailBox
                  studentDetail={studentDetail}
                  availableFeature={availableFeature}
                  studentPointHistory={studentPointHistory}
                />
              )
            ) : (
              <_NotSelected
                size="bodyL"
                color="gray5"
                display="block"
                margin={['top', 40]}
              >
                학생 목록에서 선택하여 상세 내용을 확인하세요.
              </_NotSelected>
            )
          ) : (
            <HistoryList
              studentList={studentList}
              pointHistoryList={studentsPointHistoryList}
              availableFeature={availableFeature}
            />
          )}
        </_ScrollArea>
      </_Wrapper>
      <_Padding isSelected={Boolean(selectedStudentId[0])} />
    </>
  );
}

const _Padding = styled.div<{
  isSelected: boolean;
}>`
  width: ${({ isSelected }) => (isSelected ? 466 : 300)}px;
  transition: width 0.7s ease-in-out;
  @media screen and (max-width: 1300px) {
    display: none;
  }
`;

const _Wrapper = styled.div<{
  isSelected: boolean;
}>`
  position: fixed;
  top: 168px;
  width: ${({ isSelected }) => (isSelected ? 436 : 180)}px;
  transition: width 0.7s ease-in-out;
  @media screen and (max-width: 1300px) {
    display: none;
  }
`;

const _ScrollArea = styled.div`
  width: 466px;
  height: 600px;
  padding-bottom: 50px;
  padding: 0 8px 60px 8px;
  overflow: scroll;
`;

const _NotSelected = styled(Text)`
  width: 180px;
`;

const _PointWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  > div {
    :last-child {
      margin-left: auto;
    }
  }
`;

const _MateList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const _PointList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
`;
