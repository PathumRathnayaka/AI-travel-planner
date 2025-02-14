import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from "@/components/ui/input.jsx";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from "@/constants/option.jsx";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/hooks/use-toast.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { chatSession } from "@/service/AIModal.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig.jsx";

function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleinputChange = (name, value) => {
        console.log(`Updating ${name} with value:`, value); // Debugging
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log(codeResponse);
            GetUserProfile(codeResponse);
        },
        onError: () => console.log('Login Failed')
    });

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo.access_token}`,
                Accept: 'application/json'
            }
        }).then((res) => {
            console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            setOpenDialog(false);
        }).catch((error) => {
            console.error("Error fetching user profile:", error);
        });
    };

    const SaveAITrip = async (tripdata) => {
        console.log("tripData:", tripdata);

        if (!tripdata || typeof tripdata !== "string") {
            console.error("Error: Invalid tripData!", tripdata);
            return; // Prevent saving invalid data
        }

        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            console.error("User is not authenticated");
            return;
        }


        const docId = Date.now().toString();

        await setDoc(doc(db, "AITrip", docId), {
            useSelection: formData,
            tripData: JSON.parse(tripdata),
            userEmail: user?.email,
            id: docId
        });
        console.log("Document successfully written!");
        setLoading(false);
    };

    const onGenerateTrip = async () => {
        console.log("Form Data:", formData);

        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (!formData?.NoOfDays || formData?.NoOfDays > 5 || !formData?.Budget || !formData?.location || !formData?.traveler) {
            console.log("Validation Failed: Missing Fields", formData);
            toast({
                title: 'Error',
                description: 'Please fill all the fields',
            });
            return;
        }

        setLoading(true);

        const final_Prompt = AI_PROMPT
            .replace('{location}', formData?.location.label)
            .replace('{NoOfDays}', formData?.NoOfDays)
            .replace('{Budget}', formData?.Budget)
            .replace('{travels}', formData?.traveler);

        console.log(final_Prompt);

        const result = await chatSession.sendMessage(final_Prompt);
        console.log("AI Response:", result);

        const tripData = result?.response?.text?.();
        console.log("tripData Extracted:", tripData);

        if (!tripData || typeof tripData !== "string") {
            console.error("Error: Invalid tripData!", tripData);
            setLoading(false);
            return;
        }

        SaveAITrip(tripData);
    };


    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            console.log(formData);
        }
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
                    <Button onClick={onGenerateTrip}>
                        {loading && <AiOutlineLoading3Quarters className='animate-spin'/>}
                        {loading ? 'Generating...' : 'Generate trip'}
                    </Button>
                </div>

                <Dialog open={openDialog}>

                    <DialogContent>
                        <DialogHeader>
                            <DialogDescription>
                                <img src='/logo.svg'/>
                                <h2 className='font-bold text-lg mt-7'>Sign with google</h2>
                                <p>Sign to the app with Google authentication security</p>
                                <Button onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                                    <FcGoogle className='h-7 w-7'/>Sign in with Google</Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>



            </div>

        </div>
    )
}

export default CreateTrip