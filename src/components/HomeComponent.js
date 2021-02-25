import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withCookies } from 'react-cookie';
import history from 'lib/history'
// NOTE : [Redux Moduls]
import * as imageStore from 'store/modules/imageStore';

class HomeComponent extends Component {
    componentDidMount() {
        for (let i = 1; i <= 100; i++) {
            this.props.imageActions.loadImageData(i)
        }
    }
    render() {
        return (
            <div className="home">
                {console.log(Object.entries(this.props.imageList))}
                <div className="header">
                    Annotator Home
                </div>
                <div className="body">
                    {Object.entries(this.props.imageList).map(imageInfo => {
                        return (
                            <div className="imageDiv">
                                <img className="image" src={imageInfo[1].thumbnailUrl} alt={imageInfo[1].title} 
                                    onClick={() => history.push('/' + imageInfo[0])}
                                />
                                sdfasdf
                                {imageInfo[1].title}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        imageList: state.imageStore.imageList,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        imageActions: bindActionCreators(imageStore, dispatch),
    }
}

export default compose(withCookies, connect(mapStateToProps, mapDispatchToProps))(HomeComponent);