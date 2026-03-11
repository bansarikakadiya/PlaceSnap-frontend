import React, { useContext, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Map from "../../shared/components/UIElements/Map";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/components/hooks/http-hook";
import { AuthContext } from "../../shared/components/context/auth-context";

import { FaWhatsapp, FaFacebook, FaTelegram } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openShareHandler = () => setShowShare(true);
  const closeShareHandler = () => setShowShare(false);

  const lat = props.location.lat;
  const lng = props.location.lng;
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(mapLink)}`);
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        mapLink
      )}`
    );
  };

  const shareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(mapLink)}`
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(mapLink);
    alert("Link Copied!");
  };

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {/* MAP MODAL */}

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__model-content"
        footerClass="place-item__model-action"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.location} zoom={16} />
        </div>
      </Modal>

      {/* SHARE MODAL */}

      <Modal
        show={showShare}
        onCancel={closeShareHandler}
        header="Share Place"
        footer={<Button onClick={closeShareHandler}>Close</Button>}
      >
        <div className="share-menu">
          <button className="whatsapp" onClick={shareWhatsApp}>
            <FaWhatsapp /> WhatsApp
          </button>

          <button className="facebook" onClick={shareFacebook}>
            <FaFacebook /> Facebook
          </button>

          <button className="telegram" onClick={shareTelegram}>
            <FaTelegram /> Telegram
          </button>

          <button className="copy" onClick={copyLink}>
            <FiLink /> Copy Link
          </button>
        </div>
      </Modal>

      {/* DELETE MODAL */}

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you Sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {/* PLACE CARD */}

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}

          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>

          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>

          <div className="place-item__action">
            <Button inverse onClick={openMapHandler}>
              View On Map
            </Button>

            <Button onClick={openShareHandler}>Share</Button>

            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;