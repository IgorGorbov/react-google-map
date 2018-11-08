import React from 'react';
import jump from 'jump.js';

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
			filteredProperties: [],
			isFiltering: false
		};

		this.setActiveProperty = this.setActiveProperty.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
		this.filterProperties = this.filterProperties.bind(this);
	}

	setActiveProperty(property, scroll = true) {
		const { index } = property;
		this.setState({
			activeProperty: property
		});

		if (scroll) {
			const target = `#card-${index}`;
			jump(target, {
				duration: 800,
				easing: easeInOutCubic
			});
		}
	}

	toggleFilter(e) {
		e.preventDefault();

		this.setState((prevState) => ({
			filterIsVisible: !prevState.filterIsVisible
		}));
	}

	handleFilterChange(e) {
		const target = e.target;
		const { value, name } = target;
		this.setState(
			{
				[name]: value
			},
			() => {
				this.filterProperties();
			}
		);
	}

	filterProperties() {
		const { properties, filterBedrooms } = this.state;
		const isFiltering = filterBedrooms !== 'any';

		const getFilteredProperties = (properties) => {
      const filteredProperties = [];
			properties.map((property) => {
				const { bedrooms } = property;
				const match = bedrooms === parseInt(filterBedrooms) || filterBedrooms === 'any';

				match && filteredProperties.push(property);
			});

			return filteredProperties;
		};

		this.setState({
			filteredProperties: getFilteredProperties(properties),
			isFiltering
		});
	}

	render() {
		const { properties, activeProperty, filterIsVisible } = this.state;
		return (
			<div>
				<div className="listings">
					<Header
						filterIsVisible={filterIsVisible}
						toggleFilter={this.toggleFilter}
						handleFilterChange={this.handleFilterChange}
					/>
					<div className="cards container">
						<div className="cards-list row ">
							{properties.map((prop) => {
								return (
									<Card
										key={prop._id}
										property={prop}
										activeProperty={activeProperty}
										setActiveProperty={this.setActiveProperty}
									/>
								);
							})}
						</div>
					</div>
				</div>

				<GoogleMap
					properties={properties}
					activeProperty={activeProperty}
					setActiveProperty={this.setActiveProperty}
				/>
			</div>
		);
	}
}

export default App;
