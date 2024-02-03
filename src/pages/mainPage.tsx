import React, { useState } from 'react';
import Header from '../components/header';
import Main from '../components/main';


const MainPage = () => {

  const [initialAmount, setInitialAmount] = useState('');
  const [money, setMoney] = useState('$');


  return (
    <div className='main-page'>
      <Header initialAmount={initialAmount} setInitialAmount={setInitialAmount} money={money} setMoney={setMoney}/>
      <Main initialAmount={initialAmount} money={money}/>
    </div>
  );
};

export default MainPage;