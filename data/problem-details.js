import ProblemDetails from '../models/problem-details';

const numberItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "> 10"];
const trucksArr = numberItems.map(number => {
    if(number === 1){
        return number + " truck";
    }
    return number + " trucks"
});

export const PlumbingDetails = new ProblemDetails(
    "plumbing",
    { fieldName: 'What problem are you having ?', items: ['Installation Work', 'Burst', 'Leak', 'Clog', 'Noisy', 'Unpleasant odor', 'Poor pressure', 'Poor temperature', 'Fixture not draining or flushing', 'Appliance not working', 'Others'] },
    { fieldName: 'What part of the plumbing system needs work ?', items: ['Pipes and drains', 'Toilet', 'Sink', 'Shower or bathtub', 'Washing machine', 'Water heater', 'Septic tank', 'Well system', 'Others']},
    { fieldName: 'Which room requires plumbing work ?', items: ['Bathroom', 'Kitchen', 'Laundry room', 'Outdoors', 'Toilet', 'Entire building', 'Others']},
    true,
    true
);

export const CleaningDetails = new ProblemDetails(
    "cleaning",
    undefined,
    undefined,
    { fieldName: 'How many rooms require cleaning ?', items: numberItems, manySelectable: "no" },
    true,
    true,
    { fieldName: "I need house cleaning in a :", items: ['Apartment', 'One-story house', 'Two-story house', 'Others'], manySelectable: "no" },
    { fieldName: "Cleaning equipment and supplies is provided by", items: ['cleaner', 'me'], manySelectable: "no" },
    { fieldName: "How many buckets of clothes for washing ?", items: numberItems, manySelectable: "no"}
);

export const ElectricalDetails = new ProblemDetails(
    "electrical",
    { fieldName: 'What problem are you having ?', items: ['Fixture not working', 'Loss of power', 'Power surges', 'Sparks or popping sounds', 'Burning smell', 'Others'] },
    { fieldName: 'The fixtures that need work are', items: ['Lights', 'Switches', 'Outlets', 'Circuit breaker panel or fuse box', 'Wiring', 'Ceiling fan', 'Others']},
    undefined,
    true,
    true
);

export const PaintingDetails = new ProblemDetails(
    "painting",
    undefined,
    { fieldName: 'I need interior painting for', items: ['walls', 'ceiling', 'doors', 'window frames', 'others']},
    { fieldName: 'How many rooms need painting ?', items: numberItems, manySelectable: "no"},
    true,
    true,
    undefined,
    { fieldName: "Paint supplies are provided by", items: ['painter', 'me'], manySelectable: "no" },
);

export const BeautyDetails = new ProblemDetails(
    "beauty",
    { fieldName: 'What kind of beauty service would you like ?', items: ['Make up', 'Hair styling', 'Barber', 'Pedicure', 'Manicure'] },
    undefined,
    undefined,
    true,
    true,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { fieldName: "My gender preference for the professional is", items: ["male", "female", "it doesn't matter"], manySelectable: "no" }
);

export const MovingDetails = new ProblemDetails(
    "moving",
    undefined,
    undefined,
    undefined,
    true,
    true,
    undefined,
    { fieldName: "How many trucks do you need ?", items: trucksArr, manySelectable: "no"},
    undefined
);

export const ITDetails = new ProblemDetails(
    "IT",
    { fieldName: "What IT issue are you having ?", items: ["OS installation", "Mobile phone repair", "Computer crashed", "Software installation", "Others"] },
    { fieldName: "Your operating system is", items: ["Windows", "Mac OS", "Linux", "Android", "iOS"] },
    undefined,
    true,
    true
);

export const PestControlDetails = new ProblemDetails(
    "Pest Control",
    { fieldName: "Which pests would you like exterminated ?", items: ["Coakroaches", "Bed-bugs", "Rats", "Ants", "Mosquitoes", "Others"] },
    undefined,
    { fieldName: 'Which room requires work ?', items: ['Bedrooms', 'Kitchen', 'Living room', 'Outdoors', 'Bathroom', 'Entire building', 'Others']},
    true,
    true
);

export const GardeningDetails = new ProblemDetails(
    "gardening",
    { fieldName: "What kind of gardening work would you like ?", items: ["Landscaping"] },
    undefined,
    undefined,
    true,
    true,
    undefined,
    { fieldName: "Seedlings and other equipment to be provided by", items: ["me", "the gardener"], manySelectable: "no" },
);

export const CookingDetails = new ProblemDetails(
    "cooking",
    undefined,
    undefined,
    undefined,
    true,
    true,
    undefined,
    { fieldName: "Ingredients for the meal to be provided by", items: ["me", "the cook"], manySelectable: "no" },
    undefined,
    undefined,
    true,
    { fieldName: "How many people will be cooked for ?", items: numberItems, manySelectable: "no" }
);

export const TaxDetails = new ProblemDetails(
    "taxes",
    { fieldName: "What kind of service would you like ?", items: ["Filing returns", "Account problem", "Others"]},
    undefined,
    undefined,
    true,
    true
);

export const CarpenterDetails = new ProblemDetails(
    "carpenting",
    { fieldName: "What needs to be fixed ?", items: ["Bed", "Chairs", "Sofa", "Shelves", "Door", "Windows", "Stairs", "Others"] },
    undefined,
    undefined,
    true,
    true
);

export const WellnessDetails = new ProblemDetails(
    "wellness",
    undefined,
    undefined,
    undefined,
    true,
    true,
    undefined,
    { fieldName: "Training equipment to be provided by", items: ["me", "the instructor"], manySelectable: "no" },
    undefined,
    undefined,
    undefined,
    undefined,
    { fieldName: "What type of wellness service would you like?", items: ["Personal Trainer", "Yoga Instructor", "Nutritionist", "Massage Therapist"], manySelectable: "no" },
    { fieldName: "My gender preference for the instructor is", items: ["male", "female", "it doesn't matter"], manySelectable: "no" }
);

export const EventsDetails = new ProblemDetails(
    "events",
    { fieldName: 'What type of event are you having ?', items: ['Wedding', 'Corporate Event', 'Family Event', 'Others'], manySelectable: "no" },
    undefined,
    undefined,
    true,
    true,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { fieldName: "How many people will your event host ?", items: ["<50", "50 - 100", "101 - 150", "151 - 200", "201 - 250", "251 - 300", "more than 300"], manySelectable: "no" },
    { fieldName: 'What kind of service would you like ?', items: ['Catering', 'Event Photography', 'Equipment Rental', 'Live Band', 'DJ', 'Decor', 'Event Hair Stylist', 'Event Makeup Artist', 'Others'] },

);

export const BuilderDetails = new ProblemDetails(
    "building",
    undefined,
    undefined,
    undefined,
    true,
    true,
    { fieldName: "What type of house would you like built ?", items: ['Apartment', 'One-story house', 'Two-story house', 'Others'], manySelectable: "no" },
);

export const TilesDetails = new ProblemDetails(
    "tiles",
    undefined,
    undefined,
    { fieldName: 'Which room(s) would you like to be tiled ?', items: ['Bathroom', 'Kitchen', 'Laundry room', 'Outdoors', 'Toilet', 'Entire building', 'Others']},
    true,
    true,
);

export const GraphicDesignDetails = new ProblemDetails(
    "graphicDesign",
    undefined,
    undefined,
    undefined,
    true,
    true,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { fieldName: 'What kind of design work would you like ?', items: ['Logo Design', 'Web Design', 'Brand Identity Design', 'Photo Editing', 'Others'] }
);