import React, { useState } from 'react';
import { View, Text } from 'react-native';

import ImagePicker from '../ImagePicker';
import ListButton from '../UI/ListButton';
import DefaultStyles from '../../constants/default-styles';

const Plumbing = props => {
    const [problemImage, setProblemImage] = useState();
    
    return (
        <View>
            <Text style={DefaultStyles.bodyText}>Would you like to add a photo to better desribe your problem ?</Text>
            <ImagePicker
                setImage={setProblemImage}
                imageUri={problemImage}
            />
        </View>
    )
}

export default Plumbing;