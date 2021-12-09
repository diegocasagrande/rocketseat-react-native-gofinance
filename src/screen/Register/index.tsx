import React, { useState, useEffect } from "react";
import { 
  TouchableWithoutFeedback, 
  Keyboard, 
  Modal,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/Form/Button";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";
import { 
    Container, 
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
 } from "./styles";
import { DataListProps } from "../Dashboard";

 interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
  name: Yup
            .string()
            .required("Descrição é um campo obrigatório"),
  amount: Yup
            .number()
            .typeError("Informe um valor númerico")
            .positive("Informe um valor positivo")
            .required("O valor é obrigatório"),
});




 
export function Register() {
  const [category, setCategory] = useState({
    key: "category",
    name: "Category",
    });
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(Boolean);


  const navigation = useNavigation();
  const dataKey = "@gofinances:transactions";

  function handleTransactionType(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCategoryModalOpen() {
    setCategoryModalOpen(true);
  }

  function handleCategoryModalClose() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    const newTransaction = {
      id: String(uuid.v4()),
      ...form,
      category: category.name,
      type: transactionType === 'up' ? 'positive' : 'negative',
      date: new Date(),
    };

    if (newTransaction.name === undefined || newTransaction.name === "") {
      return Alert.alert("Error", "Please inform the name of the transaction");
    }

    if (newTransaction.amount === undefined) {
      return Alert.alert("Error", "Please inform the amout of the transaction");
    }

    if (transactionType === "") {
      return Alert.alert("Error", "Please select a transaction type");
    }

    if (category.key === "Category") {
      return Alert.alert("Error", "Please select a category");
    }


    // console.log(data);
    try {

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      
      // currentData.push(data);

      const dataFormatted = [...currentData, newTransaction];


      // console.log(dataFormatted);
      
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));


      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Category",
      });

      navigation.navigate("Listagem");

    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar")
    }

  }

  const {
    control, 
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(
    { resolver: yupResolver(schema) }
  );


  useEffect(() => {
      async function loadData(){
        const data = await AsyncStorage.getItem(dataKey);
        // console.log(JSON.parse(data!));
        

      }

      loadData();


      // async function removeAll() {
      //   await AsyncStorage.removeItem(dataKey);
      // }
      // removeAll();

    },[]);



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container >
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>
      <Form>
        <Fields>
          <InputForm 
            name="name"
            control={control}
            placeholder="Nome"  
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />
          <InputForm 
            name="amount"
            control={control}
            placeholder="Preço" 
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
          />
          <TransactionTypes>
            <TransactionTypeButton 
              type="up" 
              title="Income" 
              onPress={()=>handleTransactionType('up')} 
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton 
              type="down" 
              title="Outcome" 
              onPress={()=>handleTransactionType('down')} 
              isActive={transactionType === 'down'}
            />
          </TransactionTypes>
          <CategorySelectButton 
            title={category.name}
            onPress={handleCategoryModalOpen}
          />
        </Fields>
        <Button 
          title="Enviar"
          onPress={handleSubmit(handleRegister)} 
        />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect 
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCategoryModalClose}
        />
      </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}