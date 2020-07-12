import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withCookies } from 'react-cookie';
import history from 'lib/history'
// NOTE : [Redux Moduls]
import * as imageStore from 'store/modules/imageStore';

class ImageComponent extends Component {
    state = {
        imageSeq: null,
        buttonState : null, // 1 왼쪽 2 오른쪽
        width: 0,
        height: 0,
        first: [0, 0],
        two: [0, 0],

        toggleClassNameAlart : 0, // class 이름 입력 창

        clickLabel: null, // 클릭한 라벨
    }
    componentWillMount() {
        const imageSeq = history.location.pathname.split('/')[1];
        this.props.imageActions.loadImageData(imageSeq);
        this.setState({ ...this.state, imageSeq: imageSeq })
    }

    // 마우스 클릭 눌렀을 때
    onMouseDown = (e) => {
        // e.stopPropagation()
        // e.preventDefault()
        if (e.buttons == 1) { // 왼쪽 버튼
            // console.log('onMouseDown 왼쪽', e.buttons, e.nativeEvent.offsetX, e.nativeEvent.offsetY, e)
        } else if (e.buttons == 2) { // 오른쪽 버튼
            // console.log('onMouseDown 오른쪽', e.buttons, e.nativeEvent.offsetX, e.nativeEvent.offsetY, e)
        }
        this.setState({ ...this.state,
            buttonState: e.buttons,
            first: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
            // two: [0, 0], width: 0, height: 0,
            toggleClassNameAlart: 0,
        });
    }

    // 마우스 클릭 땠을 때
    onMouseUp = async (e) => {
        if (this.state.buttonState == 1) { // 왼쪽 버튼 클릭한 경우에만 실행
            // 그냥 클릭 일 경우 pass
            if (this.state.first[0] == e.nativeEvent.offsetX && this.state.first[1] == e.nativeEvent.offsetY) return;

            
            await this.props.imageActions.setImageLabel({
                id: this.state.imageSeq,
                firstClick: this.state.first,
                secondClick: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
            })

            await this.setState({
                ...this.state,
                buttonState: e.buttons,
                first: null,
                toggleClassNameAlart: 1,
                clickLabel: this.props.imageList[this.state.imageSeq].labels.length -1
            });

            // console.log('onMouseUp왼쪽', e.buttons, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
    }

    createdSquare = ({id, index, width, height, x, y}) => {
        return (
            <svg className="labels_svg" key={`svg_${id}_${index}`} id={index}
                onClick={(e) => { e.stopPropagation(); e.preventDefault();}}>
                <rect
                    width={width}
                    height={height}
                    x={x}
                    y={y}
                    fill="#5668D9" fillOpacity='0.2' stroke="#5668D9" strokeWidth="1" 
                    key={`rect_${id}_${index}`}
                    onClick={(e) => {
                        e.stopPropagation(); e.preventDefault();
                        this.setState({
                            ...this.state,
                            clickLabel: index
                        })
                    }}
                />
            </svg>
        )
    }

    render() {
        if (this.state.imageSeq == null) return null;
        if (this.props.imageList[this.state.imageSeq] == null) return null;
        const image = this.props.imageList[this.state.imageSeq];
        return <div className="label">
            <div className="header">
                Dataset Label
            </div>
            <div className="toolbar">
                <div className="pointer select" />
                <div className="pointer group" />
            </div>
            <div className="labels">
                    {
                        image.labels.map(label => {
                            return (
                                <div key={`${label.index}_div`}
                                    onClick={(e)=> this.setState({...this.state, clickLabel: label.index})}
                                    style={{ border: '1px solid #EBEDF2'}}
                                >
                                    <div className="label_label">{label.label}</div>
                                    <div className="loaction">
                                        ({label.location[0]}, {label.location[1]}), 
                                        ({label.location[2]}, {label.location[1]}), 
                                        ({label.location[0]}, {label.location[3]}),
                                        ({label.location[2]}, {label.location[3]})
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>
            <div className="body" style={{ backgroundImage: `url(${image.thumbnailUrl})`, backgroundRepeat: 'no-repeat' }}
                onMouseUp={e => this.onMouseUp(e)}
                onMouseDown={e => this.onMouseDown(e)}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            >
                { // 이름
                    this.state.clickLabel != null &&
                    <input className="classNamealart"
                        onChange={(e)=> {
                            this.props.imageActions.setImageLabelName(this.state.imageSeq, this.state.clickLabel, e.currentTarget.value)
                        }}
                    placeholder="Input Class name"
                    value={this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].label}
                    style={{
                        marginLeft: this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].location[2] + 5,
                        marginTop: this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].location[1] + 5,
                        display: this.state.toggleClassNameAlart ? 'block' : 'none'
                    }}
                    // body의 이벤트 방지
                    onMouseUp={(e) => {e.stopPropagation()}}
                    onMouseDown={(e) => {e.stopPropagation()}}
                    />
                }
                { // 크기
                    this.state.clickLabel != null &&
                    <div className="classSizeBox"
                        style={{
                            marginLeft: this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].location[2] + 5,
                            marginTop: this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].location[3] + 5,
                            display: this.state.toggleClassNameAlart ? 'block' : 'none'
                        }}
                    >
                        <div style={{ font: 'Bold 10px/14px Noto Sans Display', color: '#141746'}}>{this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].label}</div>
                        <div >
                            <div style={{ font: '10px/14px Noto Sans Display', color: '#141746' }}>
                                W : {this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].width} mm
                            </div>
                            <div style={{ font: '10px/14px Noto Sans Display', color: '#141746' }}>
                                H : {this.props.imageList[this.state.imageSeq].labels[this.state.clickLabel].height} mm
                            </div>
                        </div>
                    </div>
                }
                {
                    image.labels.map(label => {
                        return this.createdSquare(label)
                    })
                }
            </div>
        </div>
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

export default compose(withCookies, connect(mapStateToProps, mapDispatchToProps))(ImageComponent);