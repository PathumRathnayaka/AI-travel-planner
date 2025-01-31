import React, {useEffect, useState} from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {Input} from "@/components/ui/input.jsx";
import {SelectBudgetOptions, SelectTravelsList} from "@/constants/option.jsx";
import {Button} from "@/components/ui/button.jsx";

function CreateTrip(){
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState([]);
    const handleinputChange = (name,value) => {
        setFormData({
            ...formData,
            [name]: value})
    }

    const onGenerateTrip = () => {
        if(formData?.NoOfDays>5 && !formData?.Budget || !formData?.location || !formData?.travels){
            return;
        }
        console.log(formData);
    }

    useEffect(() => {
        console.log(formData)
    }, [formData]);

    return(
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
            <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
            <div className='mt-20 flex flex-col gap-9'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                        selectProps={{
                            place, onChange: (v) => {
                                setPlace(v); handleinputChange('location',v)
                            }
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
                    <Input placeholder="Enter number of days" type='number'
                           onChange={(e) => handleinputChange('NoOfDays',e.target.value)}/>

                </div>
                <div>
                    <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {SelectBudgetOptions.map((item, index) => (
                            <div key={index}
                                 onClick={ () => handleinputChange('Budget',item.title)}
                                 className={`p-4 border rounded-lg hover:shadow cursor-pointer
                                 ${formData?.Budget === item.title && 'shadow-lg border-black'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-gray-500 text-sm'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {SelectTravelsList.map((item, index) => (
                            <div key={index}
                                 onClick={ () => handleinputChange('traveler',item.people)}
                                 className={`p-4 border rounded-lg hover:shadow cursor-pointer
                                 ${formData?.traveler === item.people && 'shadow-lg border-black'}`}>
                                <h2 className='text-4xl'>{item.icon}</h2>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <h2 className='text-gray-500 text-sm'>{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='my-10 justify-end flex'>
                    <Button onClick={onGenerateTrip}>Generate Trip</Button>
                </div>
            </div>

        </div>
    )
}

export default CreateTrip