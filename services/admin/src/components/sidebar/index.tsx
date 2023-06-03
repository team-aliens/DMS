import styled from 'styled-components';
import React from 'react';
import { Escape, Text } from '@team-aliens/design-system';
import OutsideClickHandler from 'react-outside-click-handler';

interface PropsType {
  title?: string;
  children: React.ReactNode;
  close: () => void;
}

export function SideBar({ title, children, close }: PropsType) {
  return (
    <OutsideClickHandler onOutsideClick={close}>
      <_Wrapper>
        <_EscapeWrapper onClick={close}>
          <Escape size={24} />
        </_EscapeWrapper>
        <Text color="gray10" size="titleL" margin={['top', 50]}>
          {title}
        </Text>
        {children}
      </_Wrapper>
    </OutsideClickHandler>
  );
}

const _Wrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding: 40px 40px 30px 40px;
  top: 0;
  right: 0;
  min-width: 418px;
  height: 100%;
  z-index: 3;
  background-color: ${({ theme }) => theme.color.gray1};
  box-shadow: 0px 2px 20px 4px rgba(0, 0, 0, 0.16);
`;

const _EscapeWrapper = styled.div`
  height: 24px;
  cursor: pointer;
`;
