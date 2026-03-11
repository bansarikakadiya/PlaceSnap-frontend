import React from "react";
import Card from "../../shared/components/UIElements/Card";
import './PlaceList.css';
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";

const PlaceList = props => {
    if (!props.items || props.items.length === 0) {
        return  (
        <div className="place-list center">
            <Card>
                <h2>No Place Found. Maybe Create one?</h2>
                <Button to="/places/new">Share Place</Button>
                </Card>    
            </div>
        );
}

return (
<ul className="place-list">
    {props.items.map(place => (
        <PlaceItem 
        key={place.id} 
        id={place.id} 
        image={place.image} 
        title={place.title} 
        description={place.description} 
        address={place.address} 
        creatorID={place.creator}
        location={place.location}
        coordinates={place.location}
        onDelete={props.onDeletePlace}
        creatorId={place.creator}
/>))}
</ul>
);

};
export default PlaceList;