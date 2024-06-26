import { Button, DropDown, Input, Modal } from '@team-aliens/design-system';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useGetRemainTime, useSetRemainTime } from '@/hooks/useRemainApi';
import { getDayWithText, getTextWithDay } from '@/utils/translate';
import { useModal } from '@/hooks/useModal';
import { useForm } from '@/hooks/useForm';
import { hourToArray, minToArray } from '@/utils/timeToArray';
import { fetchOutingTimeSetting } from '@/apis/outing';
import { SettingOutingRequestType } from '@/apis/outing/request';
import { useToast } from '@/hooks/useToast';

interface ITimeState {
  startDay: string;
  startHour: string;
  startMin: string;
  endDay: string;
  endHour: string;
  endMin: string;
}

const dayToArray = ['월', '화', '수', '목', '금', '토', '일'];
export default function OutingTimeModal() {
  const { data: remainTime } = useGetRemainTime();
  const { state: timeState, setState: setTimeState } = useForm<ITimeState>({
    startDay: getTextWithDay(remainTime?.start_day_of_week),
    startHour: remainTime?.start_time.slice(0, 2),
    startMin: remainTime?.start_time.slice(3, 5),
    endDay: getTextWithDay(remainTime?.end_day_of_week),
    endHour: remainTime?.end_time.slice(0, 2),
    endMin: remainTime?.end_time.slice(3, 5),
  });
  const { closeModal } = useModal();
  const { toastDispatch } = useToast();

  useEffect(() => {
    setTimeState({
      startDay: getTextWithDay(remainTime?.start_day_of_week),
      startHour: remainTime?.start_time.slice(0, 2),
      startMin: remainTime?.start_time.slice(3, 5),
      endDay: getTextWithDay(remainTime?.end_day_of_week),
      endHour: remainTime?.end_time.slice(0, 2),
      endMin: remainTime?.end_time.slice(3, 5),
    });
  }, [remainTime, setTimeState]);

  const onClick = () => {
    const requestBody: SettingOutingRequestType = {
      day_of_week: getDayWithText(timeState.startDay),
      outing_time: `${timeState.startHour}:${timeState.startMin}:00`,
      arrival_time: `${timeState.endHour}:${timeState.endMin}:00`,
    };

    fetchOutingTimeSetting(requestBody)
      .then(() => {
        toastDispatch({
          actionType: 'APPEND_TOAST',
          toastType: 'SUCCESS',
          message: '외출 시간이 성공적으로 설정되었습니다.',
        });
      })
      .catch(() => {
        toastDispatch({
          actionType: 'APPEND_TOAST',
          toastType: 'ERROR',
          message: '외출 시간 설정에 실패했습니다.',
        });
      });
  };

  const onChangeDropDown = (value: string, key: string) => {
    setTimeState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal
      title="외출 신청 시간 설정"
      inputList={[
        <_TimeWrapper key={'time'}>
          <DropDown
            items={dayToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'startDay')}
            value={timeState.startDay}
            width={45}
          />
          <p className="day">요일</p>
          <DropDown
            items={hourToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'startHour')}
            value={timeState.startHour}
            width={65}
          />
          <p className="day">:</p>
          <DropDown
            items={minToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'startMin')}
            value={timeState.startMin}
            width={65}
          />
          <p className="to">~</p>
          <DropDown
            items={dayToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'endDay')}
            value={timeState.endDay}
            width={45}
          />
          <p className="day">요일</p>
          <DropDown
            items={hourToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'endHour')}
            value={timeState.endHour}
            width={65}
          />
          <p className="day">:</p>
          <DropDown
            items={minToArray}
            placeholder={''}
            onChange={(value) => onChangeDropDown(value, 'endMin')}
            value={timeState.endMin}
            width={65}
          />
        </_TimeWrapper>,
      ]}
      buttonList={[
        <Button key={'okay'} color="primary" onClick={onClick}>
          확인
        </Button>,
      ]}
      close={closeModal}
    />
  );
}

const _TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  > .to {
    margin: 0 12px;
  }
  > div > label > input {
    text-align: center;
  }
`;
