import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/components/util/validators";
import Input from "../../shared/components/FormElements/Input";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useForm } from "../../shared/components/hooks/form-hook";
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/components/context/auth-context";

import './NewPlace.css';
import './PlaceForm.css';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const[formState, inputHandler] = useForm(
    {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
         false
    );

    const navigate = useNavigate();

    const placeSubmitHandler = async event => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
        await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', 
            'POST',
            formData, {
                Authorization: 'Bearer ' + auth.token
            }
    );
    navigate('/');
    } catch (err) {}
    };

    return (
     <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input 
      id="title"
      element="input" 
      type="text" 
      label="Title" 
      validators={[VALIDATOR_REQUIRE()]}
      errorText="please enter a valid title."
      onInput={inputHandler}
      />
      <Input 
      id="description"
      element="textarea"  
      label="Description" 
      validators={[VALIDATOR_MINLENGTH(5)]}
      errorText="please enter a valid description (at least 5 characters)."
      onInput={inputHandler}
      />
       <Input 
      id="address"
      element="input"  
      label="Address"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="please enter a valid address."
      onInput={inputHandler}
      />
      <ImageUpload 
      id="image"
      onInput={inputHandler}
      errorText="Please provide an image." />
      <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
    </React.Fragment>
    );
};

export default NewPlace;