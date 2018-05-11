import React from 'react';
import { Map, Polygon, PolyEditor } from 'react-amap';
export default class GMap extends React.Component{

  constructor(){
    super();
    this.state = {
      polygonActive: false,
    };
    this.editorEvents = {
      created: (ins) => {},
      addnode: (e) => {},
      adjust: (e) => {},
      removenode: (e) => {},
      end: (e) => {},
    };
  }
  mapCenter () {
    let mapCenter = {};
    const { RangeList } = this.props;
    if (RangeList) {
      mapCenter = {longitude: RangeList[0].longitude, latitude: RangeList[0].latitude }
    }
    return mapCenter;
  }
  polygonPath () {
    const polygonPath = [];
    const { RangeList } = this.props;
    if (RangeList) {
      for (var i = 0; i< RangeList.length; i++) {
        polygonPath.push({
          longitude: RangeList[i].longitude,
          latitude: RangeList[i].latitude,
        })
      }
    }
    return polygonPath;
  }
  togglePolygon(){
    this.setState({
      polygonActive: !this.state.polygonActive
    });
  }
  render(){
    return (
    <div>
      <div style={{width: '100%', height: '370px'}}>
        <Map zoom={12} center={this.mapCenter()}>
          <Polygon path={this.polygonPath()}>
            <PolyEditor active={this.state.polygonActive} events={this.editorEvents} />
          </Polygon>
        </Map>
      </div>
      {/*<button onClick={() => { this.togglePolygon() }} >Toggle Polygon Editable</button>*/}
    </div>
    )
  }
}
