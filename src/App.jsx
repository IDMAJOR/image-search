import React, { useEffect, useState ,useRef } from 'react'
import axios from 'axios';
import './index.css'

const API_URL = 'https://api.unsplash.com/search/photos'
const IMAGE_PER_PAGE = 20;

function App() {
  const [imageSrc, setImageSrc] = useState([])
  const [imageCount, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [enlarged, setEnlarged] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const searchInput = useRef(null);
  

  useEffect(() => {
    fetchImages();
  }, [page])

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`);
      setImageSrc(data.results); // Update this line
      setCount(data.total_pages);
      console.log(`${searchInput.current.value}`, data.results);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePage(){
    fetchImages();
    setPage(1);
  }

  const handleSearch = (event) => {
    event.preventDefault();
    handlePage()
  }

  const handleSelection = (value) => {
    searchInput.current.value = value;
    handlePage()
  }

  const fullLenght = () => {
    setEnlarged(enlarged);
    // console.log(enlarged)
  }

  const handleSelectedImage = (index) => {
    fullLenght()
    setSelectedImage((prevIndex) => (prevIndex === index ? null : index));
    console.log(selectedImage);
  }


  const getContainerStyles = () => {
    // Define your base styles
    let styles = {
      cursor: 'pointer',
      transition: 'transform 0.3s',
    };

    // Add additional styles when isEnlarged is true
    if (enlarged) {
      styles = {
        ...styles,
        transform: 'scale(1.5)',
        width: '50vw',
        height: '70vh',
        position: 'fixed',
        top: '15%',
        left: '25%',
        zIndex: 1000,
      };
    }

    return styles;
  };

  // console.log(page);

  return (
    <>
      <div className="container">
        <h1>image search</h1>
        <div className='function-div'>
          <form onSubmit={handleSearch} className='form-con'>
            <input 
              type='search'
              placeholder='Type your desired image...'
              ref={searchInput}
              className='search-input'
            />
            <button>search</button>
          </form>
        </div>
        <div className="default-search">
            <div onClick={() => handleSelection("Nature")}>Nature</div>
            <div onClick={() => handleSelection("technology")}>technology</div>
            <div onClick={() => handleSelection("people")}>people</div>
            <div onClick={() => handleSelection("shoes")}>shoes</div>
            <div onClick={() => handleSelection("background")}>background</div>
            <div onClick={() => handleSelection("shapes")}>shapes</div>
            
        </div>
        <div className='images-div'>
            {
              imageSrc.map((ima, index) => {
                
                return(
                  <img 
                  className='cool-image'
                  style={{
                    border: `2px solid ${selectedImage === index ? 'green' : 'black'}`,
                    // transform: `scale(${selectedImage === index ? 2 : 1})`,
                    width: `${selectedImage === index ? '100%' : ''}`,
                    position: `${selectedImage === index ? 'absolute' : ''}`,
                    top: `${selectedImage === index ? '50%' : ''}`,
                    left: `${selectedImage === index ? '5%' : ''}`,
                    zIndex: `${selectedImage === index ? '100' : ''}`,
                    imageRendering: 'pixelated',
                    boxShadow: '2px 2px 10px black'
                    // Add other styles as needed
                  }}
                  key={ima.id} 
                  title='Click to exit/open'
                  src={ima.urls.small} 
                  onClick={() => handleSelectedImage(index)}/>
                )
              })
            }
        </div>
        <div className='buttons'>
          {
            page > 1 &&(
              <button onClick={() => setPage(page - 1)}>Previous</button>
            )
          }
          {
            page < imageCount &&(
              <button onClick={() => setPage(page + 1)}>Next</button>
            )
          }
        </div>
      </div>
    </>
  )
}

export default App
