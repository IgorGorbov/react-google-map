import React from 'react';
import jump from 'jump.js';

import ImagLocation from '../images/location-map';
import data from './data/Data';
import { easeInOutCubic } from './utils/Easing';

import Card from './Card';
import GoogleMap from './GoogleMap';
import Header from './Header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      properties: data.properties,
      activeProperty: data.properties[0],
      filterIsVisible: false,
      filterBedrooms: 'any',
      filterBathrooms: 'any',
      filterCars: 'any',
      filteredProperties: [],
      isFiltering: false,
    };

    this.setActiveProperty = this.setActiveProperty.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.filterProperties = this.filterProperties.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  setActiveProperty(property, scroll = true) {
    const { index } = property;
    this.setState({
      activeProperty: property,
    });

    if (scroll) {
      const target = `#card-${index}`;
      jump(target, {
        duration: 800,
        easing: easeInOutCubic,
      });
    }
  }

  toggleFilter(e) {
    e.preventDefault();

    this.setState(prevState => ({
      filterIsVisible: !prevState.filterIsVisible,
    }));
  }

  handleFilterChange(e) {
    const target = e.target;
    const { value, name } = target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.filterProperties();
      }
    );
  }

  filterProperties() {
    const {
      properties,
      filterBedrooms,
      filterBathrooms,
      filterCars,
    } = this.state;
    const isFiltering =
      filterBedrooms !== 'any' ||
      filterBathrooms !== 'any' ||
      filterCars !== 'any';

    const getFilteredProperties = properties => {
      const filteredProperties = [];
      properties.map(property => {
        const { bedrooms, bathrooms, carSpaces } = property;
        const match =
          (bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any') &&
          (bathrooms === parseInt(filterBathrooms) ||
            filterBathrooms === 'any') &&
          (carSpaces === parseInt(filterCars) || filterCars === 'any');

        match && filteredProperties.push(property);
      });

      return filteredProperties;
    };

    this.setState({
      filteredProperties: getFilteredProperties(properties),
      activeProperty: getFilteredProperties(properties)[0] || properties[0],
      isFiltering,
    });
  }

  clearFilter(e, form) {
    e.preventDefault();

    this.setState({
      activeProperty: this.state.properties[0],
      filterBedrooms: 'any',
      filterBathrooms: 'any',
      filterCars: 'any',
      filteredProperties: [],
      isFiltering: false,
    });

    form.reset();
  }

  render() {
    const {
      properties,
      activeProperty,
      filterIsVisible,
      filteredProperties,
      isFiltering,
    } = this.state;

    const propertiesList = isFiltering ? filteredProperties : properties;

    return (
      <div>
        <div className="listings">
          <Header
            filterIsVisible={filterIsVisible}
            toggleFilter={this.toggleFilter}
            clearFilter={this.clearFilter}
            handleFilterChange={this.handleFilterChange}
          />
          <div className="cards container">
            <div
              className={`cards-list row 
              ${propertiesList.length ? '' : 'is-empty'}`}
            >
              {propertiesList.map(prop => {
                return (
                  <Card
                    key={prop._id}
                    property={prop}
                    activeProperty={activeProperty}
                    setActiveProperty={this.setActiveProperty}
                  />
                );
              })}
              {isFiltering && propertiesList.length === 0 && (
                <p className="warning">
                  <img src={ImagLocation} /> No properties were found
                </p>
              )}
            </div>
          </div>
        </div>

        <GoogleMap
          properties={properties}
          activeProperty={activeProperty}
          filteredProperties={filteredProperties}
          isFiltering={isFiltering}
          setActiveProperty={this.setActiveProperty}
        />
      </div>
    );
  }
}

export default App;
