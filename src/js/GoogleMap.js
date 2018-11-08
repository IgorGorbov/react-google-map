import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GoogleMap extends Component {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    activeProperty: PropTypes.object.isRequired,
    setActiveProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      markers: [],
    };
  }

  componentDidMount() {
    const { properties, activeProperty } = this.props;
    const { latitude, longitude } = activeProperty;

    this.map = new google.maps.Map(this.refs.map, {
      center: { lat: latitude, lng: longitude },
      mapTypeControl: false,
      zoom: 16,
    });

    this.createMarkers(properties);
  }

  componentWillReceiveProps(nextProps) {
    const { activeProperty } = nextProps;
    const { index } = activeProperty;

    if (index !== this.props.activeProperty.index) {
      this.hideAllMarkers();
      this.showIW(index);
    }
  }

  showIW(index) {
    const { markers } = this.state;
    markers[index] && markers[index].iw.open(this.map, markers[index]);
  }

  hideAllMarkers() {
    const { markers } = this.state;

    markers.forEach(marker => {
      marker.iw.close();
    });
  }

  createMarkers(properties) {
    const { setActiveProperty, activeProperty } = this.props;
    const activePropertyIndex = activeProperty.index;
    const { markers } = this.state;

    properties.map(prop => {
      const { latitude, longitude, index, address } = prop;
      this.marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: this.map,
        label: {
          color: 'orangered',
          fontSize: '12px',
          text: `${index + 1}`,
        },
        icon: {
          url:
            'https://cdn0.iconfinder.com/data/icons/map-location-solid-style/91/Map_-_Location_Solid_Style_26-32.png',
          size: new google.maps.Size(64, 64),
          origin: new google.maps.Point(0, -15),
          anchor: new google.maps.Point(0, 0),
        },
      });

      const iw = new google.maps.InfoWindow({
        content: `<h1>${address}</h1>`,
      });

      this.marker.iw = iw;

      this.marker.addListener('click', () => {
        this.hideAllMarkers();
        setActiveProperty(prop, true);
      });

      markers.push(this.marker);

      this.showIW(activePropertyIndex);
    });
  }

  render() {
    return (
      <div className="mapContainer">
        <div id="map" ref="map" />
      </div>
    );
  }
}
