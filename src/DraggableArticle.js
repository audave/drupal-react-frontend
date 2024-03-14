import React from "react";
import useSemiPersistentState from "./semiPersistentState";


const DRUPAL_BASEURL = 'http://localhost:57660';

const DraggableArticle = ({item}) => {
    let image_url = DRUPAL_BASEURL + item.field_image.uri.url;

    let article_key = 'article_' + item.id;

    const [Offset, setOffset] = useSemiPersistentState(
        article_key,
        JSON.stringify({x: 0, y: 0}),
    );

    const [finishingOffset, setFinishingOffset] = useSemiPersistentState(
        article_key + '_finish',
        JSON.stringify({x: 0, y: 0}),
    );

    const [startingOffset, setStartingOffset] = useSemiPersistentState(
        article_key + '_start',
        JSON.stringify({x: 0, y: 0}),
    );

    const dragStartEvent = (event) => {
        setStartingOffset(JSON.stringify({x: event.clientX, y: event.clientY}));
    };

    const dragEndEvent = (event) => {
        setFinishingOffset(Offset);
    }

    const dragEvent = (event) => {
        // console.log(event);
        if(event.clientX !== 0) {
            setOffset(JSON.stringify({
                x: JSON.parse(finishingOffset).x + event.clientX - JSON.parse(startingOffset).x,
                y: JSON.parse(finishingOffset).y + event.clientY - JSON.parse(startingOffset).y,
            }))

        }
    };

    const buttonClick = (value) => {
        let data = {
            id: item.id,
            value: value,
        }

        fetch('http://localhost:57660/article-update/vote-endpoint', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(r => {})
    };

    let offset_object = JSON.parse(Offset);
    let transform = 'translate('+ offset_object.x + 'px,' + offset_object.y +'px)';

    return (
        <div className={'article'}
             onDrag={(event) => dragEvent(event, article_key)}
             onDragStart={(event) => dragStartEvent(event)}
             onDragEnd={(event) => dragEndEvent(event)}
             style={{ 'transform': transform}}
        >
            <h2>{item.title}</h2>
            <img src={image_url}/>
            <div className={'buttons-container'}>
                <button value="downvote" onClick={() => buttonClick('downvote')}>Down Vote</button>
                <button value="upvote" onClick={() => buttonClick('upvote')}>Up Vote</button>
            </div>
        </div>
    );
}

export default DraggableArticle;