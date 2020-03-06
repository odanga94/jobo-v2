import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import ImagePicker from '../ImagePicker';
import DefaultStyles from '../../constants/default-styles'

const Plumbing = props => {
    const [problemImage, setProblemImage] = useState();

    return (
        <ScrollView>
            <Text style={DefaultStyles.bodyText}>Would you like to add a photo to better desribe your problem ?</Text>
            <ImagePicker 
                setImage={setProblemImage} 
                imageUri={problemImage}
            />
        </ScrollView>
    )
}

export default Plumbing;