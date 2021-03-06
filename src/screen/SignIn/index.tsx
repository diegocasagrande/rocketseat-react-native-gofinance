
import React, { useContext } from "react";
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SingInTitle,
  Footer,
  FooterWrapper,
} from "./styles";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";
import { RFValue } from "react-native-responsive-fontsize";

import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import { Alert } from "react-native";

export function SignIn() {
  const { signInWithGoogle } = useAuth();
  
  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login");
    }
  }
 
  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {`\n`}
            finanças de forma {`\n`}
            muito simples
          </Title>
          <SingInTitle>
            Faça seu login com {`\n`}
            umas das contas abaixo 
          </SingInTitle>
        </TitleWrapper>
      </Header>     
      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com o Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
          <SignInSocialButton title="Entrar com o Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
