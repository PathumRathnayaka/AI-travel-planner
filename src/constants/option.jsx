export const SelectTravelsList=[
    {id:1,title:'just Me',desc:'A sole travels in exploration',icon:'✈',people:1},
    {id:2,title:'Family',desc:'A family travels in exploration',icon:'👪',people:4},
    {id:3,title:'Group',desc:'A group travels in exploration',icon:'👥',people:3},
    {id:4,title:'Couple',desc:'A couple travels in exploration',icon:'💑',people:2},
    {id:5,title:'Friends',desc:'A friends travels in exploration',icon:'👫',people:5},
    {id:6,title:'Business',desc:'A business travels in exploration',icon:'💼',people:6},]

export const SelectBudgetOptions=[
    {
        id:1,
        title:'cheap',
        desc:'Stay conscious of cost',
        icon:'💵'
    },
    {
        id:2,
        title:'moderate',
        desc:'Keep cost on the average size',
        icon:'💰'
    },
    {
        id:3,
        title:'luxury',
        desc:'dont worry about cost',
        icon:'💸'
    }]

export const AI_PROMPT='Generate Travel Plan for Location: {location}, for {NoOfDays} Days for {travels} with a {Budget} budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.'