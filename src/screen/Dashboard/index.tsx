import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGretting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    ActivityIndicatorView,
 } from "./styles";
 
export interface DataListProps extends TransactionCardProps {
     id: string,
   }
   interface HighlightProps {
    amount: string; 
    date: string;
  }
  
  interface HighlightData {
    entries: HighlightProps;
    expansives: HighlightProps; 
    total: HighlightProps;
  }

   
export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [HighlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

function getLastDateTransaction(collection: DataListProps[], type: "negative" | "positive"): string {
    const lastTransaction = new Date (Math.max.apply(Math,
      collection.filter((transaction: DataListProps) => transaction.type === type)
                .map((transaction: DataListProps) => new Date(transaction.date).getTime())
    ));
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    

  }


  async function loadTransactions() {
    const dataKey = "@gofinances:transactions";
    const data = await AsyncStorage.getItem(dataKey);
    const transactions = data ? JSON.parse(data) : [];
    
    let entriesTot = 0;
    let expansivesTot = 0
    ;
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {


      if (item.type === "positive") {
        entriesTot += Number(item.amount);
      } else {
        expansivesTot += Number(item.amount);
      }


      const amount = Number(item.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const date = Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: '2-digit', year: '2-digit'}).format(new Date(item.date));
      // console.log(item.type);




      
      return { 
        name: item.name, 
        amount, 
        date,
        id: item.id,
        category: item.category,
        type: item.type,
      };
    });

    const lastEntries = getLastDateTransaction (transactionsFormatted, "positive");
    const lastExpansives = getLastDateTransaction(transactionsFormatted, "negative");
    setHighlightData({
      entries: {
        amount: entriesTot.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        date: `Última entrada ${lastEntries}`,
      },
      expansives: {
        amount: expansivesTot.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        date: `Última saída ${lastExpansives}`,
      },
      total: {
        amount: (entriesTot - expansivesTot).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        date: `01 à ${lastEntries}`,
      },
    })
    setTransactions(transactionsFormatted);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  
    
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));
  
//   const data: DataListProps[]= [
//     {
//       id: '1',
//       type: 'positive',
//       title: "Desenvolvimento de site",
//       amount: "R$ 12.000,00",
//       category: {
//         name: 'Vendas', icon: 'dollar-sign'} ,
//       date: "12/02/2021",
//     },
//     {
//       id: '2',
//       type: 'negative',
//       title: "Hamburgueria Pizzy",
//       amount: "R$ 80,00",
//       category: {
//         name: 'Alimentação', icon: 'coffee'} ,
//       date: "12/02/2021",
//     },
//     {
//       id: '3',
//       type: 'negative',
//       title: "Aluguel do apartamento",
//       amount: "R$ 1.000,00",
//       category: {
//         name: 'Casa', icon: 'shopping-bag'} ,
//       date: "12/02/2021",
//     },    
// ];


  return (
    <Container >
      {isLoading ? (
        <ActivityIndicatorView>
          <ActivityIndicator size="large" color={useTheme().colors.primary} />
        </ActivityIndicatorView>
      ) : (
        <>
          <Header>
              <UserWrapper>
                <UserInfo>
                    <Photo source={ {uri: 'https://avatars.githubusercontent.com/u/30899645?s=400&u=acadafda6153483787c94b1721a62cb494ca3907&v=4'} }/>
                    <User>
                        <UserGretting> Olá, </UserGretting>         
                        <UserName> Diego </UserName>
                    </User>
                </UserInfo>
                <LogoutButton onPress={()=>{}}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>

          </Header>
          <HighlightCards>
            <HighlightCard type="up" title="Entradas" 
                amount={HighlightData.entries.amount} lastTransaction={HighlightData.entries.date}/>
            <HighlightCard type="down" title="Saídas" 
                amount={HighlightData.expansives.amount} lastTransaction={HighlightData.expansives.date}/>
            <HighlightCard type="total" title="Total" 
                amount={HighlightData.total.amount} lastTransaction={HighlightData.total.date}/>
          </HighlightCards>

          <Transactions>
            <Title>
                Listagem
            </Title>
            <TransactionList  
              data={ transactions } 
              keyExtractor={ (item ) => item.id }
              renderItem={ ( { item } ) => <TransactionCard data={item} /> } 
            />
            

          </Transactions>
        </>
      )}
    </Container>
  );
}