import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import { useHttpClient } from "../../shared/components/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/components/util/validators";
import { useForm } from "../../shared/components/hooks/form-hook";
import { AuthContext } from "../../shared/components/context/auth-context";

import './PlaceForm.css';


const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedPlaces] = useState();
    const placeId = useParams().placeId;
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid:false
        }
    }, false);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
            );
            setLoadedPlaces(responseData.place);
            setFormData(
      {
        title: {
          value: responseData.place.title,
          isValid: true
        },
        description: {
          value: responseData.place.description,
          isValid: true
        }
      },
      true
    );
    } catch (err) {}
        };
        fetchPlaces();
    }, [sendRequest, placeId, setFormData]);


    const placeUpdateSubmitHandler = async event => {
       event.preventDefault();
       try {
       await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
         title: formState.inputs.title.value,
         description: formState.inputs.description.value
       }), 
       {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
       }
    );
    navigate('/' + auth.userId+ '/places');
}catch (err) {}
};

   if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }
    


    if (!loadedPlaces && !error) {
        return (
            <div className="center">
                <Card>
                <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
        {!isLoading && loadedPlaces &&
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input 
        
        id="title" 
        element="input" 
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlaces.title}
        initialValid={true}
        />
        <Input 
        
        id="description" 
        element="textarea" 
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="please enter a valid description (at least 5 characters)."
       onInput={inputHandler}
        initialValue={loadedPlaces.description}
        initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
}
  </React.Fragment>
    );
};

export default UpdatePlace;