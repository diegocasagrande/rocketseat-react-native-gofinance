import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface TransactionProps {
    type: 'negative' | 'positive';
}

export const Container = styled.View`
    background-color: ${({ theme }) =>  theme.colors.shape};
    border-radius: 5px;
    padding: 17px 24px;
    margin-bottom: 16px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.font.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.text_dark};
`;

export const Amount = styled.Text<TransactionProps>`
    font-family: ${({ theme }) => theme.font.regular};
    font-size: ${RFValue(20)}px;
    margin-top: ${RFValue(2)}px;

    ${(props) => props.type === 'positive' && css`
        color: ${({ theme }) => theme.colors.success};
    `}

    ${(props) => props.type === 'negative' && css`
        color: ${({ theme }) => theme.colors.attention};
    `}

`;

export const Footer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

export const Category = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(16)}px;
    color: ${({ theme }) => theme.colors.text};   
    color: ${({ theme }) => theme.colors.text};
    padding-right: 8px;


`;

export const CategoryName = styled.Text`
    color: ${({ theme }) => theme.colors.text};
`;

export const Date = styled.Text`
    color: ${({ theme }) => theme.colors.text};
`;

