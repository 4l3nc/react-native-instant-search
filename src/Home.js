import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  Image,
  StatusBar,
  Button,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { InstantSearch, Index, Configure } from 'react-instantsearch/native';
import {
  connectSearchBox,
  connectStats,
  connectHits,
} from 'react-instantsearch/connectors';
import Highlight from './components/Highlight';
import Spinner from './components/Spinner';
import StarRating from 'react-native-star-rating';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchBoxContainer: {
    backgroundColor: '#162331',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    backgroundColor: 'white',
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    flexGrow: 1,
    ...Platform.select({
      ios: {
        borderRadius: 5,
      },
      android: {},
    }),
  },
  itemContent: {
    paddingLeft: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  starRating: { alignSelf: 'flex-start' },
});
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchState: this.props.searchState ? { ...this.props.searchState, query: '' } : { query: '' },
    };
  }

  onSearchStateChange = nextState => {
    this.setState({ searchState: { ...this.state.searchState, ...nextState } });
  };

  render() {
    const { searchState: { query } } = this.state;

    return (
      <ScrollView style={styles.maincontainer}>
        <InstantSearch
          appId="J9A2Q6HWFT"
          apiKey="045508f368d697ab4ad2653a90b0e6e5"
          indexName="dev_uk_sports_en"
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
        >
          <StatusBar backgroundColor="blue" barStyle="light-content" />
          <ConnectedSearchBox />
          {query !== '' && 
            <React.Fragment>
              <Index indexName="dev_uk_sports_en">
                <Configure hitsPerPage={5} />
                <ConnectedHitsSports />
                <View style={{ backgroundColor: 'red', height: 25}}></View>
              </Index>
              <Index indexName="dev_uk_fixtures_en">
                <Configure hitsPerPage={5} />
                <ConnectedHitsFix />
              </Index>
            </React.Fragment>
          }
        </InstantSearch>
      </ScrollView>
    );
  }
}

Home.propTypes = {
  searchState: PropTypes.object,
};

export default Home;

class SearchBox extends Component {
  render() {
    return (
      <View style={styles.searchBoxContainer}>
        <Spinner left={60} />
        <TextInput
          style={styles.searchBox}
          onChangeText={text => this.props.refine(text)}
          value={this.props.currentRefinement}
          placeholder={'Search a result...'}
          clearButtonMode={'always'}
          underlineColorAndroid={'white'}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'none'}
        />
      </View>
    );
  }
}

SearchBox.propTypes = {
  refine: PropTypes.func.isRequired,
  currentRefinement: PropTypes.string,
};

const ConnectedSearchBox = connectSearchBox(SearchBox);

class Hits extends Component {
  onEndReached = () => {
    if (this.props.hasMore) {
      this.props.refine();
    }
  };

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const hits =
      this.props.hits.length > 0 ? (
        <View>
          <ListView
            dataSource={ds.cloneWithRows(this.props.hits)}
            renderRow={this._renderRow}
            onEndReached={this.onEndReached}
          />
        </View>
      ) : null;
    return hits;
  }

  _renderRow = (hit, sectionId, rowId) => (
    <View style={styles.item} key={rowId}>
      <Image style={{ height: 100, width: 100 }} source={{ uri: hit.image }} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>
          <Highlight
            attributeName="title"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text style={styles.itemName}>
          <Highlight
            attributeName="name"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <View style={styles.starRating}>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={5}
            starSize={15}
            starColor="#FBAE00"
          />
        </View>
      </View>
    </View>
  );
}

Hits.propTypes = {
  hits: PropTypes.array.isRequired,
};

const ConnectedHitsSports = connectHits(Hits);
const ConnectedHitsFix = connectHits(Hits);
