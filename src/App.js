import './App.css';
import React, { useState, useEffect } from 'react';
import useSemiPersistentState from "./semiPersistentState";
import DraggableArticle from "./DraggableArticle";

import LoginForm from "./components/LoginForm";


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
                    story => action.payload !== story.id
                ),
            };
        default:
            throw new Error();
    }
};

const App = () => {

    const [cookie, setCookie] = useState(null);

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    const handleRemoveItem = item => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    };

    React.useEffect(() => {
        dispatchStories({type: 'STORIES_FETCH_INIT'});

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
    }, []);


    return (
        <div>
            <LoginForm />
            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <div className={'main-container'}>
                    <h1>we've got data</h1>
                    <List
                        list={stories.data}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>
            )}
        </div>
    );
};


const List = ({list, onRemoveItem}) => {
    var ListItems = list.map(item => (<DraggableArticle
        key={item.id}
        item={item}
        onRemoveItem={onRemoveItem}
    />));

    return (<div className={'article-list'}>
            {ListItems}
        </div>
    );
}
export default App;