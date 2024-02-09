import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Main from '../components/main';
import { dataLanguages  } from '../languages/dataLanguages';
import { useLanguage } from '../languages/LanguageContext';


const MainPage = () => {

  const {language} = useLanguage();
  const translatedData = dataLanguages[language];

  const [selectedProfil, setSelectedProfil] = useState('default')

  const handleSelectProfil = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfil(e.target.value)
    localStorage.setItem('savedProfil', e.target.value)
  }

  useEffect(() => {
    document.title = translatedData.title
  }, [language, translatedData]);

  const [initialAmount, setInitialAmount] = useState('');
  const [money, setMoney] = useState('$');


  return (
    <div className='main-page'>
      <Header initialAmount={initialAmount} setInitialAmount={setInitialAmount} money={money} setMoney={setMoney} selectedProfil={selectedProfil} handleSelectProfil={handleSelectProfil}/>
      <Main initialAmount={initialAmount} setInitialAmount={setInitialAmount} money={money} selectedProfil={selectedProfil} setSelectedProfil={setSelectedProfil}/>
    </div>
  );
};

export default MainPage;