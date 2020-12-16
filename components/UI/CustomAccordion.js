import React from 'react';

import { View, Text } from 'react-native';
import { Accordion, Icon } from 'native-base';

import colors from '../../constants/colors';
import DefaultStyles from '../../constants/default-styles';

const CustomAccordion = props => {

    const _renderHeader = (item, expanded) => {
        return (
          <View 
            style={{
                flexDirection: "row",
                padding: 10,
                paddingLeft: 0,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgb(234, 232, 234)"
            }}
          >
          <Text style={{ ...DefaultStyles.titleText, color: "#505050", fontSize: 16 }}>
              {" "}{item.title}
            </Text>
            {expanded
              ? <Icon style={{ fontSize: 22 }} name="remove-circle" />
              : <Icon style={{ fontSize: 22 }} name="add-circle" />}
          </View>
        );
    }
    
    const _renderContent = (item) => {
        return (
            props.children
        );
    }

    return (

        <Accordion
            dataArray={props.dataArray}
            animation={true}
            expanded={true}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
        />

    );
}

export default CustomAccordion;