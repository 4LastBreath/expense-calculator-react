import React, { useState, useEffect } from 'react';
import InputsContainer from './inputContainer';
import ButtonsContainer from './buttonsContainer';
import ModalExportPDF from './modalExportPDF';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';


export interface Item {
  initialName: string;
  name: string;
  value: string;
  sign: '+' | '-';
  checked: boolean;
}

interface MainProps {
  initialAmount: string;
  setInitialAmount: React.Dispatch<React.SetStateAction<string>>;
  money: string;
}

const Main:React.FC<MainProps> = ({initialAmount, setInitialAmount, money}) => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];
  const [showModal, setShowModal] = useState(false);

  const initialData: Item[] = [
    { initialName: 'rent', name: 'Rent', value: '', sign: '-',  checked: false },
    { initialName: 'gas', name: 'Gas', value: '', sign: '-', checked: false },
    { initialName: 'electricity', name: 'Electricity', value: '', sign: '-',  checked: false },
  ];

  const [data, setData] = useState<Item[]>(initialData);

  const [result, setResult] = useState(0);

  const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    const inputValue = e.target.value;

    const dotCount = inputValue.split('.').length - 1;
    const commaCount = inputValue.split(',').length - 1;
  
    if (dotCount + commaCount > 1) {
      return;
    }

    const sanitizedValue = inputValue.replace(/[^0-9.,]+/g, '').replace(/,/g, '.');
    const formattedValue = sanitizedValue.replace(/([.,]\d{2})\d+$/, '$1');

    newData[index].value = formattedValue;
    setData(newData);
  };

  const handleCheckboxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[index].checked = e.target.checked;
    setData(newData);
  };

  const handleSignToggle = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = [...data];
    newData[index].sign = newData[index].sign === '+' ? '-' : '+';
    setData(newData);
  };

  const handleResetValue = (e:React.MouseEvent<HTMLButtonElement>) => {
    const confirm = window.confirm(translatedData.confirmReset)
    if (confirm) {
      const resettedData = data.map(item => ({ ...item, value: '' }));
      setData(resettedData)
      setInitialAmount('')
      setResult(0)
    }
  }

  const calculateRemainingAmount = (): number => {
    const initialAmountNumber = parseFloat(initialAmount);
  
    if (isNaN(initialAmountNumber)) {
      return 0;
    }
  
    return data.reduce((accumulator, item) => {
      const itemValue = item.value !== '' ? parseFloat(item.value) : 0;
  
      if (isNaN(itemValue)) {
        console.error(`Item ${item.name} has an invalid value`);
        return accumulator;
      }
  
      const operation = item.sign === '-' ? -itemValue : itemValue;
      setResult(accumulator + operation)
      return accumulator + operation;

    }, initialAmountNumber);
  };

  useEffect(() => {
    const updateData = data.map((item, index) => {
      if (index < 3 && ['rent', 'gas', 'electricity'].includes(item.initialName)) {
        const translatedName = translatedData[item.initialName];
        return {
          ...item,
          name: translatedName,
        };
      }
      return item;
    });
  
    setData([...updateData]);
  }, [language, translatedData]);

  return (
    <main>
        <InputsContainer  data={data} onInputChange={handleInputChange} onCheckboxChange={handleCheckboxChange} handleSignToggle={handleSignToggle}/>
        <ButtonsContainer
          calculateRemainingAmount={calculateRemainingAmount} 
          setShowModal={setShowModal}
          handleResetValue={handleResetValue}
          data={data}
          setData={setData}
          money={money}
          result={result}
        />
        {showModal && 
            <ModalExportPDF data={data} initialAmount={initialAmount} money={money} calculateRemainingAmount={calculateRemainingAmount} setShowModal={setShowModal}/>
        }
    </main>
  );
};

export default Main;