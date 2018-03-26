import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const scoreToUrl = (score) => {
  const urlTable = {
    '1': 'https://i.imgur.com/joRV605.png',
    '1.5': 'https://i.imgur.com/fqHSmyz.png',
    '2': 'https://i.imgur.com/GsBh9O5.png',
    '2.5': 'https://i.imgur.com/HHk4ca7.png',
    '3': 'https://i.imgur.com/eXa2t1X.png',
    '3.5': 'https://i.imgur.com/nDcH9au.png',
    '4': 'https://i.imgur.com/v2Ep8kQ.png',
    '4.5': 'https://i.imgur.com/e2b0NN4.png',
    '5': 'https://i.imgur.com/327Fh6y.png',
  }
  score = Math.ceil(score / 5) * 5;
  score /= 10;
  for (let k in urlTable) {
    if (score.toString() === k) {
      return urlTable[k];
    }
  }
  return urlTable['1'];
}

const Restaurant = (props) => (
  <div className="rightsb_media-block">
    <div className="rightsb_media-avatar">
      <div className="rightsb_image_box">
        <img
          className="rightsb_image_biz"
          src={props.photo}
        />
      </div>
    </div>
    <div className="rightsb_media-story">
      <div className="rightsb_media-title">
        {props.name || 'Loading...'}
      </div>
      <div className="rightsb_bizrating">
        <div className="rightsb_star-rating">
          <img
            className="rightsb_stars"
            src={scoreToUrl(props.avgscore)}
          />
        </div>
        <span className="rightsb_review-count">
          {props.review_count || 0} reviews
        </span>
      </div>
      <q className="rightsb_tips">{props.tip || 'Loading...'}</q>
    </div>
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      business: [{cuisine1: 'loading...'}],
      alsoViewed1: {},
      alsoViewed2: {},
      alsoViewed3: {},
      tip1: null,
      tip2: null,
      tip3: null,
      photo1: '/loading.gif',
      photo2: '/loading.gif',
      photo3: '/loading.gif',
    };
  }

  componentDidMount() {
    var url = window.location.href.split("/").pop();
    url =
      url.charAt(url.length - 1) === "/" ? url.substr(0, url.length - 1) : url;
    url = url.split("?");
    axios
      .get("/sidebar/business/" + url[0])
      .then(response => {
        this.setState({ business: response.data });
      })
      .then(() => {
        // var postalCode = this.state.business[0].postal_code;
        var bizId = this.state.business.restaurant_id;
        // this.setState({ postalCode: postalCode });
        // this.fetchBusinessIds(postalCode);
        this.fetchAlsoVieweds(this.state.business.alsoviewed1, this.state.business.alsoviewed2, this.state.business.alsoviewed3);
        // this.fetchPhotos(this.state.business.alsoViewed1._id, this.state.business[0].alsoViewed2._id. this.state.business[0].alsoViewed3._id);
      })
      .catch(err => {
        console.log(err, "this is the error in the componentDidMount");
      });
  }

  fetchAlsoVieweds(id1, id2, id3) {
    // Names, Score, Review Count
    axios
      .get(`/sidebar/business/${id1}`)
      .then((response) => {
        this.setState({alsoViewed1: response.data});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/business/${id2}`)
      .then((response) => {
        this.setState({alsoViewed2: response.data});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/business/${id3}`)
      .then((response) => {
        this.setState({alsoViewed3: response.data});
      })
      .catch((err) => {throw err});

    // Photos
    axios
      .get(`/sidebar/photos/${id1}`)
      .then((response) => {
        // this.setState({photo1: response.data.thumbnailurl});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/photos/${id2}`)
      .then((response) => {
        // this.setState({photo2: response.data.thumbnailurl});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/photos/${id3}`)
      .then((response) => {
        // this.setState({photo3: response.data.thumbnailurl});
      })
      .catch((err) => {throw err});

      // Tips
    axios
      .get(`/sidebar/businessTips/${id1}`)
      .then((response) => {
        this.setState({tip1: response.data.text});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/businessTips/${id2}`)
      .then((response) => {
        this.setState({tip2: response.data.text});
      })
      .catch((err) => {throw err});
    axios
      .get(`/sidebar/businessTips/${id3}`)
      .then((response) => {
        this.setState({tip3: response.data.text});
      })
      .catch((err) => {throw err});
  }

  render() {
    return (
      <div className="rightsb_page">
        <div className="rightsb_relatedBusinesses">
          <h2 className="rightsb_subheader">People Also Viewed</h2>
          <ul className="rightsb_list">
            <li>
              <Restaurant
                photo={this.state.photo1}
                name={this.state.alsoViewed1.name}
                avgscore={this.state.alsoViewed1.avgscore}
                review_count={this.state.alsoViewed1.reviewcount}
                tip={this.state.tip1}
              />
              <Restaurant
                photo={this.state.photo2}
                name={this.state.alsoViewed2.name}
                avgscore={this.state.alsoViewed2.avgscore}
                review_count={this.state.alsoViewed2.reviewcount}
                tip={this.state.tip2}
              />
              <Restaurant
                photo={this.state.photo3}
                name={this.state.alsoViewed3.name}
                avgscore={this.state.alsoViewed3.avgscore}
                review_count={this.state.alsoViewed3.reviewcount}
                tip={this.state.tip3}
              />
            </li>
          </ul>
          <div className="rightsb_other-places-nearby">
            <h3 className="rightsb_subheader">Other Places Nearby</h3>
            <ul className="rightsb_list">
              <li className="rightsb_other-list-item">
                <a className="rightsb_other-list-item-arrange">
                  Find more {this.state.business.cuisine1} near {this.state.business.name}
                </a>
              </li>
              <li className="rightsb_other-list-item">
                <a className="rightsb_other-list-item-arrange">
                  Find more {this.state.business.cuisine2} near {this.state.business.name}
                </a>
              </li>
              <li className="rightsb_other-list-item">
                <a className="rightsb_other-list-item-arrange">
                  Find more {this.state.business.cuisine3} near {this.state.business.name}
                </a>
              </li>
            </ul>
          </div>
          <div className="rightsb_browse-nearby">
            <h3 className="rightsb_subheader">Browse Nearby</h3>
            <ul className="rightsb_list">
              <li>
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/YVTtcKY.png/120.jpg"}
                    />
                    {"  "}
                  </span>
                  <span className="rightsb_browse-list">Restaurants</span>
                </a>
              </li>
              <li>
                {" "}
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/f3RdwOP.png/120.jpg"}
                    />
                    {"  "}
                  </span>
                  <span className="rightsb_browse-list">Nightlife</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/2sYyjqj.jpg/120.jpg"}
                    />
                    {"  "}
                  </span>
                  <span className="rightsb_browse-list">Shopping</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/aAnrFk2.png/120.jpg"}
                    />
                    {"  "}
                  </span>
                  <span className="rightsb_browse-list">Show All</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="rightsb_subheader">
              Dining in {this.state.business.city}
            </h3>
            <ul className="rightsb_list">
              <li>
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/rAokCAc.jpg/120.jpg"}
                    />
                    {"  "}
                  </span>
                  <span className="rightsb_dining-list">
                    Search for Reservations
                  </span>
                </a>
              </li>
              <li>
                <a>
                  <span className="rightsb_static-icon">
                    <img
                      className="rightsb_icon"
                      src={"https://i.imgur.com/gc2EsDX.png/120.jpg"}
                    />
                    {"  "}
                  </span>
                </a>
                <span className="rightsb_dining-list">
                  Book a table in {this.state.business.city}
                </span>
              </li>
            </ul>
          </div>
          <h2 className="rightsb_subheader">
            Best of {this.state.business.city}
          </h2>
          <p className="rightsb_bestof-list">
            Things to do in {this.state.business.city}
          </p>
          <h2 className="rightsb_subheader">
            People found {this.state.business.name} by searching for...
          </h2>
          <p className="rightsb_peoplefound-list">
            Food {this.state.business.city}
          </p>
          <h2 className="rightsb_subheader">Near Me</h2>
          <p className="rightsb_nearme-list">Dinner</p>
          <p className="rightsb_nearme-list">Lunch</p>
          <p className="rightsb_nearme-list">Breakfast</p>
        </div>
      </div>
    );
  }
}

export default App;
