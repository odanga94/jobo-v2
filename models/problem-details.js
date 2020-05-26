class ProblemDetails {
    constructor(
        problemName,
        problemField,
        partThatNeedsWorkField,
        roomThatNeedsWorkField,
        optionalInfoField,
        needsPicture,
        buildingType,
        equipmentNeeded,
        bucketsOfClothes,
        numberOfTrucks,
        mealDescription,
        numberOfPeople,
        serviceNeeded,
        proGender
    ) {
        this.problemName = problemName;
        this.problemField = problemField;
        this.partThatNeedsWorkField = partThatNeedsWorkField;
        this.roomThatNeedsWorkField = roomThatNeedsWorkField;
        this.optionalInfoField = optionalInfoField;
        this.needsPicture = needsPicture;
        this.buildingType = buildingType;
        this.equipmentNeeded = equipmentNeeded;
        this.bucketsOfClothes = bucketsOfClothes;
        this.numberOfTrucks = numberOfTrucks;
        this.mealDescription = mealDescription;
        this.numberOfPeople = numberOfPeople;
        this.serviceNeeded = serviceNeeded;
        this.proGender = proGender
    }
}

export default ProblemDetails;