import React from 'react';
import {Header, toPersianNum} from '../Utils/Utils';
import FoodDetails from './FoodDetails';
import CartBasedComponent from './CartBasedComponent';
import Navbar from './Navbar';
import {Link} from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import ClipLoader from 'react-spinners/ClipLoader';
import LoadingOverlay from 'react-loading-overlay';
import Error from '../Error/Error';
import Timer from 'react-compound-timer';
import InfiniteScroll from 'react-infinite-scroller';

function Search() {
  return (
    <div className="search centered-flex">
      <form className="form-inline justify-content-center shadow-box" action="">
        <div className="form-group">
          <input type="text" className="form-control bg-light" id="foodname" placeholder="نـــام غـــذا" />
          <input type="text" className="form-control bg-light" id="restaurantname" placeholder="نـــام رســـتـــوران" />
        </div>
        <button type="submit" className="btn btn-default">جســـت‌و‌جـــو</button>
      </form>
    </div>
  );
}

function RestaurantList(props) {
  let restaurantList = [];
  let rowContent = [];
  props.restaurants.map((item, i) => {
    if ((i % 4 === 0) && i !== 0) {
      restaurantList.push(<div className="row" key={"row".concat(i)}>{rowContent}</div>);
      rowContent = [];
    }
    rowContent.push(
      <RestaurantCard item={item} key={item.id}/>
    );
    return item;
  });
  restaurantList.push(<div className="row" key="lastRow">{rowContent}</div>);
  return restaurantList;
}

function RestaurantCard(params) {
  var url = "restaurant?id=".concat(params.item.id);
  return (
    <div className="col-sm-3">
      <div className="card shadow-box">
        <div className="card-body">
          <img src={params.item.logo} alt={params.item.name}/>
          <div className="restaurant-title">
            {params.item.name}
          </div>
        </div>
        <Link to={url} className="btn yellow-btn">نمایش منو</Link>
      </div>
    </div>
  )
}


class Home extends CartBasedComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      restaurants: [],
      foodParty: [],
      partyRemainingTime: null,
      cart: {},
      pageNum: 1,
      pageSize: 8,
      hasMore: true
    };
  }
  render() {
    const { error, isLoaded, restaurants, foodParty, partyRemainingTime, toShow, cart} = this.state;
    let cartOrdersLen = 0;
    if (cart.orders !== undefined && cart.orders !== null && cart.orders.length > 0)
      cartOrdersLen = cart.orders.length;
    if (error) {
      return <Error code={500}/>;
    }
    else {
      return (
        <LoadingOverlay
        active={!isLoaded}
        spinner={<ClipLoader
          size={40}
          color={"#ff6b6b"}
          loading={!isLoaded}
        />}>
        <Navbar whereAmI="home" cartCount={cartOrdersLen} func={this.handleShow}/>
        <Header/>
        <Search/>
        <div className="menu">
          <div className="title">
            جشن غذا!
          </div>
          <div className="centered-flex">
            <div className="timer">
              {isLoaded &&
              <Timer
              initialTime={parseInt(partyRemainingTime)*1000}
              direction="backward"
              >
                زمان باقی مانده: &nbsp;<b><Timer.Minutes formatValue={value => toPersianNum(`${value}`)}/>:<Timer.Seconds formatValue={value => toPersianNum(`${value}`)}/></b>
              </Timer>
              }
              </div>
          </div>
          <div className="scrolling-wrapper shadow-box">
            {foodParty.map(item => (
              <div className="card shadow-box" key={item.restaurantId+'-'+item.name}>
                <FoodDetails whereAmI="foodparty"
                name={item.name} restaurantName={item.restaurantName} restaurantId={item.restaurantId}
                description={item.description}
                price={item.price}
                popularity={item.popularity}
                count={item.count}
                oldPrice={item.oldPrice}
                showFunc={this.handleShow}
                hideFunc={this.handleHide}
                addToCart={this.addToCart}
                image={item.image} />
              </div>
          ))}
          </div>
        </div>
        <div className="menu container" id="restaurants">
          <div className="title">
            رستوران ها
          </div>
          {isLoaded &&
          <InfiniteScroll
              pageStart={1}
              loadMore={this.loadMoreRestaurants.bind(this)}
              hasMore={this.state.hasMore}
              loader={<div className="loader" key={0}>در حال بارگذاری ...</div>}
          >
            <RestaurantList restaurants={restaurants}/>
          </InfiniteScroll>
          }
        </div>
        <Modal className="modal fade" role="dialog"
          show={toShow === "cart"}
          onHide={this.handleHide}>
          <Modal.Body>
            <div id="cart">
              <div className="card">
              {cartOrdersLen > 0
              ? this.Cart(cart)
              :
                <h1>سبد خرید شما خالی است</h1>
              }
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </LoadingOverlay>
    );
    }
  }

  loadMoreRestaurants() {
    setTimeout( () => {
      this.fetchRestaurants();
    }, 2000);
  }

  fetchFoodParty() {
    fetch("http://localhost:8080/v1/foodparty")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            foodParty: result.restaurants,
            error: (!this.state.error) ? result.msg : this.state.error,
            partyRemainingTime: result.remainingTime,
            isLoaded: true
          });
        },
        (error) => {
          this.setState({
            error: error,
            isLoaded: true,
          });
        }
      )
  }

  fetchRestaurants() {
    const pageNum = this.state.pageNum;
    const pageSize = this.state.pageSize;
    const page = String(pageNum).concat("/").concat(String(pageSize));
    fetch("http://localhost:8080/v1/restaurants/".concat(page))
      .then(res => res.json())
      .then(
        (result) => {
          if (result.length > 0) {
            this.setState({
              restaurants: this.state.restaurants.concat(result),
              error: (!this.state.error) ? result.msg : this.state.error,
              hasMore: true,
              pageNum: this.state.pageNum + 1
            });
          }
          else {
            this.setState({
              hasMore: false
            });
          }
        },
        (error) => {
          this.setState({
            error: error,
            isLoaded: true,
          });
        }
      )
  }


  componentDidMount() {
    this.fetchRestaurants();
    this.fetchFoodParty();
    this.fetchCart();

  }
}

export default Home;
