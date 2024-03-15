import './App.css';
import React from 'react';
import useSemiPersistentState from "./semiPersistentState";
import DraggableArticle from "./DraggableArticle";


const DRUPAL_ENDPOINT = process.env.REACT_APP_DRUPAL_ARTICLE_ENDPOINT;
const DRUPAL_BASEURL = process.env.REACT_APP_DRUPAL_BASEURL;


const storiesReducer = (state, action) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            console.log(action);
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    story => action.payload.objectID !== story.objectID
                ),
            };
        default:
            throw new Error();
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useSemiPersistentState(
        'search',
        'React'
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    React.useEffect(() => {
        if (searchTerm === '') return;

        dispatchStories({type: 'STORIES_FETCH_INIT'});

        // fetch(`${API_ENDPOINT}${searchTerm}`)
        fetch(`${DRUPAL_ENDPOINT}`)
            .then(response => response.json())
            .then(result => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.data,
                });
            })
            .catch(() =>
                dispatchStories({type: 'STORIES_FETCH_FAILURE'})
            );
    }, [searchTerm]);


    return (
        <div>
            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <div className={'main-container'}>
                    <h1>we've got data</h1>
                    <List list={stories.data} />
                </div>
            )}
        </div>
    );
};


const List = ({list}) => {
    var ListItems = list.map(item => (<DraggableArticle
        key={item.id}
        item={item}
    />));

    return (<div className={'article-list'}>
            {ListItems}
        </div>
    );
}
export default App;