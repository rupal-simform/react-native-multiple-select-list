/**
 * Multiple select list with search
 * ataomega@gmail.com
 * www.atasmohammadi.net
 * version 1.0
 */
import React, { Component, PropTypes } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';

export default class CustomMultiPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageWidth: Dimensions.get('window').width,
      pageHeight: Dimensions.get('window').height,
      searchText: null,
      selected: new Array()
    };
  }

  componentDidMount = () => {
    const selected = this.props.selected
    if (typeof selected === "object" && selected.length > 0) {
      selected.map(select => {
        this.onSelect(select)
      })
    }
  }

  getNewDimensions(event) {
    const pageHeight = event.nativeEvent.layout.height
    const pageWidth = event.nativeEvent.layout.width
    this.setState({
      pageHeight, pageWidth
    })
  }

  onSelect = (item) => {
    let updatedSelection = this.state.selected
    if (this.props.multiple) {
      if (updatedSelection.indexOf(item) == -1) {
        updatedSelection.push(item)
        this.setState({
          selected: updatedSelection
        })
      } else {
        updatedSelection = updatedSelection.filter(i => i != item)
        this.setState({
          selected: updatedSelection
        })
      }
    } else {
      if (updatedSelection.indexOf(item) == -1) {
        updatedSelection = [item]
        this.setState({
          selected: updatedSelection
        })
      } else {
        updatedSelection = new Array()
        this.setState({
          selected: updatedSelection
        })
      }
    }
    this.props.callback(selected)
  }

  onSearch = (text) => {
    this.setState({
      searchText: text.length > 0 ? text.toLowerCase() : null
    })
  }

  isSelected = (item) => {
    const selected = this.state.selected
    if (selected.indexOf(item) == -1) {
      return false
    }
    return true
  }

  filterObjectByValue = (obj, predicate) => {
    return Object.keys(obj)
      .filter(key => predicate(obj[key]))
      .reduce((res, key) => (res[key] = obj[key], res), {})
  }

  render() {
    const { options, returnValue } = this.props;
    const list = this.state.searchText ? this.filterObjectByValue(options, option => option.toLowerCase().includes(this.state.searchText)) : options
    const labels = Object.keys(list).map(i => list[i])
    const values = Object.keys(list)
    return (
      <View onLayout={(evt) => { this.getNewDimensions(evt) }} style={{ flex: 1, marginBottom: 20 }}>
        {this.props.search && <View style={{ flexDirection: 'row', height: 100 }}>
          <View style={{ marginTop: 15, marginLeft: 15, backgroundColor: 'transparent' }}>
            <Icon name={this.props.searchIconName || "ios-search"} color={this.props.searchIconColor || this.props.iconColor} size={this.props.searchIconSize || this.props.iconSize || 25} />
          </View>
          <TextInput
            style={{
              width: this.state.pageWidth - 20,
              height: 35,
              margin: 0,
              marginTop: 10,
              marginLeft: -25,
              padding: 5,
              paddingLeft: 30,
              borderColor: this.props.iconColor,
              borderWidth: 1,
              borderRadius: 5
            }}
            onChangeText={(text) => { this.onSearch(text) }}
            clearButtonMode={'always'}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor}
            underlineColorAndroid={'transparent'}
          />
        </View>}
        <ScrollView
          contentContainerStyle={[{ padding: 5, height: this.props.scrollViewHeight }, this.props.scrollViewStyle]}
        >
          {labels.map((label, index) => {
            const itemKey = returnValue == "label" ? label : values[index]
            return (
              <TouchableOpacity
                key={Math.round(Math.random() * 1000000)}
                style={[{
                  padding: 7,
                  marginTop: 0,
                  marginLeft: 2,
                  marginRight: 2,
                  marginBottom: 6,
                  backgroundColor: this.props.rowBackgroundColor,
                  height: this.props.rowHeight,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: this.props.rowRadius
                },
                this.props.itemStyle
                ]}
                onPress={() => {
                  this.onSelect(itemKey)
                }}
              >
                {React.isValidElement(label)
                  ?
                  label
                  :
                  <Text style={this.props.labelStyle}>{label}</Text>
                }
                {

                  this.isSelected(itemKey) ?
                    <Image
                      source={this.props.selectedIconName}
                      style={[{ height: this.props.iconSize, width: this.props.iconSize }, this.props.selectedIconStyle]}
                    />
                    :
                    <Image
                      source={this.props.unselectedIconName}
                      style={[{ height: this.props.iconSize, width: this.props.iconSize }, this.props.unselectedIconStyle]}
                    />
                }
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}
