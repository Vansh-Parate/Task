import { useState, useEffect } from 'react'

function App() {
  const [language, setLanguage] = useState('sv')
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [termsData, setTermsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)

  const toggleDropdown = () => setShowDropdown(!showDropdown)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Navigation content (this could also come from database if needed)
  const navContent = {
    sv: {
      home: "Hem",
      order: "Beställ",
      customers: "Våra Kunder",
      about: "Om oss",
      contact: "Kontakta oss",
      language: "Svenska",
    },
    en: {
      home: "Home",
      order: "Order",
      customers: "Our Customers",
      about: "About us",
      contact: "Contact Us",
      language: "English",
    },
  }

  // Fetch terms data from database
  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Use Render URL in production, relative URL in development
        const apiUrl = import.meta.env.PROD 
          ? 'https://task-ddfi.onrender.com/api/terms'
          : `/api/terms`
        
        const response = await fetch(`${apiUrl}?lang=${language}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTermsData(data)
      } catch (err) {
        console.error('Failed to fetch terms:', err)
        setError('Failed to load terms content')
      } finally {
        setLoading(false)
        setIsLanguageChanging(false)
      }
    }

    fetchTerms()
  }, [language])

  const handleLanguageChange = (newLang) => {
    setIsLanguageChanging(true)
    setLanguage(newLang)
    setShowDropdown(false)
  }

  const currentNav = navContent[language]

  if (loading && !termsData) {
    return (
      <div className="terms-page">
        <div className="background-container">
          <img 
            id="background-image"
            className="background-image"
            src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
            alt="Background"
          />
        </div>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="terms-page">
        <div className="background-container">
          <img 
            id="background-image"
            className="background-image"
            src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
            alt="Background"
          />
        </div>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.2rem',
          textAlign: 'center'
        }}>
          <div>Error: {error}</div>
          <div style={{ fontSize: '1rem', marginTop: '1rem' }}>
            Please check if the database is running and populated.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="terms-page">
      {/* Background Container */}
      <div className="background-container">
        <img 
          id="background-image"
          className="background-image"
          src="https://storage.123fakturera.se/public/wallpapers/sverige43.jpg"
          alt="Background"
        />
      </div>

      {/* Navigation */}
      <nav className="navigation-out">
        <header className="navigation-header">
          <section className="navigation-section">
            {/* Logo - Desktop Only */}
            <div className="logoa">
              <a href="/">
                <img alt="" className="navigation-logo" src="https://storage.123fakturera.se/public/icons/diamond.png" />
              </a>
            </div>
            
            {/* Hamburger Menu Button - Mobile/Tablet Only */}
            <div className="hamburger-menu-container">
              <div className="hamburger-menu" onClick={toggleMenu}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="hamburger-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
                </svg>
              </div>
              
              {/* Hamburger Dropdown Menu */}
              {isMenuOpen && (
                <div className="hamburger-dropdown">
                  <a className="hamburger-menu-item" href="#">
                    <span className="hamburger-menu-text">{currentNav.home}</span>
                  </a>
                  <a className="hamburger-menu-item" href="#">
                    <span className="hamburger-menu-text">{currentNav.order}</span>
                  </a>
                  <a className="hamburger-menu-item" href="#">
                    <span className="hamburger-menu-text">{currentNav.customers}</span>
                  </a>
                  <a className="hamburger-menu-item" href="#">
                    <span className="hamburger-menu-text">{currentNav.about}</span>
                  </a>
                  <a className="hamburger-menu-item" href="#">
                    <span className="hamburger-menu-text">{currentNav.contact}</span>
                  </a>
                </div>
              )}
            </div>
            
            {/* Desktop Navigation Menu */}
            <div className="navigation-menu-bar">
              <div className="pc-menu">
                <a className="pc-menu-items" href="#">
                  <span className="collectionSpan">
                    <p className="collectionitem">{currentNav.home}</p>
                  </span>
                </a>
                <a className="pc-menu-items" href="#">
                  <span className="collectionSpan">
                    <p className="collectionitem">{currentNav.order}</p>
                  </span>
                </a>
                <a className="pc-menu-items" href="#">
                  <span className="collectionSpan">
                    <p className="collectionitem">{currentNav.customers}</p>
                  </span>
                </a>
                <a className="pc-menu-items" href="#">
                  <span className="collectionSpan">
                    <p className="collectionitem">{currentNav.about}</p>
                  </span>
                </a>
                <a className="pc-menu-items" href="#">
                  <span className="collectionSpan">
                    <p className="collectionitem">{currentNav.contact}</p>
                  </span>
                </a>
                <a className="pc-menu-items language-pc-menu-items" href="#" onClick={toggleDropdown}>
                  <div>
                    <div className={`language-title-box ${showDropdown ? 'dropdown-open' : ''}`}>
                      <p className="language-name">{currentNav.language}</p>
                      <img src={language === "sv" ? "https://storage.123fakturere.no/public/flags/SE.png" : "https://storage.123fakturere.no/public/flags/GB.png"} className="flag-icon drop-down-image" alt="" />
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="lang-drop">
                <div className="lang-drop-container">
                                  <div className="dropdownList" style={{ display: showDropdown ? 'block' : 'none' }}>
                  <div className={`language-Svenska drop-down-element ${language === 'sv' ? 'selected' : ''}`} onClick={() => handleLanguageChange('sv')}>
                    <div className="drop-down-lang-name">Svenska</div>
                    <div className="drop-down-image-div">
                      <img src="https://storage.123fakturere.no/public/flags/SE.png" className="drop-down-image" alt="Svenska" />
                    </div>
                  </div>
                  <div className={`language-English drop-down-element ${language === 'en' ? 'selected' : ''}`} onClick={() => handleLanguageChange('en')}>
                    <div className="drop-down-lang-name">English</div>
                    <div className="drop-down-image-div">
                      <img src="https://storage.123fakturere.no/public/flags/GB.png" className="drop-down-image" alt="English" />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Language Toggle */}
            <div className="lang-dropk">
              <div>
                <div className="dropdownContainer">
                  <div className="language-box" onClick={toggleDropdown}>
                    <p className="flag-name collectionitem">{currentNav.language}</p>
                    <img src={language === "sv" ? "https://storage.123fakturere.no/public/flags/SE.png" : "https://storage.123fakturere.no/public/flags/GB.png"} className="icon-flag-nav" alt={currentNav.language} />
                  </div>
                </div>
                <div className="dropdownList" style={{ display: showDropdown ? 'block' : 'none' }}>
                  <div className={`language-Svenska drop-down-element ${language === 'sv' ? 'selected' : ''}`} onClick={() => handleLanguageChange('sv')}>
                    <div className="drop-down-lang-name">Svenska</div>
                    <div className="drop-down-image-div">
                      <img src="https://storage.123fakturere.no/public/flags/SE.png" className="drop-down-image" alt="Svenska" />
                    </div>
                  </div>
                  <div className={`language-English drop-down-element ${language === 'en' ? 'selected' : ''}`} onClick={() => handleLanguageChange('en')}>
                    <div className="drop-down-lang-name">English</div>
                    <div className="drop-down-image-div">
                      <img src="https://storage.123fakturere.no/public/flags/GB.png" className="drop-down-image" alt="English" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </header>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Title */}
        <h1 className="page-title">{termsData?.title || 'Terms'}</h1>

        {/* Close Button */}
        <button className="close-button">
          {language === 'sv' ? 'Stäng och gå tillbaka' : 'Close and Go Back'}
        </button>

        {/* Terms Content Box */}
        <div className={`terms-box ${isLanguageChanging ? 'loading' : ''}`}>
          <div className="terms-content">
            {termsData?.content && (
              <div dangerouslySetInnerHTML={{ __html: termsData.content }} />
            )}
          </div>
        </div>

        {/* Bottom Close Button */}
        <button className="bottom-close-button">
          {language === 'sv' ? 'Stäng och gå tillbaka' : 'Close and Go Back'}
        </button>
      </main>
    </div>
  )
}

export default App
