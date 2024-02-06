import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Main from '../components/main';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';


const MainPage = () => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];

  useEffect(() => {
    document.title = translatedData.title
  }, [language, translatedData]);

  const [initialAmount, setInitialAmount] = useState('');
  const [money, setMoney] = useState('$');


  return (
    <div className='main-page'>
      <Header initialAmount={initialAmount} setInitialAmount={setInitialAmount} money={money} setMoney={setMoney}/>
      <Main initialAmount={initialAmount} setInitialAmount={setInitialAmount} money={money}/>
    </div>
  );
};

export default MainPage;