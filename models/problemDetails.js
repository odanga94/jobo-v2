class ProblemDetails {
    constructor(
        problemName,
        problemField,
        partThatNeedsWorkField,
        roomThatNeedsWorkField,
        optionalInfoField,
        needsPicture,
        buildingType,
        equipmentNeeded
    ) {
        this.problemName = problemName,
        this.problemField = problemField,
        this.partThatNeedsWorkField = partThatNeedsWorkField,
        this.roomThatNeedsWorkField = roomThatNeedsWorkField,
        this.optionalInfoField = optionalInfoField,
        this.needsPicture = needsPicture,
        this.buildingType = buildingType,
        this.equipmentNeeded = equipmentNeeded
    }
}

export default ProblemDetails;