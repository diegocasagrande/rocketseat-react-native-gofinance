import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { HistoryCard } from "../../components/HistoryCard";
import theme from "../../global/styles/theme";
import { categories } from "../../utils/categories";
import {
  ActivityIndicatorView, ChartContainer, Container,
  Content,
  Header, Month, MonthSelect,
  MonthSelectButton,
  MonthSelectIcon, Title
} from "./styles";

interface TransactionData {
  id: string;
  title: string;
  amount: string;
  type: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormated: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(true);

  function handleSelectMonth(action: "prev" | "next") {
    if (action === "prev") {
      setSelectedDate(subMonths(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormated = response ? JSON.parse(response) : [];

    let totalByCategory: CategoryData[] = [];

    const expensives = responseFormated.filter(
      (transaction: TransactionData) =>
        transaction.type === "negative" &&
        new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );

    // console.log(expensives);

    const expensivesTotal = expensives.reduce(
      (accumulator: number, transaction: TransactionData) => {
        return accumulator + Number(transaction.amount);
      },
      0
    );

    const revenues = responseFormated.filter(
      (transaction: TransactionData) => transaction.type === "positive"
    );

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((transaction: TransactionData) => {
        if (transaction.category === category.name) {
          categorySum += Number(transaction.amount);
        }
      });

      if (categorySum > 0) {
        const total = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormated: total,
          color: category.color,
          percent,
        });
      }

      // console.log("totalByCategory");
      // console.log(totalByCategory);
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <ActivityIndicatorView>
          <ActivityIndicator size="large" color={useTheme().colors.primary} />
        </ActivityIndicatorView>
      ) : (
        <>
          <Content
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              padding: 24,
              paddingBottom: useBottomTabBarHeight() + 300,
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleSelectMonth("prev")}>
                <MonthSelectIcon
                  name="arrow-left"
                  size={24}
                  color={theme.colors.primary}
                />
              </MonthSelectButton>

              <Month>
                {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
              </Month>

              <MonthSelectButton onPress={() => handleSelectMonth("next")}>
                <MonthSelectIcon
                  name="arrow-right"
                  size={24}
                  color={theme.colors.primary}
                />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </ChartContainer>

            {totalByCategories.map((category) => (
              <HistoryCard
                key={category.key}
                title={category.name}
                amount={category.totalFormated}
                color={category.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
