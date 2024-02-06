import React from 'react';
import MainPage from './pages/mainPage';
import { LanguageProvider } from './languages/LanguageContext';

function App() {
  return (

      <div className="App">
        <LanguageProvider>
          <MainPage />
        </LanguageProvider>
      </div>

  );
}

export default App;
