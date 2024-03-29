/* eslint linebreak-style: ["error", "unix"] */
// import { boundMethod } from "autobind-decorator";
import PropTypes from "prop-types";
import React from "react";
// import { withRouter } from "react-router";
// import { NavLink } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

// // HOCs
// import withPubSub from "../hocs/with-pub-sub";

// Components
// import Hamburger from "./Hamburger";
// import Icon from "./Icon";
// import TopBarDropDownDocs from './TopBarDropDownDocs';
// import TopBarDropDownLogin from './TopBarDropDownLogin';
// import TopBarDropDownUser from './TopBarDropDownUser';

// Services
// import auth from "../services/auth";

// Styles
import "./TopBar.scss";

const hasDemos = false
const homeUrl = hasDemos ? "/" : "/app";


export default class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggingIn: false,
      loginPassword: "",
      loginUserId: "",
      menuIsShown: false,
      // userEmail: auth.get("email"),
      // userId: auth.get("username"),
      fullscreenButtonHovered: false,
      wasAtHome: true
    };

    this.loginPasswordHandler = this.loginPasswordHandler.bind(this);
    this.loginUserIdHandler = this.loginUserIdHandler.bind(this);
    this.login = this.login.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen(() =>
      this.setState({ menuIsShown: false })
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState({
        isLoggingIn: false,
        // userEmail: auth.get("email"),
        // userId: auth.get("username")
      });
    }

    if (this.state.wasAtHome < 2 && true) {
      this.setState({
        wasAtHome: this.state.wasAtHome + 1
      });
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  /* ------------------------------ Custom Methods -------------------------- */

  login(event) {
    event.preventDefault();

    this.setState({
      isLoggingIn: true,
      isLoginUnsuccessful: false
    });

    // auth
    //   .login(this.props.pubSub.publish)(
    //     this.state.loginUserId,
    //     this.state.loginPassword
    //   )
    //   .then(success => {
    //     this.setState({
    //       isLoggingIn: false,
    //       isLoginUnsuccessful: !success,
    //       isServerUnavailable: false
    //     });
    //   })
      // .catch(error => {
      //   if (error.message === "Bad Request") {
      //     this.setState({
      //       isLoggingIn: false,
      //       isLoginUnsuccessful: true,
      //       isServerUnavailable: false
      //     });
      //   } else {
      //     this.setState({
      //       isLoggingIn: false,
      //       isServerUnavailable: true
      //     });
      //   }
      // });
  }

  loginUserIdHandler(event) {
    this.setState({ loginUserId: event.target.value });
  }

  // @boundMethod
  mouseEnterHandler = () => {
    this.setState({ fullscreenButtonHovered: true });
  }

  loginPasswordHandler(event) {
    this.setState({ loginPassword: event.target.value });
  }

  toggleMenu(isOpen) {
    this.setState({
      menuIsShown: isOpen
    });
  }

  render() {
    const isShaking =
      this.state.wasAtHome === 1 &&
      true &&
      !this.state.fullscreenButtonHovered;

    return (
      <header className="top-bar">
        <div
          className={`flex-c flex-jc-sb top-bar-wrapper ${
            true ? "wrap-basic" : "wrap"
          }`}
        >
          <div className="flex-c branding-launch">
            <Nav.Link to={homeUrl} className="flex-c flex-a-c branding">
              <span className="higlass">
                <span className="higlass-hi">WE browser</span>
              </span>
            </Nav.Link>

            {hasDemos && isShaking && (
              <div className="fullscreen-launch-hint text-only is-sliding-right">
                <div>Launch in full screen!</div>
              </div>
            )}
          </div>
          <nav
            className={`flex-c flex-jc-e flex-a-s is-toggable ${
              this.state.menuIsShown ? "is-shown" : ""
            }`}
          >
            <ul className="flex-c flex-jc-e flex-a-s no-list-style primary-nav-list">
              <li>
                <Nav.Link to="/about" activeClassName="is-active">
                  About
                </Nav.Link>
              </li>
               <li>
                <Nav.Link to="/request" activeClassName="is-active">
                  Request
                </Nav.Link>
              </li>
               <li>
                <Nav.Link to="/data" activeClassName="is-active">
                  Data
                </Nav.Link>
              </li>
              {/* <li>
                <a href="https://blog.higlass.io">Blog</a>
              </li>
              <li>
                <NavLink to="/examples" activeClassName="is-active">
                  Examples
                </NavLink>
              </li>
              <li>
                <NavLink to="/plugins" activeClassName="is-active">
                  Plugins
                </NavLink>
              </li> */}

              {
                // <li className='separated-left flex-c flex-jc-c'>
                //   {this.props.isAuthenticated
                //     ? (
                //       <TopBarDropDownUser
                //         closeOnOuterClick={true}
                //         logout={auth.logout(this.props.pubSub.publish)}
                //         userEmail={this.state.userEmail}
                //         userId={this.state.userId} />
                //     ) : (
                //       <TopBarDropDownLogin
                //         closeOnOuterClick={true}
                //         isLoggingIn={this.state.isLoggingIn}
                //         isLoginUnsuccessful={this.state.isLoginUnsuccessful}
                //         isServerUnavailable={this.state.isServerUnavailable}
                //         login={this.login}
                //         loginPassword={this.state.loginPassword}
                //         loginPasswordHandler={this.loginPasswordHandler}
                //         loginUserId={this.state.loginUserId}
                //         loginUserIdHandler={this.loginUserIdHandler} />
                //     )
                //   }
                // </li>
              }
              <li className="separated-left flex-c">
                <a
                  href="https://github.com/yzhang250/hicpro_data_visual"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="full-wh flex-c flex-a-c">
                    github
                    {/* <Icon iconId="github" /> */}
                  </div>
                </a>
              </li>
            </ul>
            {/* <Hamburger
              isActive={this.state.menuIsShown}
              onClick={this.toggleMenu} */}
          </nav>
        </div>
      </header>
    );
  }
}

TopBar.propTypes = {
  history: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  pubSub: PropTypes.object.isRequired
};

