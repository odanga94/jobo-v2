import ProblemDetails from '../models/problemDetails';

export const PlumbingDetails = new ProblemDetails(
    "plumbing",
    { items: ['Installation Work', 'Burst', 'Leak', 'Clog', 'Noisy', 'Unpleasant odor', 'Poor pressure', 'Poor temperature', 'Fixture not draining or flushing', 'Appliance not working', 'Others'] },
    { fieldName: 'What part of the plumbing system needs work ?', items: ['Pipes and drains', 'Toilet', 'Sink', 'Shower or bathtub', 'Washing machine', 'Water heater', 'Septic tank', 'Well system', 'Others']},
    { fieldName: 'Which room requires plumbing work ?', items: ['Bathroom', 'Kitchen', 'Laundry room', 'Outdoors', 'Toilet', 'Entire building', 'Others']},
    true,
    true
);

export const CleaningDetails = new ProblemDetails(
    "cleaning",
    undefined,
    undefined,
    { fieldName: 'How many rooms require cleaning ?', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ">10"] },
    true,
    true,
    { fieldName: "I need house cleaning in a :", items: ['Apartment', 'One-story house', 'Two-story house', 'Others'] },
    { fieldNames: "cleaning equipment and supplies is provided by", items: ['cleaner', 'me']}
);