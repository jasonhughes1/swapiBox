import React, { Component } from 'react';
import './App.css';
import Controls from './../Controls/Controls.js';
import Scroll from './../Scroll/Scroll.js';
import Header from './../Header/Header.js';
import CardContainer from './../CardContainer/CardContainer';
import { getFilms, getPeople, getPlanets, getVehicles, fetchHomeworld, fetchSpecies, cleanData, fetchResidents } from '../../utility.js';


class App extends Component {
  constructor() {
    super()
    this.state = {
      data: null,
      films: null,
      people: null,
      opening: Math.floor(Math.random() * (6 - 0 + 1)),
      currentIndex: 1,
      favClicked: false,
      favorites: [],
      openingCrawl: '',
    }
  }
// make an api utility
  // test the utility
  // make your app component readable
  // use async await
    // look into putting the logic into functions so that it's easier to follow your control flow
// probs move the opening random number generator into a function
// maybe create a function that just populates your crawl.
  // getFilms = () => {
  //   return fetch('https://swapi.co/api/films/').then(data => data.json());
  // }

    componentDidMount() {
      const films = getFilms()
      const people = getPeople()
      const planets = getPlanets()
      const vehicles = getVehicles()


      return Promise.all([films, people, planets, vehicles])
      .then(data => {
        const peopleData = fetchHomeworld(data[1].results)
        .then(data => fetchSpecies(data));
        const planetsData = fetchResidents(data[2].results);
        return Promise.all([films, peopleData, planetsData, vehicles])
        .then(data => {

          this.setState({data: cleanData(data)})
        })
      });
    }

  // generateCrawl() {
  //   let random = Math.floor(Math.random() * (6 - 0 + 1))
  //
  // }
  //   // generate a random number
  //   // grab films array map through it to get an array of crawls
  //   // then pick one
  //   // this.setState({openingCrawl : })
  // }

  findIndexInFavArray(element) {
  return this === element.Name;
}

setFavorite = (cardData) => {
  const { favorites } = this.state;

  const indexOfFavorite = favorites
    .findIndex(this.findIndexInFavArray, cardData.Name);

  let oldFavorites;

  if (indexOfFavorite < 0) {
    oldFavorites = [...favorites, cardData];
  } else {
    oldFavorites = favorites.slice();
    oldFavorites.splice(indexOfFavorite, 1);
  }

  this.setState({
    favorites: oldFavorites
  });
}

favClicked = () => {
  this.setState({ favClicked: true});
}


  changeCards = (num) => {
    this.setState({currentIndex: num})
  }

  cardSet() {
    const { data, currentIndex } = this.state;
    return data[currentIndex];
  }

  render() {
    if (this.state.data) {
      return (
        <div className='App'>
          <Header favFn={this.favClicked}
                  numFav={this.state.favorites.length}
                />

          <div className='button-container'>

          <Controls
            buttonText='People'
            className={'button  main-btn active'}
            changeCards={this.changeCards}
            num={1}

          />
          <Controls
            buttonText='Planets'
            className={'button  main-btn active'}
            changeCards={this.changeCards}
            num={2}
          />
          <Controls
            buttonText='Vehicles'
            className={'button  main-btn active'}
            changeCards={this.changeCards}
            num={3}
          />
        </div>
          <Scroll data={this.state.data[0]}
            opening={this.state.opening}
          />
          <CardContainer
            cardType = {this.cardSet()}
            setFavorite={this.setFavorite}
          />
        </div>
      );
    } else {
      return (
        <div>WAIT SON</div>
      )
    }
  }
}
export default App;
