import {
  Add,
  Arrow,
  Button,
  DropDown,
  Input,
  Modal,
  Search,
} from '@team-aliens/design-system';
import { Dispatch, useState } from 'react';
import styled from 'styled-components';
import {
  PointEnum,
  PointType,
  useAddPointOption,
  useGivePointOption,
} from '@/apis/points';
import { AllPointsOptionResponse } from '@/apis/points/response';
import {
  PointOptionRequest,
  SearchPointOptionsRequest,
} from '@/apis/points/request';
import { useDropDown } from '@/hooks/useDropDown';
import { useForm } from '@/hooks/useForm';
import { PointItem } from '../main/DetailBox/PointItem';
import { usePointHistoryList } from '@/hooks/usePointHistoryList';
import { useToast } from '@/hooks/useToast';
import { useSelectedStudentIdStore } from '@/store/useSelectedStudentIdStore';
import { useModal } from '@/hooks/useModal';
import { useQueryClient } from '@tanstack/react-query';

interface PropsType {
  allPointOptions: AllPointsOptionResponse;
}

const canClick = true;

export function GivePointOptionsModal({ allPointOptions }: PropsType) {
  const [newItem, setNewItem] = useState(true);
  const [selectedStudentId, reresetStudentIdset] = useSelectedStudentIdStore(
    (store) => [store.selectedStudentId, store.resetStudentId],
  );
  const [selectedPointOption, setSelectedPointOption] = useState<{
    id: string;
    type: PointType;
  }>({
    id: '',
    type: 'ALL',
  });
  const { toastDispatch } = useToast();
  const { onDropDownChange, sort } = useDropDown<string>('');

  const { state: pointOptionState, onHandleChange: pointOptionStateHandler } =
    useForm<SearchPointOptionsRequest>({
      point_option_name: '',
    });

  const { state: addPointOption, onHandleChange: addPointOptionHandler } =
    useForm<PointOptionRequest>({
      score: 0,
      name: '',
    });
  const { score: scoreOption, name: nameOption } = addPointOption;

  const newItemInput = () => {
    setNewItem(!newItem);
  };

  const onClickPointOption = (
    id: string,
    name: string,
    score: number,
    type: PointType,
  ) => {
    setSelectedPointOption({
      id,
      type,
    });
    if (!selectedPointOption) {
      setNewItem(true);
    }
  };

  const queryClient = useQueryClient();

  const { addPointOptionToStudents } = usePointHistoryList();
  const givePointOptionAPI = useGivePointOption(
    selectedPointOption.id,
    selectedStudentId.filter((i) => i),
    {
      onSuccess: () => {
        addPointOptionToStudents(
          allPointOptions.point_options.find(
            (option) => option.point_option_id === selectedPointOption.id,
          ),
        );
        toastDispatch({
          actionType: 'APPEND_TOAST',
          toastType: 'SUCCESS',
          message: `${PointEnum[selectedPointOption.type]}이 부여되었습니다.`,
        });
        queryClient.invalidateQueries(['getAllPointHistory']);
        reresetStudentIdset();
        setSelectedPointOption({
          id: '',
          type: 'ALL',
        });
        closeModal();
      },
      onError: () => {
        toastDispatch({
          actionType: 'APPEND_TOAST',
          toastType: 'ERROR',
          message: '잠시 후 다시 시도해 주세요.',
        });
      },
    },
  );

  const addPointOptionAPI = useAddPointOption(scoreOption, nameOption, sort);

  const { isLoading } = givePointOptionAPI;

  const { closeModal } = useModal();

  return (
    <Modal
      className="grantPoint"
      title="상/벌점 항목을 선택해주세요."
      content=""
      close={closeModal}
      buttonList={[
        <Button
          className="grantPoint"
          margin={newItem && [-40, 0, 0, 0]}
          disabled={
            newItem
              ? !(selectedPointOption.id && selectedStudentId && !isLoading)
              : !(scoreOption && nameOption && sort)
          }
          onClick={
            newItem ? givePointOptionAPI.mutate : addPointOptionAPI.mutate
          }
        >
          {newItem ? '부여' : '추가'}
        </Button>,
      ]}
    >
      <_SearchWrapper className="grantPoint">
        <Search className="Search" />
        <_SearchInput
          className="grantPoint"
          type="text"
          placeholder="ex) 봉사활동"
          name="point_option_name"
          value={pointOptionState.point_option_name}
          onChange={pointOptionStateHandler}
        />
      </_SearchWrapper>
      <_PointOptionList className="grantPoint">
        {allPointOptions?.point_options
          .filter((options) =>
            options.name.includes(pointOptionState.point_option_name),
          )
          .map((options) => {
            const { point_option_id, name, type, score } = options;
            return (
              <PointItem
                key={point_option_id}
                point_history_id={point_option_id}
                name={name}
                type={type}
                score={score}
                canClick={canClick}
                onClick={onClickPointOption}
                OptionSelected={selectedPointOption.id}
              />
            );
          })}
      </_PointOptionList>
      <_AddImgWrapper
        className="grantPoint"
        onClick={newItemInput}
        newItem={newItem}
      >
        {newItem ? (
          <Add className="addImg" />
        ) : (
          <Arrow direction="top" className="addImg" />
        )}
        {newItem ? (
          <_Text className="grantPoint">항목 추가</_Text>
        ) : (
          <_Text className="grantPoint">항목 닫기</_Text>
        )}
      </_AddImgWrapper>
      <_AddInputBigWrapper className="grantPoint">
        {!newItem && (
          <Input
            className="grantPoint"
            width={478}
            label="이름"
            type="text"
            placeholder="ex) 무단 외출"
            name="name"
            value={nameOption}
            onChange={addPointOptionHandler}
          />
        )}
        <_AddInputSmallWrapper className="grantPoint">
          {!newItem && (
            <Input
              className="grantPoint"
              width={243}
              label="점수"
              type="number"
              placeholder="ex) 12 (숫자만 입력)"
              name="score"
              value={scoreOption}
              onChange={addPointOptionHandler}
            />
          )}
          {!newItem && (
            <DropDown
              className="grantPoint"
              width={216}
              label="타입"
              placeholder="상/벌점"
              items={['상점', '벌점']}
              value={sort}
              onChange={onDropDownChange}
            />
          )}
        </_AddInputSmallWrapper>
      </_AddInputBigWrapper>
    </Modal>
  );
}

const _SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  .Search {
    position: absolute;
    top: 8px;
  }
`;

const _SearchInput = styled.input`
  width: 202px;
  height: 40px;
  border-bottom: 1px solid #dddddd;
  padding: 0px 0px 0px 30px;
  font-size: 16px;
`;

const _AddImgWrapper = styled.div<{ newItem: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 35px;
  cursor: pointer;
  width: 85px;
  margin-bottom: ${({ newItem }) => (newItem ? '-20px' : '20px')};
  .addImg {
    width: 17px;
    margin-right: 10px;
  }
`;

const _Text = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #555555;
`;

const _PointOptionList = styled.div`
  overflow: scroll;
  height: 22vh;
  > div {
    margin-bottom: 9px;
  }
`;

const _AddInputBigWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const _AddInputSmallWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;
