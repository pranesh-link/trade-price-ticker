import styled from "styled-components";

export const FlexBox = styled.div<{
  justifyContent?: string;
  alignItems?: string;
  direction?: string;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  justify-content: ${(props) => props.justifyContent || "normal"};
  align-items: ${(props) => props.alignItems || "normal"};
`;
