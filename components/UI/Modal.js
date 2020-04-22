import React from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    View,
    StyleSheet
} from 'react-native';

const ModalCmp = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}
        >
            <TouchableWithoutFeedback onPress={props.pressed} >
                <View style={styles.bigContainer}>
                    <TouchableWithoutFeedback>
                        {props.children}
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bigContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default ModalCmp;