import React, {Component} from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
// import Ads from './components/Ads';
import {Grid} from './components/GridContainer'
import FontContainer from './components/FontContainer'

axios.defaults.baseURL = 'http://localhost:3000/api'
const adsURL = `http://localhost:3000/ads/?r=${+ Math.floor(Math.random()*1000)}`;


class App extends Component{
  state ={
    ready: 'initial',
    faces: [],
    _page: 1,
    _limit: 20,
    totalpages: null,
    scrolling: false,
    advert: null
  };

  componentWillMount(){
    this.loadFaces()
    this.scrollListener = window.addEventListener('scroll', (e) => {
      this.handleScroll(e)
    })
    this.setState({
      ready: 'loading',
    });
  }
  handleScroll = (e) => {
    const {scrolling, totalpages, _page} = this.state
    if (scrolling) return
    if (totalpages <= _page) return
    const lastGrid = document.querySelector('.container > div:last-child')
    const lastGridOffset = lastGrid.offsetTop + lastGrid.clientHeight
    const pageOffset = window.pageYOffset + window.innerHeight
    var bottomOffset = 20
    if(pageOffset > lastGridOffset - bottomOffset) this.loadMoreFaces() && this.loadAdverts()
  }
  loadFaces=()=>{
    const {_page, _limit} = this.state
    axios.get(`/products?_page=${_page}&_limit=${_limit}`)
  .then(res=>res.data).then(data =>{
    // console.log(data);
    this.setState({
      ready: 'loaded',
      faces: data, ...data,
      scrolling: false
    })
  });}

  loadMoreFaces = () => {
    this.setState(prevState=>({
      _page: prevState._page + 1,
    }), this.loadFaces)
  }
  loadAdverts = () => {
    this.setState({
      advert: adsURL
    })
  }
 
  render(){
    
    const {ready, faces, advert} = this.state;
    console.log(this.state)
    // console.log(faces)
    return(
        <div className="App">
          <header className="App-header">        
            <Header />
            {/* <Ads /> */}
          </header>
          <img src={this.state.loadAdverts} alt="ads" />
          {faces.length ? '' : 'loading'}
          {ready=== 'loading' ? 'loading..' : ''}
          <Grid>
          {faces.map(faces=>(

            <FontContainer key={faces.id} className="container">
              <div className="font-face">
                <p className="face" style={{fontSize:faces.size}}>{faces.face}</p>
              </div>
              <div className="grid-container">
                <p>size:{faces.size}px</p>
                <p className="price">price: ${faces.price/100}</p>
              </div>
              <div className="btn">
                <input type="button" className="btn-round" value="Buy"/>
              </div>
            </FontContainer>
          ))}
          </Grid>
        </div>    
    );
  }
}


export default App;
