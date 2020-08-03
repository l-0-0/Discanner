import React, { Fragment } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
// import { HashRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visibleUploader: false };
        this.toggleModal = this.toggleModal.bind(this);
        this.showTheImage = this.showTheImage.bind(this);
        this.updateTheBio = this.updateTheBio.bind(this);
    }

    componentDidMount() {
        // console.log("has mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data: ", { data });

                if (data) {
                    this.setState(
                        {
                            first: data.first,
                            last: data.last,
                            profileImg: data.profile_pic,
                            userId: data.id,
                            bio: data.bio,
                        },
                        () => {
                            console.log("this state in app:", this.state);
                        }
                    );
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    showTheImage(image) {
        this.setState({
            profileImg: image,
            visibleUploader: !this.state.visibleUploader,
        });
        // console.log("image is: ", image);
    }

    updateTheBio(nBio) {
        this.setState({
            bio: nBio,
        });
    }

    toggleModal() {
        // console.log("toggle modal is running");
        this.setState({
            visibleUploader: !this.state.visibleUploader,
        });
    }

    render() {
        // if (!this.state.id) {
        //     return null;
        // }
        return (
            <Fragment>
                <header>
                    <Logo />
                    <ProfilePic
                        //give props to the child

                        first={this.state.first}
                        last={this.state.last}
                        profileImg={this.state.profileImg}
                        userId={this.state.userId}
                        toggleModal={() => {
                            this.toggleModal();
                        }}
                    />

                    {this.state.visibleUploader && (
                        <Uploader showTheImage={this.showTheImage} />
                    )}
                </header>
                <div>
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        id={this.state.id}
                        profileImg={this.state.profileImg}
                        bio={this.state.bio}
                        setBio={this.setBio}
                        updateTheBio={this.updateTheBio}
                    />
                </div>
            </Fragment>
        );
    }
}
