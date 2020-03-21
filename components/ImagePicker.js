import React from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    Alert, 
    TouchableOpacity, 
    Dimensions,
    ActionSheetIOS,
    Platform 
} from 'react-native';
import { ActionSheet } from 'native-base';
import * as ImgPicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const ImagePicker = props => {
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant camera permissions to take a picture',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    }

    const editPictureHandler = async (config) => { 
        const hasPermissions = await verifyPermissions();
        if (!hasPermissions) {
            return;
        }
        let image;
        if (config === 'launch-camera') {
            image = await ImgPicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5
            });
        } else {
            image = await ImgPicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5
            });
        }
        if (image.uri) {
            props.setImage(image.uri);
        }
    }

    const launchCameraActionSheet = () => {
        let buttons = ["Take Picture", "Choose from Gallery", "Delete Photo", "Cancel"];
        const DESTRUCTIVE_INDEX = 2;
        const CANCEL_INDEX = 3;
        if (!props.imageUri) {
            buttons = ["Take Picture", "Choose from Gallery", "Cancel"];
        }
        const buttonOptions = {
            options: buttons,
            cancelButtonIndex: CANCEL_INDEX,
            destructiveButtonIndex: DESTRUCTIVE_INDEX,
            title: "Edit Image"
        }
        const handleClicked = async (buttonIndexNumber) => {
            switch (buttonIndexNumber) {
                case 0:
                    editPictureHandler('launch-camera');
                    return;
                case 1:
                    editPictureHandler('launch-gallery');
                    return;
                case 2:
                    if (!props.imageUri){
                        return;
                    }
                    props.setImage(null);
                default:
                    return
            }
        }
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                buttonOptions,
                handleClicked,
            )
        } else {
            ActionSheet.show(
                buttonOptions,
                handleClicked
            );
        }
    }

    return (
        <View style={styles.imagePicker}>
            <TouchableOpacity style={styles.imagePreview} onPress={launchCameraActionSheet}>
                {!props.imageUri ?
                    <MaterialCommunityIcons size={30} color={Colors.secondary} name="image-plus" /> :
                    <Image
                        style={styles.image}
                        source={{ uri: props.imageUri }}
                        resizeMode="cover"
                    />
                }
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    imagePicker: {
        marginBottom: 7,
        marginTop: 3
    },
    imagePreview: {
        width: width / 2,
        height: width / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }

});

export default ImagePicker;