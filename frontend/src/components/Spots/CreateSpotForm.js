import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addSpotImageThunk, createSpotThunk, resetSpots } from "../../store/spots";
import "./CreateSpotForm.css";

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const sessionUser = useSelector((state) => state.session.user)

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateUrl = (e) => setUrl(e.target.value);


    useEffect(() => {
        if (sessionUser) setErrors([])
        else setErrors(["You must be logged in to host your home."])
    }, [sessionUser])

        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrors([])
            setHasSubmitted(true)

            let errorsArr = []

            if (!address.length) errorsArr.push("Please enter a address")
            if (!city.length) errorsArr.push("Please enter a city")
            if (!state.length) errorsArr.push("Please enter a state")
            if (!country.length) errorsArr.push("Please enter a country")
            if (!name.length || name.length > 50) errorsArr.push("Please enter a name less than 50 characters long")
            if (!description.length || description.length > 255) errorsArr.push("Please enter a description less than 255 characters long")
            if (!price || price <= 0) errorsArr.push("Please enter a price greater than 0")
            if (!url.length || !url.includes(".jpg" || ".jpeg" || ".png" || ".gif")) errorsArr.push("Please enter a valid URL less than 255 characters long")

            setErrors(errorsArr)

            const spotInfo = {
                address, city, state, country, lat: 50, lng: 50, name, description, price, url
            }

            const imageInfo = ({ url, preview: true})

            const newSpot = await dispatch(createSpotThunk(spotInfo, imageInfo))

            if (newSpot) {
                await dispatch(addSpotImageThunk(newSpot.id, imageInfo))
                resetSpots()
                history.push("/myspots")
            }

            const blankData = (newSpot) => {
                setAddress("");
                setCity("");
                setState("");
                setCountry("");
                setName("");
                setDescription("");
                setPrice("");
                setUrl("")
                setErrors([]);
                setHasSubmitted(false)

            };

        };


    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <button
                    onClick={() => history.push("/")}
                    style={{
                        padding: "0px",
                        height: "0px",
                        color: "black",
                        width: "20px",
                        position: "relative",
                        right: "163px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                    }}
                >
                    X
                </button>
                {errors.length !== 0 && (
                    <ul style={{ marginBottom: "0px" }}>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                )}
                <h4 style={{ marginTop: "0px" }}>Create a Listing</h4>
                <input
                    style={{ borderRadius: "10px 10px 0px 0px" }}
                    type={"text"}
                    placeholder={"Address"}
                    required
                    value={address}
                    onChange={updateAddress}
                />
                <input
                    type={"text"}
                    placeholder={"City"}
                    required
                    value={city}
                    onChange={updateCity}
                />
                <input
                    type={"text"}
                    placeholder={"State"}
                    required
                    value={state}
                    onChange={updateState}
                />
                <input
                    type={"text"}
                    placeholder={"Country"}
                    required
                    value={country}
                    onChange={updateCountry}
                />
                <input
                    type={"text"}
                    placeholder={"Name"}
                    required
                    value={name}
                    onChange={updateName}
                />
                <input
                    type={"text"}
                    placeholder={"Description"}
                    required
                    value={description}
                    onChange={updateDescription}
                />
                <input
                    type={"number"}
                    placeholder={"Price per night"}
                    required
                    min={1}
                    value={price}
                    onChange={updatePrice}
                />
                <input style={{borderRadius:"0px 0px 10px 10px" , marginBottom:"10px"}}
                type={"url"}
                placeholder={"Display image URL"}
                required
                value={url}
                onChange={updateUrl}
                />
                <button className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default CreateSpotForm;
