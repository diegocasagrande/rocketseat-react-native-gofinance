import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

export const Container = styled(RectButton).attrs(
    {
        activeOpacity: 0.7,
    }
)`
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 18px 16px;


    /* width: 100%;
    font-family: ${({ theme }) => theme.font.regular};;
    font-size: ${RFValue(14)}px;
    color:  ${({ theme }) => theme.colors.text_dark};

    border-radius: 5px;
    margin-bottom: 8px; */
`;

export const Category = styled.Text`
    font-family: ${({ theme }) => theme.font.regular};;
    font-size: ${RFValue(14)}px;
    color:  ${({ theme }) => theme.colors.text_dark};

`;

export const Icon = styled(Feather)`
    color:  ${({ theme }) => theme.colors.text};
    font-size: ${RFValue(20)}px;

`;
