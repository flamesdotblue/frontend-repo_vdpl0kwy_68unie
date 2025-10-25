import React from 'react';
import Header from './components/Header.jsx';
import LogoSection from './components/LogoSection.jsx';
import SearchBox from './components/SearchBox.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <Header />
      <main className="flex flex-col items-center w-full">
        <LogoSection />
        <SearchBox />
      </main>
      <Footer />
    </div>
  );
}

export default App;
