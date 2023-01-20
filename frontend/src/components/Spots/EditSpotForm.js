import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { editSpotThunk, addSpotImageThunk, getOneSpotThunk } from "../../store/spots";
import { useParams } from "react-router-dom";
import './Spots.css'

const EditSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams()
    const spot = useSelector((state) => state.spots.singleSpot)
    const sessionUser = useSelector((state) => state.session.user)

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateUrl = (e) => setUrl(e.target.value);

    useEffect(() => {
        dispatch(getOneSpotThunk(+spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        if (sessionUser) {
            if (sessionUser.id === spot.ownerId) setErrors([])
            else setErrors(["Only the owner of this spot can edit"])
        }
        else setErrors(["You must be logged in to update a spot"])
    }, [sessionUser, spot])

    useEffect(() => {
        if (spot) {
            setAddress(spot.address)
            setCity(spot.city)
            setState(spot.state)
            setCountry(spot.country)
            setName(spot.name)
            setDescription(spot.description)
            setPrice(spot.price)
            setUrl(spot.url)
        }
    }, [spot])

    const clearData = () => {
        setAddress("")
        setCity("")
        setState("")
        setCountry("")
        setName("")
        setDescription("")
        setPrice("")
        setErrors([])
        setHasSubmitted(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setHasSubmitted(true)

        let errorsArr = []

        if (!address.length) errorsArr.push("Please enter a address")
        if (!city.length) errorsArr.push("Please enter a city")
        if (!state.length) errorsArr.push("Please enter a state")
        if (!country.length) errorsArr.push("Please enter a country")
        if (!name.length || name.length > 50) errorsArr.push("Please enter a name less than 50 characters long")
        if (!description.length || description.length > 255) errorsArr.push("Please enter a description less than 255 characters long")
        if (!price || price <= 0) errorsArr.push("Please enter a price greater than 0")

        setErrors(errorsArr)

        const spotInfo = {
            ...spot, address, city, state, country, name, description, price, url: spot.SpotImages[0].url
        }

        const updatedSpot = await dispatch(editSpotThunk(spotInfo, +spotId))


        if (updatedSpot) {
            clearData()
            history.push("/myspots")
        }
    }

    const cancelButton = (e) => {
        e.preventDefault()
        history.push("/myspots")
    }

    if (!Object.values(spot).length) return null;

    return (
        <div className="edit-form-container">
            <h2 className="edit-form-header-container">
                Edit Your Spot:
            </h2>
            <div className="validation-errors">
                {hasSubmitted && errors?.map((error) => (<div key={error}>{error}</div>))}
            </div>

            <div className="edit-form-container edit-form-input-wrapper">
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={updateName}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        Address:
                        <input type="text" value={address} onChange={updateAddress}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        City:
                        <input type="text" value={city} onChange={updateCity}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        State:
                        <input type="text" value={state} onChange={updateState}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        Country:
                        <input type="text" value={country} onChange={updateCountry}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        Description:
                        <textarea type="text" value={description} onChange={updateDescription}>
                        </textarea>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <label>
                        Price:
                        <input type="number" value={price} onChange={updatePrice}>
                        </input>
                    </label>
                    <div className="edit-form-input-break"></div>
                    <button className="submit-button">
                        Update Your Spot!
                    </button>
                    <button onClick={cancelButton} className="submit-button">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditSpotForm
