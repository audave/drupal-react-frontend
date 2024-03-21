import React, {useState} from "react";
// import useSemiPersistentState from "./semiPersistentState";
import {getAuthClient} from './utils/auth';

const auth = getAuthClient();

const DRUPAL_BASEURL = process.env.REACT_APP_DRUPAL_BASEURL;

const DraggableArticle = ({item, onRemoveItem, cookie}) => {
    let image_url = item.field_image.image_style_uri.react_app;

    let article_key = 'article_' + item.id;

    const [Offset, setOffset] = useState(
        JSON.stringify({x: 0, y: 0}),
    );

    const [startingOffset, setStartingOffset] = useState(
        JSON.stringify({x: 0, y: 0}),
    );

    const [isDragging, setIsDragging] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)

    const dragStartEvent = (event) => {
        setStartingOffset(JSON.stringify({x: event.clientX, y: event.clientY}));
        setIsDragging(true);
    };

    const dragEndEvent = (event) => {
        if(!isDismissed) {
            setOffset(JSON.stringify({x: 0, y: 0}));
        }
        setIsDragging(false);
    }

    const dragEvent = (event) => {
        console.log(event);
        if (event.clientX !== 0) {
            if((event.clientX - JSON.parse(startingOffset).x) > 300 ||
                (event.clientX - JSON.parse(startingOffset).x) < -300
            ) {

                if((event.clientX - JSON.parse(startingOffset).x) > 300 ) {
                    buttonClick('upvote');
                    return;
                }

                if((event.clientX - JSON.parse(startingOffset).x) < -300 ) {
                    buttonClick('downvote');
                    return;
                }
            }


            setOffset(JSON.stringify({
                x: event.clientX - JSON.parse(startingOffset).x,
                y: event.clientY - JSON.parse(startingOffset).y,
            }))

        }
    };

    const buttonClick = (value) => {
        let data = {
            id: item.id,
            value: value,
        }
        const fetchOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data)
        };

        if(value === 'upvote') {
            setOffset(JSON.stringify({x: 2000, y: 0}));
        }
        if(value === 'downvote') {
            setOffset(JSON.stringify({x: -2000, y: 0}));
        }
        setIsDismissed(true);
        setIsDragging(false);

        auth.fetchWithAuthentication('/article-update/vote-endpoint', fetchOptions)
            .then(r => {
                onRemoveItem(item.id);
            })
    };

    let offset_object = JSON.parse(Offset);
    let transform = 'translate(' + offset_object.x + 'px,' + offset_object.y + 'px)';

    let total_votes = item.field_upvotes + item.field_downvotes;
    let dog_popularity = Math.floor((total_votes ? item.field_upvotes/total_votes : 0.5) * 100);
    let popularity_slider = 'translateX(' + dog_popularity + '%)';
    let cssClasses = 'article ' + (isDragging ? 'dragging' : 'not-dragging');
    return (
        <div className={cssClasses}
             onDrag={(event) => dragEvent(event, article_key)}
             onDragStart={(event) => dragStartEvent(event)}
             onDragEnd={(event) => dragEndEvent(event)}
             style={{'transform': transform}}
        >
            <h2>{item.title}</h2>
            <img src={image_url}/>
            <h4>How popular is my dog</h4>
            <div className={'results-bar'}>
                <div className={'dog-emoji'}
                      title="popularity scale"
                      style={{'transform': popularity_slider}}
                >&#128054;</div>
            </div>
            <span>Downvotes: {item.field_downvotes}</span>
            <span>Upvotes: {item.field_upvotes}</span>
            <div className={'buttons-container'}>
                <button value="downvote" onClick={() => buttonClick('downvote')}>Down Vote</button>
                <button value="upvote" onClick={() => buttonClick('upvote')}>Up Vote</button>
            </div>
        </div>
    );
}

export default DraggableArticle;