import styled, { css } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from "react-native-gesture-handler";


export const Button = styled(RectButton)`
    height: ${RFValue(56)}px;

    background-color: ${props => props.theme.colors.shape};
    border-radius: ${RFValue(5)}px;
    
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;

`;

export const ImageContainer = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;

    padding: ${RFValue(16)}px;
    border-color: ${props => props.theme.colors.text};
    border-right-width: 1px;
`;

export const Text = styled.Text`
    flex: 1;
    text-align: center;

    font-family: ${props => props.theme.font.medium};
    font-size: ${RFValue(14)}px;
`;